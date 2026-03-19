import { motion } from "framer-motion";

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const pillars = [
  {
    title: "AI Oracle",
    sub: "NVIDIA Qwen 122B",
    desc: "Analyzes volatility, liquidity depth, and cross-chain arbitrage patterns in real-time.",
  },
  {
    title: "Reactive Network",
    sub: "Cross-Chain RSC",
    desc: "Monitors swap events across Ethereum, Arbitrum, Optimism, Base, and Polygon simultaneously.",
  },
  {
    title: "Dynamic Fees",
    sub: "Uniswap v4 Hook",
    desc: "Adjusts swap fees between 0.01% and 1% on every trade to protect LPs and attract volume.",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-mystic-gold/[0.04] blur-[100px] pointer-events-none" />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-6xl mx-auto px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-mystic-gold/15 bg-mystic-gold/[0.04] mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold animate-pulse-gold" />
            <span className="text-sm font-body text-mystic-gold/80 tracking-wide">
              UHI8 Hookathon &bull; Reactive Network Track
            </span>
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-center font-display tracking-[0.06em] leading-[1.1] mb-8"
        >
          <span className="block text-6xl sm:text-8xl font-bold gold-text text-shadow-gold">
            MysticPool
          </span>
          <span className="block text-2xl sm:text-3xl font-heading text-parchment-300 mt-4 italic font-light tracking-[0.02em]">
            The AI Oracle for Dynamic Fee Optimization
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto text-parchment-400 text-base sm:text-lg leading-relaxed font-body font-light mb-14"
        >
          A Uniswap v4 hook that sees across chains. Powered by NVIDIA Qwen AI
          and Reactive Network, MysticPool dynamically optimizes swap fees to
          shield liquidity providers and maximize capital efficiency.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex justify-center gap-3 flex-wrap mb-20"
        >
          {["Uniswap v4 Hooks", "Reactive Smart Contracts", "NVIDIA Qwen AI", "Cross-Chain Signals"].map(
            (tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-xs font-mono tracking-wider text-parchment-400 border border-parchment-500/15 bg-surface-700/40"
              >
                {tag}
              </span>
            )
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="glass-mystic-hover p-7 group relative overflow-hidden"
            >
              <div className="absolute inset-0 gold-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />

              <div className="relative">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-display text-sm tracking-[0.18em] text-mystic-gold uppercase">
                    0{i + 1}
                  </span>
                  <div className="flex-1 h-px bg-mystic-gold/10" />
                </div>
                <h3 className="font-heading text-2xl text-parchment-100 font-semibold mt-3 mb-0.5">
                  {p.title}
                </h3>
                <p className="text-xs font-mono text-mystic-gold/60 tracking-wider mb-4">
                  {p.sub}
                </p>
                <p className="text-sm text-parchment-400 leading-relaxed font-body">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
