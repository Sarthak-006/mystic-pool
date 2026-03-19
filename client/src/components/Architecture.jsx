import { motion } from "framer-motion";
import {
  Brain,
  Globe,
  Zap,
  ArrowRight,
  Code,
  Shield,
  Network,
  Cpu,
  Radio,
} from "lucide-react";

const HOOK_CODE = `function beforeSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata,
    bytes calldata
) external override returns (bytes4, BeforeSwapDelta, uint24) {
    PoolId poolId = key.toId();
    FeeRecommendation memory rec = feeRecommendations[poolId];

    uint24 dynamicFee = rec.dynamicFee;
    if (dynamicFee < MIN_FEE) dynamicFee = MIN_FEE;   // 0.01%
    if (dynamicFee > MAX_FEE) dynamicFee = MAX_FEE;   // 1.00%

    uint24 lpFee = dynamicFee | LPFeeLibrary.OVERRIDE_FEE_FLAG;
    return (BaseHook.beforeSwap.selector, ZERO_DELTA, lpFee);
}`;

const REACTIVE_CODE = `function react(
    uint256 chainId,
    address _contract,
    uint256, uint256, uint256, uint256,
    bytes calldata data
) external {
    (int256 amount0, int256 amount1,,) =
        abi.decode(data, (int256, int256, uint160, uint128));

    uint256 absAmount = amount0 < 0
        ? uint256(-amount0) : uint256(amount0);

    poolSwapCounts[chainId][_contract]++;
    poolVolumes[chainId][_contract] += absAmount;

    if (absAmount >= LARGE_SWAP_THRESHOLD) {
        _triggerCallback(chainId, _contract);
    }
}`;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const steps = [
  {
    icon: Globe,
    num: "01",
    title: "Cross-Chain Monitoring",
    desc: "Reactive Smart Contracts subscribe to Uniswap swap events on Ethereum, Arbitrum, Optimism, Base, and Polygon.",
  },
  {
    icon: Zap,
    num: "02",
    title: "Event Aggregation",
    desc: "Swap volumes, price impacts, and arbitrage signals are aggregated by the RSC deployed on Reactive Network.",
  },
  {
    icon: Brain,
    num: "03",
    title: "AI Analysis",
    desc: "NVIDIA Qwen 3.5 122B processes market data, volatility patterns, and cross-chain signals to compute optimal fees.",
  },
  {
    icon: Shield,
    num: "04",
    title: "Fee Update",
    desc: "The AI oracle submits fee recommendations to the hook with bounded safety limits between 0.01% and 1%.",
  },
  {
    icon: ArrowRight,
    num: "05",
    title: "Dynamic Swap",
    desc: "Each swap applies the AI-optimized fee via the beforeSwap hook, protecting LPs and optimizing volume.",
  },
];

const techStack = [
  { name: "Uniswap v4", sub: "Hook Framework" },
  { name: "Reactive Network", sub: "Cross-Chain RSC" },
  { name: "NVIDIA Qwen", sub: "122B AI Model" },
  { name: "Solidity", sub: "Smart Contracts" },
  { name: "React", sub: "Frontend" },
  { name: "Node.js", sub: "Backend API" },
];

export default function Architecture() {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-parchment-100 mb-3">
            System Architecture
          </h2>
          <p className="text-parchment-500 max-w-xl mx-auto font-body">
            How MysticPool weaves together Uniswap v4 Hooks, Reactive Network,
            and NVIDIA AI into an intelligent fee oracle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          <motion.div {...fadeUp} className="glass-mystic p-8">
            <div className="flex items-center gap-3 mb-8">
              <Network className="w-5 h-5 text-mystic-gold" />
              <h3 className="font-heading text-xl font-semibold text-parchment-100">
                Data Flow
              </h3>
            </div>

            <div className="space-y-1">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-xl bg-mystic-gold/[0.06] border border-mystic-gold/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-mystic-gold" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px h-10 bg-gradient-to-b from-mystic-gold/15 to-transparent mt-1" />
                      )}
                    </div>
                    <div className="pt-0.5 pb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[10px] font-mono text-mystic-gold/50 tracking-wider">
                          {step.num}
                        </span>
                        <h4 className="font-heading text-base font-semibold text-parchment-100">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-sm text-parchment-400 font-body leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-mystic p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-4 h-4 text-mystic-gold" />
                <h3 className="font-body text-sm font-medium text-parchment-300 tracking-wide">
                  MysticPool Hook &mdash; Dynamic Fee Logic
                </h3>
              </div>
              <pre className="text-xs font-mono text-parchment-400/80 bg-surface-900/60 rounded-xl p-4 overflow-x-auto leading-relaxed border border-mystic-gold/[0.03]">
                {HOOK_CODE}
              </pre>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-mystic p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Radio className="w-4 h-4 text-mystic-violet" />
                <h3 className="font-body text-sm font-medium text-parchment-300 tracking-wide">
                  Reactive Network &mdash; Cross-Chain Monitor
                </h3>
              </div>
              <pre className="text-xs font-mono text-parchment-400/80 bg-surface-900/60 rounded-xl p-4 overflow-x-auto leading-relaxed border border-mystic-gold/[0.03]">
                {REACTIVE_CODE}
              </pre>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-mystic p-8"
        >
          <h3 className="font-heading text-xl font-semibold text-parchment-100 mb-6 text-center">
            Technology Stack
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="text-center p-4 rounded-xl bg-surface-800/40 border border-mystic-gold/[0.04] hover:border-mystic-gold/10 transition-colors"
              >
                <Cpu className="w-4 h-4 text-mystic-gold mx-auto mb-2" />
                <div className="text-sm font-body font-semibold text-parchment-200">
                  {tech.name}
                </div>
                <div className="text-[10px] text-parchment-500 font-mono tracking-wider">
                  {tech.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
