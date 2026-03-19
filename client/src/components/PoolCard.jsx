import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

function EnergyBar({ value }) {
  const getColor = (v) => {
    if (v < 30) return "bg-mystic-emerald";
    if (v < 60) return "bg-mystic-gold";
    if (v < 80) return "bg-mystic-amber";
    return "bg-mystic-rose";
  };

  return (
    <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full ${getColor(value)}`}
      />
    </div>
  );
}

export default function PoolCard({ pool, index }) {
  const feePercent = (fee) => (fee / 10000).toFixed(2);
  const isPositive = pool.priceChange24h >= 0;
  const aiFeeDiff = pool.aiFee - pool.currentFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-mystic-hover p-6 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-mystic-gold/[0.02] rounded-full blur-[60px] pointer-events-none group-hover:bg-mystic-gold/[0.05] transition-colors duration-700" />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-heading text-xl font-semibold text-parchment-100 tracking-wide">
              {pool.tokenPair}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-700/60 text-parchment-400 tracking-wider">
                {feePercent(pool.currentFee)}%
              </span>
              <span
                className={`text-xs font-mono font-medium flex items-center gap-1 ${
                  isPositive ? "text-mystic-emerald" : "text-mystic-rose"
                }`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {pool.priceChange24h}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-body text-parchment-500 uppercase tracking-[0.15em]">
              Oracle Fee
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-display font-bold gold-text tracking-wider">
                {feePercent(pool.aiFee)}%
              </span>
            </div>
            {aiFeeDiff !== 0 && (
              <span
                className={`text-[10px] font-mono ${
                  aiFeeDiff > 0 ? "text-mystic-amber" : "text-mystic-emerald"
                }`}
              >
                {aiFeeDiff > 0 ? "+" : ""}
                {(aiFeeDiff / 100).toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "TVL", value: `$${(pool.tvl / 1e6).toFixed(1)}M` },
            { label: "24h Vol", value: `$${(pool.volume24h / 1e6).toFixed(1)}M` },
            { label: "Swaps", value: pool.swapCount.toLocaleString() },
          ].map((m) => (
            <div key={m.label}>
              <div className="text-[10px] font-body text-parchment-500 uppercase tracking-[0.15em] mb-0.5">
                {m.label}
              </div>
              <div className="text-sm font-body font-semibold text-parchment-200">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-body text-parchment-500 uppercase tracking-[0.15em]">
              Volatility
            </span>
            <span className="text-xs font-mono text-parchment-400">
              {pool.volatilityIndex.toFixed(0)}
              <span className="text-parchment-500">/100</span>
            </span>
          </div>
          <EnergyBar value={pool.volatilityIndex} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`text-[10px] font-body font-medium tracking-wider uppercase px-2.5 py-1 rounded-full ${
              pool.aiConfidence === "high"
                ? "bg-mystic-emerald/10 text-mystic-emerald border border-mystic-emerald/15"
                : "bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/15"
            }`}
          >
            {pool.aiConfidence} confidence
          </span>
          <span className="text-[10px] text-parchment-500 font-mono">
            {new Date(pool.lastUpdate || Date.now()).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
