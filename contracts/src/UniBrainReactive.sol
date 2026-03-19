// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title UniBrain Reactive Smart Contract
/// @notice Deployed on Reactive Network to monitor Uniswap v4 swap events
///         across multiple chains and trigger AI-driven fee updates via callbacks.
/// @dev Implements the Reactive Network RSC pattern: monitors events on source chains
///      and triggers callbacks on the destination chain where UniBrainHook is deployed.
contract UniBrainReactive {
    uint256 private constant REACTIVE_IGNORE = 0xa65f96fc951c35ead38571571f4351e06f168643;

    /// @dev Uniswap v4 Swap event topic
    bytes32 private constant SWAP_EVENT_TOPIC = keccak256("Swap(address,address,int256,int256,uint160,uint128,int24)");

    /// @dev Large swap threshold event topic (custom)
    bytes32 private constant LARGE_SWAP_TOPIC = keccak256("LargeSwapDetected(address,uint256,uint256)");

    uint256 public immutable destinationChainId;
    address public immutable callbackContract;

    struct MonitoredPool {
        uint256 chainId;
        address poolAddress;
        bool active;
    }

    MonitoredPool[] public monitoredPools;
    mapping(uint256 => mapping(address => uint256)) public poolSwapCounts;
    mapping(uint256 => mapping(address => uint256)) public poolVolumes;
    mapping(uint256 => uint256) public chainVolume24h;

    uint256 public constant VOLUME_REPORT_THRESHOLD = 10;
    uint256 public constant LARGE_SWAP_THRESHOLD = 1000 ether;

    event PoolMonitoringStarted(uint256 chainId, address pool);
    event SwapDetected(uint256 chainId, address pool, uint256 amount);
    event CrossChainCallbackTriggered(uint256 destinationChain, address callback, uint256 sourceChainId);

    constructor(uint256 _destinationChainId, address _callbackContract) {
        destinationChainId = _destinationChainId;
        callbackContract = _callbackContract;
    }

    /// @notice Add a pool to monitor on a specific chain
    function addMonitoredPool(uint256 chainId, address poolAddress) external {
        monitoredPools.push(MonitoredPool({
            chainId: chainId,
            poolAddress: poolAddress,
            active: true
        }));

        emit PoolMonitoringStarted(chainId, poolAddress);
    }

    /// @notice React to swap events detected on monitored chains
    /// @dev Called automatically by Reactive Network when a matching event is detected
    function react(
        uint256 chainId,
        address _contract,
        uint256 /* topic0 */,
        uint256 /* topic1 */,
        uint256 /* topic2 */,
        uint256 /* topic3 */,
        bytes calldata data
    ) external {
        (int256 amount0, int256 amount1,,) = abi.decode(data, (int256, int256, uint160, uint128));

        uint256 absAmount = amount0 < 0 ? uint256(-amount0) : uint256(amount0);

        poolSwapCounts[chainId][_contract]++;
        poolVolumes[chainId][_contract] += absAmount;
        chainVolume24h[chainId] += absAmount;

        emit SwapDetected(chainId, _contract, absAmount);

        bool shouldCallback = false;

        if (poolSwapCounts[chainId][_contract] % VOLUME_REPORT_THRESHOLD == 0) {
            shouldCallback = true;
        }

        if (absAmount >= LARGE_SWAP_THRESHOLD) {
            shouldCallback = true;
        }

        if (shouldCallback) {
            _triggerCallback(chainId, _contract);
        }
    }

    /// @notice Trigger a callback to the destination chain with aggregated data
    function _triggerCallback(uint256 sourceChainId, address sourcePool) internal {
        uint256 volume = poolVolumes[sourceChainId][sourcePool];
        uint256 priceImpact = _estimatePriceImpact(volume, poolSwapCounts[sourceChainId][sourcePool]);

        bytes memory callbackData = abi.encodeWithSignature(
            "onCrossChainSignal(uint256,address,uint256,uint256)",
            sourceChainId,
            sourcePool,
            chainVolume24h[sourceChainId],
            priceImpact
        );

        emit CrossChainCallbackTriggered(destinationChainId, callbackContract, sourceChainId);

        (bool success,) = callbackContract.call(callbackData);
        require(success, "Callback failed");
    }

    function _estimatePriceImpact(uint256 totalVolume, uint256 swapCount) internal pure returns (uint256) {
        if (swapCount == 0) return 0;
        uint256 avgSwapSize = totalVolume / swapCount;
        // Simplified price impact: larger avg swaps = higher impact (0-100 scale)
        if (avgSwapSize > 10000 ether) return 95;
        if (avgSwapSize > 1000 ether) return 75;
        if (avgSwapSize > 100 ether) return 50;
        if (avgSwapSize > 10 ether) return 25;
        return 10;
    }

    /// @notice Get subscription topics for Reactive Network
    function getSubscriptions() external view returns (
        uint256[] memory chainIds,
        address[] memory contracts,
        bytes32[] memory topics
    ) {
        chainIds = new uint256[](monitoredPools.length);
        contracts = new address[](monitoredPools.length);
        topics = new bytes32[](monitoredPools.length);

        for (uint256 i = 0; i < monitoredPools.length; i++) {
            chainIds[i] = monitoredPools[i].chainId;
            contracts[i] = monitoredPools[i].poolAddress;
            topics[i] = SWAP_EVENT_TOPIC;
        }
    }

    function getMonitoredPoolCount() external view returns (uint256) {
        return monitoredPools.length;
    }
}
