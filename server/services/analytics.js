const POOLS = [
  {
    id: "pool-eth-usdc",
    tokenPair: "ETH/USDC",
    token0: { symbol: "ETH", name: "Ethereum", decimals: 18 },
    token1: { symbol: "USDC", name: "USD Coin", decimals: 6 },
    currentFee: 3000,
    tvl: 12500000,
    volume24h: 8750000,
    swapCount: 1247,
    priceChange24h: -2.34,
    volatilityIndex: 62,
    aiFee: 3500,
    aiConfidence: "high",
  },
  {
    id: "pool-wbtc-eth",
    tokenPair: "WBTC/ETH",
    token0: { symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8 },
    token1: { symbol: "ETH", name: "Ethereum", decimals: 18 },
    currentFee: 3000,
    tvl: 8200000,
    volume24h: 4300000,
    swapCount: 523,
    priceChange24h: 1.15,
    volatilityIndex: 45,
    aiFee: 2500,
    aiConfidence: "medium",
  },
  {
    id: "pool-arb-eth",
    tokenPair: "ARB/ETH",
    token0: { symbol: "ARB", name: "Arbitrum", decimals: 18 },
    token1: { symbol: "ETH", name: "Ethereum", decimals: 18 },
    currentFee: 3000,
    tvl: 3400000,
    volume24h: 2100000,
    swapCount: 892,
    priceChange24h: 5.67,
    volatilityIndex: 78,
    aiFee: 5000,
    aiConfidence: "high",
  },
  {
    id: "pool-uni-eth",
    tokenPair: "UNI/ETH",
    token0: { symbol: "UNI", name: "Uniswap", decimals: 18 },
    token1: { symbol: "ETH", name: "Ethereum", decimals: 18 },
    currentFee: 3000,
    tvl: 5100000,
    volume24h: 3200000,
    swapCount: 678,
    priceChange24h: -0.89,
    volatilityIndex: 35,
    aiFee: 2000,
    aiConfidence: "medium",
  },
];

const REACTIVE_EVENTS = [];

function generateRealtimeData() {
  const now = Date.now();
  return POOLS.map((pool) => {
    const volChange = (Math.random() - 0.5) * 10;
    const volumeChange = (Math.random() - 0.5) * 500000;
    const swapDelta = Math.floor(Math.random() * 20);

    return {
      ...pool,
      volatilityIndex: Math.max(
        5,
        Math.min(95, pool.volatilityIndex + volChange)
      ),
      volume24h: Math.max(100000, pool.volume24h + volumeChange),
      swapCount: pool.swapCount + swapDelta,
      priceChange24h: +(pool.priceChange24h + (Math.random() - 0.5) * 0.5).toFixed(2),
      lastUpdate: now,
    };
  });
}

function generateReactiveEvent() {
  const chains = [
    { id: 42161, name: "Arbitrum One" },
    { id: 10, name: "Optimism" },
    { id: 8453, name: "Base" },
    { id: 137, name: "Polygon" },
    { id: 1, name: "Ethereum Mainnet" },
  ];
  const types = [
    "large_swap",
    "liquidity_shift",
    "price_divergence",
    "volume_spike",
    "arbitrage_detected",
  ];

  const chain = chains[Math.floor(Math.random() * chains.length)];
  const pool = POOLS[Math.floor(Math.random() * POOLS.length)];
  const type = types[Math.floor(Math.random() * types.length)];

  const event = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sourceChain: chain,
    pool: pool.tokenPair,
    type,
    volume: Math.floor(Math.random() * 5000000) + 100000,
    priceImpact: +(Math.random() * 5).toFixed(2),
    timestamp: Date.now(),
    status: "processed",
    aiRecommendation:
      type === "arbitrage_detected"
        ? "Increase fee to 0.5% to capture arbitrage value"
        : type === "volume_spike"
          ? "Decrease fee to 0.15% to attract volume"
          : "Maintain current fee",
  };

  REACTIVE_EVENTS.unshift(event);
  if (REACTIVE_EVENTS.length > 50) REACTIVE_EVENTS.pop();

  return event;
}

// Seed some initial events
for (let i = 0; i < 15; i++) {
  generateReactiveEvent();
}

function generatePriceHistory(hours = 24) {
  const data = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100;

  let price = 2450 + Math.random() * 200;
  let fee = 3000;

  for (let i = 0; i < 100; i++) {
    const volatility = Math.random() * 100;
    price += (Math.random() - 0.5) * 50;

    if (volatility > 70) fee = Math.min(10000, fee + 200);
    else if (volatility < 30) fee = Math.max(100, fee - 200);

    data.push({
      timestamp: now - (100 - i) * interval,
      price: +price.toFixed(2),
      fee,
      volatility: +volatility.toFixed(1),
      volume: Math.floor(Math.random() * 500000) + 50000,
    });
  }

  return data;
}

function generateFeeHistory() {
  const data = [];
  const now = Date.now();
  let fee = 3000;

  for (let i = 0; i < 48; i++) {
    const adjustment = Math.floor((Math.random() - 0.5) * 500);
    fee = Math.max(100, Math.min(10000, fee + adjustment));

    data.push({
      timestamp: now - (48 - i) * 30 * 60 * 1000,
      fee,
      reason:
        adjustment > 0 ? "Volatility increase detected" : "Market stabilizing",
      aiConfidence: Math.random() > 0.3 ? "high" : "medium",
    });
  }

  return data;
}

export {
  POOLS,
  REACTIVE_EVENTS,
  generateRealtimeData,
  generateReactiveEvent,
  generatePriceHistory,
  generateFeeHistory,
};
