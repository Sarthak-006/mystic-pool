import { Router } from "express";
import {
  POOLS,
  REACTIVE_EVENTS,
  generateRealtimeData,
  generateReactiveEvent,
  generatePriceHistory,
  generateFeeHistory,
} from "../services/analytics.js";

const router = Router();

router.get("/pools", (req, res) => {
  res.json({ pools: generateRealtimeData() });
});

router.get("/pools/:id", (req, res) => {
  const pool = POOLS.find((p) => p.id === req.params.id);
  if (!pool) return res.status(404).json({ error: "Pool not found" });

  const data = generateRealtimeData();
  const livePool = data.find((p) => p.id === req.params.id);

  res.json({
    pool: livePool,
    priceHistory: generatePriceHistory(24),
    feeHistory: generateFeeHistory(),
  });
});

router.get("/reactive-events", (req, res) => {
  const newEvent = generateReactiveEvent();
  res.json({ events: REACTIVE_EVENTS, latest: newEvent });
});

router.get("/stats", (req, res) => {
  const pools = generateRealtimeData();
  const totalTVL = pools.reduce((sum, p) => sum + p.tvl, 0);
  const totalVolume = pools.reduce((sum, p) => sum + p.volume24h, 0);
  const totalSwaps = pools.reduce((sum, p) => sum + p.swapCount, 0);
  const avgVolatility =
    pools.reduce((sum, p) => sum + p.volatilityIndex, 0) / pools.length;

  res.json({
    totalTVL,
    totalVolume,
    totalSwaps,
    avgVolatility: +avgVolatility.toFixed(1),
    poolCount: pools.length,
    reactiveEventCount: REACTIVE_EVENTS.length,
    chainsMonitored: 5,
    aiModelActive: true,
  });
});

export default router;
