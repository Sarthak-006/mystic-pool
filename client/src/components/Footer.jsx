import { Github, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-mystic-gold/[0.05]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-gold to-mystic-gold-dim flex items-center justify-center">
              <span className="text-surface-900 font-display font-bold text-xs">M</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-sm tracking-[0.15em] text-parchment-200">
                MYSTIC
              </span>
              <span className="font-display text-sm tracking-[0.15em] text-mystic-gold">
                POOL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-parchment-500 tracking-wider">
            <span>UNISWAP V4</span>
            <span className="text-mystic-gold/20">|</span>
            <span>REACTIVE NETWORK</span>
            <span className="text-mystic-gold/20">|</span>
            <span>NVIDIA QWEN</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://dev.reactive.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-parchment-500 hover:text-mystic-gold transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Reactive-Network/reactive-smart-contract-demos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-parchment-500 hover:text-mystic-gold transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="divider-gold mt-8 mb-6" />

        <p className="text-center text-[10px] text-parchment-500/60 font-mono tracking-[0.2em] uppercase">
          Built for UHI8 Hookathon: Specialized Markets &bull; AI-Powered
          Dynamic Fee Optimization
        </p>
      </div>
    </footer>
  );
}
