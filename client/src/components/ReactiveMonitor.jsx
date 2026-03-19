import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Zap,
  AlertTriangle,
  TrendingUp,
  ArrowRightLeft,
  Droplets,
  Globe,
  RefreshCw,
} from "lucide-react";
import { fetchReactiveEvents } from "../utils/api";

const typeConfig = {
  large_swap: { icon: ArrowRightLeft, color: "mystic-violet", label: "Large Swap" },
  liquidity_shift: { icon: Droplets, color: "mystic-gold", label: "Liquidity Shift" },
  price_divergence: { icon: AlertTriangle, color: "mystic-amber", label: "Price Divergence" },
  volume_spike: { icon: TrendingUp, color: "mystic-emerald", label: "Volume Spike" },
  arbitrage_detected: { icon: Zap, color: "mystic-rose", label: "Arbitrage" },
};

const CHAINS = [
  { id: 1, name: "Ethereum", short: "ETH", hex: "#627EEA" },
  { id: 42161, name: "Arbitrum", short: "ARB", hex: "#28A0F0" },
  { id: 10, name: "Optimism", short: "OP", hex: "#FF0420" },
  { id: 8453, name: "Base", short: "BASE", hex: "#0052FF" },
  { id: 137, name: "Polygon", short: "POL", hex: "#8247E5" },
];

function EventCard({ event, index }) {
  const config = typeConfig[event.type] || typeConfig.large_swap;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-mystic-hover p-5 group"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${config.color}/10 border border-${config.color}/15 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-${config.color}/[0.06] text-${config.color} border border-${config.color}/15`}>
              {config.label}
            </span>
            <span className="text-[10px] text-parchment-500 font-mono">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-3 h-3 text-parchment-500" />
            <span className="text-xs text-parchment-400 font-body">
              {event.sourceChain.name}
            </span>
            <span className="text-parchment-500">&middot;</span>
            <span className="text-xs text-parchment-400 font-mono">
              {event.pool}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs font-mono">
            <div>
              <span className="text-parchment-500">Vol </span>
              <span className="text-parchment-300">
                ${(event.volume / 1e6).toFixed(2)}M
              </span>
            </div>
            <div>
              <span className="text-parchment-500">Impact </span>
              <span className="text-parchment-300">{event.priceImpact}%</span>
            </div>
          </div>
          {event.aiRecommendation && (
            <div className="mt-3 px-3 py-2.5 rounded-lg bg-mystic-gold/[0.03] border border-mystic-gold/[0.06]">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-mystic-gold" />
                <span className="text-[10px] text-mystic-gold font-mono tracking-wider uppercase">
                  Oracle Insight
                </span>
              </div>
              <p className="text-xs text-parchment-400 font-body leading-relaxed">
                {event.aiRecommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ReactiveMonitor() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchReactiveEvents();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-parchment-100 flex items-center gap-3">
              <Radio className="w-6 h-6 text-mystic-gold" />
              Cross-Chain Signals
            </h2>
            <p className="text-sm text-parchment-500 mt-1 font-body">
              Real-time event tracking via Reactive Smart Contracts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 text-parchment-500 ${loading ? "animate-spin" : ""}`} />
            <span className="text-[10px] text-parchment-500 font-mono tracking-wider">
              AUTO 5s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-8">
          {CHAINS.map((chain) => {
            const count = events.filter((e) => e.sourceChain.id === chain.id).length;
            return (
              <motion.div
                key={chain.id}
                whileHover={{ scale: 1.02 }}
                className="glass-mystic p-4 text-center relative overflow-hidden group"
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 opacity-60"
                  style={{ backgroundColor: chain.hex }}
                />
                <div className="text-[10px] font-mono text-parchment-500 tracking-wider mb-1">
                  {chain.short}
                </div>
                <div className="text-2xl font-heading font-bold text-parchment-100">
                  {count}
                </div>
                <div className="text-[9px] font-body text-parchment-500 uppercase tracking-[0.2em]">
                  signals
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: "All" },
            ...Object.entries(typeConfig).map(([id, cfg]) => ({
              id,
              label: cfg.label,
            })),
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-medium tracking-wide transition-all duration-300 ${
                filter === f.id
                  ? "bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/15"
                  : "bg-surface-700/30 text-parchment-500 border border-transparent hover:text-parchment-300 hover:border-mystic-gold/[0.06]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="glass-mystic h-28 animate-pulse" />
                ))
              : filtered.slice(0, 20).map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
          </AnimatePresence>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-parchment-500 font-heading text-lg italic">
              No signals matching this filter
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
