import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

export async function fetchPools() {
  const { data } = await api.get("/analytics/pools");
  return data.pools;
}

export async function fetchPoolDetail(id) {
  const { data } = await api.get(`/analytics/pools/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await api.get("/analytics/stats");
  return data;
}

export async function fetchReactiveEvents() {
  const { data } = await api.get("/analytics/reactive-events");
  return data;
}

export async function chatWithAI(message, history = []) {
  const { data } = await api.post("/ai/chat", { message, history });
  return data;
}

export async function analyzePoolFees(poolData) {
  const { data } = await api.post("/ai/analyze-fees", { poolData });
  return data;
}

export async function analyzeSignal(signalData) {
  const { data } = await api.post("/ai/analyze-signal", { signalData });
  return data;
}

export default api;
