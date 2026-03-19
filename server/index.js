import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MysticPool Oracle Server",
    model: process.env.NVIDIA_MODEL,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`\n✦ MysticPool Oracle Server running on http://localhost:${PORT}`);
  console.log(`✦ AI Model: ${process.env.NVIDIA_MODEL}`);
  console.log(`✦ Endpoints:`);
  console.log(`   POST /api/ai/chat           - Oracle consultation`);
  console.log(`   POST /api/ai/analyze-fees    - Fee analysis`);
  console.log(`   POST /api/ai/analyze-signal  - Signal analysis`);
  console.log(`   GET  /api/analytics/pools    - Pool data`);
  console.log(`   GET  /api/analytics/stats    - Global stats`);
  console.log(`   GET  /api/analytics/reactive-events - Cross-chain signals\n`);
});
