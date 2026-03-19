# MysticPool — AI Oracle for Uniswap v4 Dynamic Fees

> **UHI8 Hookathon: Specialized Markets** | Reactive Network Track

MysticPool is a Uniswap v4 hook that dynamically optimizes swap fees using **NVIDIA Qwen 3.5 122B AI** and **Reactive Network cross-chain monitoring**. It sees what static fee pools cannot — protecting LPs during volatility, attracting volume during calm markets, and capturing cross-chain arbitrage value.

---

## The Problem

Static swap fees are blind:

- **LPs bleed during volatility** — 0.3% doesn't compensate for 2-5% impermanent loss during crashes
- **Traders overpay in calm markets** — volume flows to competitors offering lower fees
- **Cross-chain arbitrage is invisible** — price divergence across L2s goes unexploited

## The Solution

MysticPool introduces an AI-powered fee oracle layer:

1. **Reactive Network RSCs** monitor swap events across Ethereum, Arbitrum, Optimism, Base, and Polygon
2. Cross-chain signals (volume spikes, large swaps, price divergence) are aggregated and forwarded via callbacks
3. **NVIDIA Qwen 3.5 122B** analyzes market conditions and computes optimal fees
4. The **MysticPool Hook** applies dynamic fees (0.01%–1%) through `beforeSwap` with safety bounds

## Architecture

```
  Ethereum ─┐
  Arbitrum ──┤
  Optimism ──┼──▶  Reactive Network (RSC)  ──▶  Callback Contract
  Base ──────┤     • Monitor swap events         • Forward signals
  Polygon ───┘     • Aggregate volumes            • Cooldown protection
                   • Detect anomalies
                           │
                           ▼
                    NVIDIA Qwen AI (122B)
                    • Volatility analysis
                    • Fee optimization
                    • Risk assessment
                           │
                           ▼
                    MysticPool Hook (Uniswap v4)
                    • beforeSwap: apply AI fee
                    • afterSwap: track metrics
                    • Fee range: 0.01% – 1.00%
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Hook | Solidity 0.8.24, Uniswap v4 BaseHook |
| Cross-Chain | Reactive Network RSCs |
| AI Model | NVIDIA Qwen 3.5 122B (NIM API) |
| Backend | Node.js, Express |
| Frontend | React, Tailwind CSS, Framer Motion |

## Smart Contracts

### `UniBrainHook.sol` — MysticPool Hook
- `beforeSwap` — AI-recommended dynamic fee with safety bounds
- `afterSwap` — Tracks swap metrics, triggers AI analysis requests
- `updateFeeFromAI` — Oracle endpoint for AI fee submissions
- `receiveCrossChainSignal` — Receives Reactive Network data

### `UniBrainReactive.sol` — Reactive Smart Contract
- Subscribes to Swap events across multiple chains
- Aggregates volume and detects large swaps
- Triggers callbacks when thresholds are met

### `UniBrainCallback.sol` — Callback Receiver
- Receives cross-chain signals from Reactive Network
- Forwards to MysticPool Hook with cooldown protection

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Consult the MysticPool Oracle |
| POST | `/api/ai/analyze-fees` | AI fee analysis for a pool |
| POST | `/api/ai/analyze-signal` | Analyze a reactive signal |
| GET | `/api/analytics/pools` | Pool data |
| GET | `/api/analytics/stats` | Global statistics |
| GET | `/api/analytics/reactive-events` | Cross-chain events |

## License

MIT
