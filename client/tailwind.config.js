/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mystic: {
          gold: "#c9a84c",
          "gold-bright": "#e8c860",
          "gold-dim": "#9e7d30",
          violet: "#8b7ec8",
          "violet-dim": "#6e63a5",
          emerald: "#50c878",
          rose: "#e05c6c",
          amber: "#d4a853",
        },
        surface: {
          950: "#05060a",
          900: "#090a10",
          850: "#0c0d15",
          800: "#10111b",
          750: "#141520",
          700: "#181926",
          600: "#1e1f30",
          500: "#27283e",
          400: "#34365a",
        },
        parchment: {
          50: "#faf7f0",
          100: "#f0ebe0",
          200: "#e0d8c8",
          300: "#c9bda5",
          400: "#b0a088",
          500: "#96836c",
        },
      },
      fontFamily: {
        display: ['"Cinzel"', "serif"],
        heading: ['"Cormorant Garamond"', "serif"],
        body: ['"Outfit"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-delayed": "floatSlow 8s ease-in-out 2s infinite",
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "glow": "glow 4s ease-in-out infinite",
        "grain": "grain 8s steps(10) infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-14px) scale(1.02)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(201,168,76,0.1)" },
          "50%": { boxShadow: "0 0 24px rgba(201,168,76,0.25)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
      },
    },
  },
  plugins: [],
};
