import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithAI } from "../utils/api";

const SUGGESTIONS = [
  "What's the optimal fee for ETH/USDC during high volatility?",
  "How does cross-chain arbitrage affect fee optimization?",
  "Explain how MysticPool protects liquidity providers.",
];

function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold ${
          isUser
            ? "bg-mystic-violet/15 border border-mystic-violet/20 text-mystic-violet"
            : "bg-gradient-to-br from-mystic-gold/20 to-mystic-gold-dim/10 border border-mystic-gold/20 text-mystic-gold"
        }`}
      >
        {isUser ? "Y" : "M"}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? "bg-mystic-violet/[0.06] border border-mystic-violet/10"
            : "bg-surface-700/50 border border-mystic-gold/[0.06]"
        }`}
      >
        <div className="text-sm text-parchment-200 leading-relaxed font-body prose prose-invert prose-sm max-w-none prose-strong:text-mystic-gold prose-headings:font-heading prose-headings:text-parchment-100">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className="text-[10px] text-parchment-500 mt-2 font-mono">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to the **MysticPool Oracle**. I am powered by **NVIDIA Qwen 3.5 122B** and specialized in Uniswap v4 dynamic fee optimization.\n\nI can analyze market conditions, recommend optimal fees, and interpret cross-chain signals from Reactive Network.\n\nWhat would you like to know?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg, timestamp: Date.now() },
    ]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.role !== "system")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));
      const result = await chatWithAI(msg, history);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.success
            ? result.message
            : "The oracle encountered an error. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection lost. Make sure the backend server is running on port 3001.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-mystic overflow-hidden relative"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="absolute inset-0 gold-shimmer pointer-events-none rounded-2xl" />

        <div className="relative flex items-center justify-between px-6 py-4 border-b border-mystic-gold/[0.06]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic-gold to-mystic-gold-dim flex items-center justify-center">
              <span className="text-surface-900 font-display font-bold text-sm">M</span>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-parchment-100">
                MysticPool Oracle
              </h2>
              <p className="text-[10px] font-mono text-parchment-500 tracking-wider">
                NVIDIA QWEN 3.5 122B &bull; FEE ORACLE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mystic-emerald/[0.06] border border-mystic-emerald/15">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mystic-emerald opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mystic-emerald" />
              </span>
              <span className="text-[10px] text-mystic-emerald font-mono tracking-wider">
                LIVE
              </span>
            </div>
            <button
              onClick={() =>
                setMessages([
                  {
                    role: "assistant",
                    content: "Oracle reset. How may I assist you?",
                    timestamp: Date.now(),
                  },
                ])
              }
              className="p-2 rounded-lg hover:bg-surface-600/30 text-parchment-500 hover:text-parchment-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="relative flex-1 overflow-y-auto p-6 space-y-4"
          style={{ height: "calc(100% - 170px)" }}
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} isUser={msg.role === "user"} />
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-gold/20 to-mystic-gold-dim/10 border border-mystic-gold/20 flex items-center justify-center">
                <span className="text-mystic-gold font-display font-bold text-xs">M</span>
              </div>
              <div className="bg-surface-700/50 border border-mystic-gold/[0.06] rounded-2xl px-5 py-3 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-mystic-gold animate-spin" />
                <span className="text-sm text-parchment-500 font-body italic">
                  The oracle is consulting the model...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>

        <div className="relative px-6 pb-5">
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-700/30 border border-mystic-gold/[0.06] text-xs text-parchment-400 hover:text-parchment-200 hover:border-mystic-gold/15 transition-all font-body"
                >
                  <Sparkles className="w-3 h-3 text-mystic-gold/60" />
                  {s.length > 50 ? s.slice(0, 50) + "..." : s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask the oracle about fees, markets, cross-chain signals..."
              className="flex-1 bg-surface-800/50 border border-mystic-gold/[0.06] rounded-xl px-4 py-3 text-sm text-parchment-200 placeholder-parchment-500 outline-none focus:border-mystic-gold/20 transition-colors font-body"
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-mystic-gold to-mystic-gold-dim text-surface-900 disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-mystic-gold/15 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
