import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          bg: "#0a0614",
          surface: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.10)",
          highlight: "rgba(232, 121, 249, 0.45)",
        },
      },
      animation: {
        "fluid-dream": "fluidMotion 18s ease-in-out infinite",
        "ripple-slow": "microRipple 14s ease-in-out infinite",
        "float-in": "smoothFloatIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "border-shimmer": "borderShimmer 3s linear infinite",
        "glow-edge": "glowEdge 4s ease-in-out infinite",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "btn-ripple": "btnRipple 0.7s ease-out forwards",
        "float-up-1": "floatUp 8s ease-out infinite",
        "float-up-2": "floatUp2 10s ease-out infinite",
        "float-up-3": "floatUp3 9s ease-out infinite",
        "orb-breathe": "orbBreathe 4s ease-in-out infinite",
      },
      keyframes: {
        fluidMotion: {
          "0%": { backgroundPosition: "0% 30%" },
          "25%": { backgroundPosition: "50% 60%" },
          "50%": { backgroundPosition: "100% 70%" },
          "75%": { backgroundPosition: "60% 40%" },
          "100%": { backgroundPosition: "0% 30%" },
        },
        microRipple: {
          "0%, 100%": {
            transform: "translateY(0) scale(1)",
            opacity: "0.15",
          },
          "50%": {
            transform: "translateY(-8px) scale(1.03)",
            opacity: "0.30",
          },
        },
        smoothFloatIn: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
            filter: "blur(6px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        borderShimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        glowEdge: {
          "0%, 100%": {
            borderColor: "rgba(168, 85, 247, 0.2)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.05)",
          },
          "50%": {
            borderColor: "rgba(232, 121, 249, 0.4)",
            boxShadow: "0 0 35px rgba(232, 121, 249, 0.12)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        btnRipple: {
          from: { transform: "scale(0)", opacity: "0.6" },
          to: { transform: "scale(4)", opacity: "0" },
        },
        floatUp: {
          "0%": {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: "0",
          },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.3" },
          "100%": {
            transform: "translateY(-400px) translateX(60px) scale(0.3)",
            opacity: "0",
          },
        },
        floatUp2: {
          "0%": {
            transform: "translateY(0) translateX(0) scale(0.8)",
            opacity: "0",
          },
          "15%": { opacity: "0.5" },
          "85%": { opacity: "0.2" },
          "100%": {
            transform: "translateY(-500px) translateX(-40px) scale(0.2)",
            opacity: "0",
          },
        },
        floatUp3: {
          "0%": {
            transform: "translateY(0) translateX(0) scale(1.2)",
            opacity: "0",
          },
          "8%": { opacity: "0.7" },
          "92%": { opacity: "0.2" },
          "100%": {
            transform: "translateY(-350px) translateX(-80px) scale(0.4)",
            opacity: "0",
          },
        },
        orbBreathe: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: "0.35",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(1.25)",
            opacity: "0.55",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
