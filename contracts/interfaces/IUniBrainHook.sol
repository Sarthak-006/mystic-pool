// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IUniBrainHook {
    struct FeeRecommendation {
        uint24 baseFee;
        uint24 dynamicFee;
        uint256 volatilityScore;
        uint256 timestamp;
        bytes32 aiModelHash;
    }

    struct CrossChainSignal {
        uint256 sourceChainId;
        address sourcePool;
        uint256 volume24h;
        uint256 priceImpact;
        uint256 timestamp;
    }

    event FeeUpdated(
        address indexed pool,
        uint24 oldFee,
        uint24 newFee,
        uint256 volatilityScore,
        uint256 timestamp
    );

    event CrossChainSignalReceived(
        uint256 indexed sourceChainId,
        address indexed sourcePool,
        uint256 volume24h,
        uint256 priceImpact
    );

    event AIAnalysisRequested(
        address indexed pool,
        uint256 timestamp,
        bytes32 requestId
    );

    function getRecommendedFee(address pool) external view returns (FeeRecommendation memory);
    function getLatestCrossChainSignal(uint256 chainId) external view returns (CrossChainSignal memory);
    function updateFeeFromAI(address pool, uint24 newFee, uint256 volatilityScore, bytes32 aiModelHash) external;
}
