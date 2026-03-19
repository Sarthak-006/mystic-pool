import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import AIChat from "./components/AIChat";
import ReactiveMonitor from "./components/ReactiveMonitor";
import Architecture from "./components/Architecture";
import Footer from "./components/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

function TabContent({ activeTab }) {
  const inner = (() => {
    switch (activeTab) {
      case "dashboard":
        return <><Hero /><Dashboard /></>;
      case "oracle":
        return <AIChat />;
      case "reactive":
        return <ReactiveMonitor />;
      case "architecture":
        return <Architecture />;
      default:
        return null;
    }
  })();

  return (
    <motion.div
      key={activeTab}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {inner}
    </motion.div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-surface-900 relative">
      <div className="grain-overlay" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-float-slow" />
        <div className="orb orb-violet w-[500px] h-[500px] top-1/3 -right-60 animate-float-delayed" />
        <div className="orb orb-gold w-[400px] h-[400px] bottom-20 left-1/3 animate-glow" />
      </div>

      <div className="relative z-10">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          <TabContent key={activeTab} activeTab={activeTab} />
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
