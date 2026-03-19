import { Router } from "express";
import { NvidiaAIService } from "../services/nvidia.js";

const router = Router();

let aiService;

function getAI() {
  if (!aiService) {
    aiService = new NvidiaAIService(process.env.NVIDIA_API_KEY);
  }
  return aiService;
}

router.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const result = await getAI().chat(message, history);
  res.json(result);
});

router.post("/analyze-fees", async (req, res) => {
  const { poolData } = req.body;

  if (!poolData) {
    return res.status(400).json({ error: "Pool data is required" });
  }

  const result = await getAI().analyzeFees(poolData);
  res.json(result);
});

router.post("/analyze-signal", async (req, res) => {
  const { signalData } = req.body;

  if (!signalData) {
    return res.status(400).json({ error: "Signal data is required" });
  }

  const result = await getAI().analyzeReactiveSignal(signalData);
  res.json(result);
});

export default router;
