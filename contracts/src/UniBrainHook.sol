// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";
import {IUniBrainHook} from "../interfaces/IUniBrainHook.sol";

/// @title UniBrain Hook - AI-Powered Dynamic Fee Optimization for Uniswap v4
/// @notice Uses NVIDIA Qwen AI analysis + Reactive Network cross-chain signals
///         to dynamically adjust swap fees, protecting LPs during volatility
///         and attracting volume during calm markets.
contract UniBrainHook is BaseHook, IUniBrainHook {
    using PoolIdLibrary for PoolKey;
    using LPFeeLibrary for uint24;

    uint24 public constant MIN_FEE = 100;     // 0.01%
    uint24 public constant MAX_FEE = 10000;   // 1%
    uint24 public constant DEFAULT_FEE = 3000; // 0.3%

    uint256 public constant VOLATILITY_THRESHOLD_LOW = 20;
    uint256 public constant VOLATILITY_THRESHOLD_HIGH = 80;
    uint256 public constant FEE_UPDATE_COOLDOWN = 30; // 30 seconds

    address public immutable aiOracle;
    address public immutable reactiveCallback;

    mapping(PoolId => FeeRecommendation) public feeRecommendations;
    mapping(PoolId => uint256) public lastFeeUpdate;
    mapping(PoolId => uint256) public swapCount;
    mapping(PoolId => uint256) public totalVolume;
    mapping(uint256 => CrossChainSignal) public crossChainSignals;

    uint256[] public monitoredChains;

    error UnauthorizedOracle();
    error UnauthorizedReactiveCallback();
    error FeeUpdateTooFrequent();
    error InvalidFeeRange();

    modifier onlyAIOracle() {
        if (msg.sender != aiOracle) revert UnauthorizedOracle();
        _;
    }

    modifier onlyReactiveCallback() {
        if (msg.sender != reactiveCallback) revert UnauthorizedReactiveCallback();
        _;
    }

    constructor(
        IPoolManager _poolManager,
        address _aiOracle,
        address _reactiveCallback
    ) BaseHook(_poolManager) {
        aiOracle = _aiOracle;
        reactiveCallback = _reactiveCallback;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: true,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function beforeInitialize(
        address,
        PoolKey calldata key,
        uint160
    ) external override returns (bytes4) {
        PoolId poolId = key.toId();
        feeRecommendations[poolId] = FeeRecommendation({
            baseFee: DEFAULT_FEE,
            dynamicFee: DEFAULT_FEE,
            volatilityScore: 50,
            timestamp: block.timestamp,
            aiModelHash: bytes32(0)
        });
        return BaseHook.beforeInitialize.selector;
    }

    /// @notice Dynamically adjusts the fee before each swap based on AI recommendations
    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        PoolId poolId = key.toId();

        FeeRecommendation memory rec = feeRecommendations[poolId];
        uint24 dynamicFee = rec.dynamicFee;

        if (dynamicFee < MIN_FEE) dynamicFee = MIN_FEE;
        if (dynamicFee > MAX_FEE) dynamicFee = MAX_FEE;

        uint24 lpFee = dynamicFee | LPFeeLibrary.OVERRIDE_FEE_FLAG;

        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, lpFee);
    }

    /// @notice Tracks swap metrics after each swap for AI analysis
    function afterSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta,
        bytes calldata
    ) external override returns (bytes4, int128) {
        PoolId poolId = key.toId();
        swapCount[poolId]++;

        uint256 absAmount = params.amountSpecified < 0
            ? uint256(-params.amountSpecified)
            : uint256(params.amountSpecified);
        totalVolume[poolId] += absAmount;

        if (swapCount[poolId] % 10 == 0) {
            emit AIAnalysisRequested(
                address(uint160(uint256(PoolId.unwrap(poolId)))),
                block.timestamp,
                keccak256(abi.encodePacked(poolId, block.timestamp, swapCount[poolId]))
            );
        }

        return (BaseHook.afterSwap.selector, 0);
    }

    /// @notice Called by the AI oracle backend to update fee recommendations
    function updateFeeFromAI(
        address pool,
        uint24 newFee,
        uint256 volatilityScore,
        bytes32 aiModelHash
    ) external override onlyAIOracle {
        if (newFee < MIN_FEE || newFee > MAX_FEE) revert InvalidFeeRange();

        PoolId poolId = PoolId.wrap(bytes32(uint256(uint160(pool))));

        if (block.timestamp - lastFeeUpdate[poolId] < FEE_UPDATE_COOLDOWN) {
            revert FeeUpdateTooFrequent();
        }

        uint24 oldFee = feeRecommendations[poolId].dynamicFee;

        feeRecommendations[poolId] = FeeRecommendation({
            baseFee: DEFAULT_FEE,
            dynamicFee: newFee,
            volatilityScore: volatilityScore,
            timestamp: block.timestamp,
            aiModelHash: aiModelHash
        });

        lastFeeUpdate[poolId] = block.timestamp;

        emit FeeUpdated(pool, oldFee, newFee, volatilityScore, block.timestamp);
    }

    /// @notice Called by Reactive Network callback to deliver cross-chain signals
    function receiveCrossChainSignal(
        uint256 sourceChainId,
        address sourcePool,
        uint256 volume24h,
        uint256 priceImpact
    ) external onlyReactiveCallback {
        crossChainSignals[sourceChainId] = CrossChainSignal({
            sourceChainId: sourceChainId,
            sourcePool: sourcePool,
            volume24h: volume24h,
            priceImpact: priceImpact,
            timestamp: block.timestamp
        });

        bool exists = false;
        for (uint256 i = 0; i < monitoredChains.length; i++) {
            if (monitoredChains[i] == sourceChainId) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            monitoredChains.push(sourceChainId);
        }

        emit CrossChainSignalReceived(sourceChainId, sourcePool, volume24h, priceImpact);
    }

    function getRecommendedFee(address pool) external view override returns (FeeRecommendation memory) {
        PoolId poolId = PoolId.wrap(bytes32(uint256(uint160(pool))));
        return feeRecommendations[poolId];
    }

    function getLatestCrossChainSignal(uint256 chainId) external view override returns (CrossChainSignal memory) {
        return crossChainSignals[chainId];
    }

    function getPoolMetrics(PoolId poolId) external view returns (uint256 swaps, uint256 volume) {
        return (swapCount[poolId], totalVolume[poolId]);
    }

    function getMonitoredChains() external view returns (uint256[] memory) {
        return monitoredChains;
    }
}
