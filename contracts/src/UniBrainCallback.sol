// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title UniBrain Callback Receiver
/// @notice Deployed on the destination chain to receive cross-chain signals
///         from the Reactive Network and forward them to the UniBrain Hook.
/// @dev Part of the Reactive Network RSC pattern. This contract acts as the
///      bridge between Reactive Network callbacks and the Uniswap v4 hook.
contract UniBrainCallback {
    address public immutable uniBrainHook;
    address public reactiveNetwork;
    address public owner;

    struct PendingSignal {
        uint256 sourceChainId;
        address sourcePool;
        uint256 volume24h;
        uint256 priceImpact;
        uint256 receivedAt;
        bool forwarded;
    }

    PendingSignal[] public pendingSignals;
    mapping(uint256 => uint256) public lastSignalTime;

    uint256 public constant SIGNAL_COOLDOWN = 15; // 15 seconds between signals from same chain
    uint256 public signalCount;

    event SignalReceived(uint256 indexed sourceChainId, address sourcePool, uint256 volume24h, uint256 priceImpact);
    event SignalForwarded(uint256 indexed sourceChainId, address indexed hook);
    event ReactiveNetworkUpdated(address oldAddress, address newAddress);

    error UnauthorizedCaller();
    error SignalCooldownActive();
    error OnlyOwner();

    modifier onlyReactiveNetwork() {
        if (msg.sender != reactiveNetwork) revert UnauthorizedCaller();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(address _uniBrainHook, address _reactiveNetwork) {
        uniBrainHook = _uniBrainHook;
        reactiveNetwork = _reactiveNetwork;
        owner = msg.sender;
    }

    /// @notice Called by Reactive Network with cross-chain swap data
    function onCrossChainSignal(
        uint256 sourceChainId,
        address sourcePool,
        uint256 volume24h,
        uint256 priceImpact
    ) external onlyReactiveNetwork {
        if (block.timestamp - lastSignalTime[sourceChainId] < SIGNAL_COOLDOWN) {
            revert SignalCooldownActive();
        }

        pendingSignals.push(PendingSignal({
            sourceChainId: sourceChainId,
            sourcePool: sourcePool,
            volume24h: volume24h,
            priceImpact: priceImpact,
            receivedAt: block.timestamp,
            forwarded: false
        }));

        lastSignalTime[sourceChainId] = block.timestamp;
        signalCount++;

        emit SignalReceived(sourceChainId, sourcePool, volume24h, priceImpact);

        _forwardToHook(sourceChainId, sourcePool, volume24h, priceImpact);
    }

    function _forwardToHook(
        uint256 sourceChainId,
        address sourcePool,
        uint256 volume24h,
        uint256 priceImpact
    ) internal {
        bytes memory data = abi.encodeWithSignature(
            "receiveCrossChainSignal(uint256,address,uint256,uint256)",
            sourceChainId,
            sourcePool,
            volume24h,
            priceImpact
        );

        (bool success,) = uniBrainHook.call(data);
        if (success) {
            pendingSignals[pendingSignals.length - 1].forwarded = true;
            emit SignalForwarded(sourceChainId, uniBrainHook);
        }
    }

    function updateReactiveNetwork(address _newReactiveNetwork) external onlyOwner {
        address old = reactiveNetwork;
        reactiveNetwork = _newReactiveNetwork;
        emit ReactiveNetworkUpdated(old, _newReactiveNetwork);
    }

    function getPendingSignalCount() external view returns (uint256) {
        return pendingSignals.length;
    }

    function getLatestSignals(uint256 count) external view returns (PendingSignal[] memory) {
        uint256 total = pendingSignals.length;
        if (count > total) count = total;

        PendingSignal[] memory signals = new PendingSignal[](count);
        for (uint256 i = 0; i < count; i++) {
            signals[i] = pendingSignals[total - count + i];
        }
        return signals;
    }
}
