import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Layers,
  Radio,
} from "lucide-react";
import { fetchStats, fetchPools } from "../utils/api";
import PoolCard from "./PoolCard";

function StatCard({ icon: Icon, label, value, change, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-mystic-hover p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mystic-gold/10 to-transparent" />

      <div className="relative flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-mystic-gold/[0.06] border border-mystic-gold/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-mystic-gold" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-mono font-medium ${
              change >= 0 ? "text-mystic-emerald" : "text-mystic-rose"
            }`}
          >
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-heading font-bold text-parchment-100 mb-0.5">
        {value}
      </div>
      <div className="text-[10px] font-body text-parchment-500 uppercase tracking-[0.18em]">
        {label}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, p] = await Promise.all([fetchStats(), fetchPools()]);
        setStats(s);
        setPools(p);
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-mystic h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-mystic h-52 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const fmt = (n) => {
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
    return `$${n}`;
  };

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-parchment-100">
              Pool Analytics
            </h2>
            <p className="text-sm text-parchment-500 mt-1 font-body">
              Oracle-optimized fee monitoring across all pools
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-mystic-gold/[0.08] bg-surface-700/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mystic-gold opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mystic-gold" />
            </span>
            <span className="text-[10px] text-parchment-500 font-mono tracking-wider">
              LIVE
            </span>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={DollarSign} label="Total Value Locked" value={fmt(stats.totalTVL)} change={3.2} delay={0} />
            <StatCard icon={Activity} label="24h Volume" value={fmt(stats.totalVolume)} change={-1.5} delay={0.08} />
            <StatCard icon={Layers} label="Total Swaps" value={stats.totalSwaps.toLocaleString()} change={5.8} delay={0.16} />
            <StatCard icon={Radio} label="Chains Monitored" value={stats.chainsMonitored} delay={0.24} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pools.map((pool, i) => (
            <PoolCard key={pool.id} pool={pool} index={i} />
          ))}
        </div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 glass-mystic p-7 relative overflow-hidden"
          >
            <div className="absolute inset-0 gold-shimmer rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-parchment-100">
                    Oracle Status
                  </h3>
                  <p className="text-xs text-parchment-500 font-mono tracking-wider mt-1">
                    NVIDIA QWEN 3.5 122B &bull; REACTIVE NETWORK
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mystic-emerald opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-mystic-emerald" />
                  </span>
                  <span className="text-sm text-mystic-emerald font-body font-medium">
                    Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Avg Volatility", value: `${stats.avgVolatility}/100` },
                  { label: "Active Pools", value: stats.poolCount },
                  { label: "Reactive Events", value: stats.reactiveEventCount },
                  { label: "Fee Strategy", value: "Dynamic" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3 rounded-xl bg-surface-800/60 border border-mystic-gold/[0.04]"
                  >
                    <div className="text-[10px] font-body text-parchment-500 uppercase tracking-[0.15em] mb-1">
                      {s.label}
                    </div>
                    <div className={`text-lg font-heading font-bold ${s.label === "Fee Strategy" ? "gold-text" : "text-parchment-200"}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
