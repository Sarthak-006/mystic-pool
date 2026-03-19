import { motion } from "framer-motion";
import { BarChart3, MessageSquare, Radio, GitBranch } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "oracle", label: "Oracle", icon: MessageSquare },
  { id: "reactive", label: "Signals", icon: Radio },
  { id: "architecture", label: "Architecture", icon: GitBranch },
];

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-surface-900/80 backdrop-blur-2xl border-b border-mystic-gold/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mystic-gold to-mystic-gold-dim opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 flex items-center justify-center text-surface-900 font-display font-bold text-sm tracking-wider">
                M
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg tracking-[0.15em] text-parchment-100 font-semibold">
                MYSTIC
              </span>
              <span className="font-display text-lg tracking-[0.15em] text-mystic-gold font-semibold">
                POOL
              </span>
            </div>
          </button>

          <div className="flex items-center gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-mystic-gold"
                      : "text-parchment-400 hover:text-parchment-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute inset-0 bg-mystic-gold/[0.07] rounded-lg border border-mystic-gold/[0.12]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="hidden md:inline relative z-10 font-body font-medium">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-mystic-emerald/20 bg-mystic-emerald/[0.06]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mystic-emerald opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mystic-emerald" />
              </span>
              <span className="text-xs text-mystic-emerald font-body font-medium tracking-wide">
                Oracle Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
