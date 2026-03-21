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
        // Design system: Developer Tool / IDE dark palette
        bg: {
          base: "#0F172A",
          card: "#1B2336",
          muted: "#272F42",
        },
        border: {
          DEFAULT: "#475569",
          subtle: "#334155",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        accent: {
          green: "#22C55E",
          "green-dim": "#16A34A",
        },
        // Cloud brand colors
        aws: {
          DEFAULT: "#FF9900",
          dim: "#CC7A00",
          bg: "#1A1200",
        },
        gcp: {
          DEFAULT: "#4285F4",
          dim: "#2563EB",
          bg: "#0A1628",
        },
        azure: {
          DEFAULT: "#0078D4",
          dim: "#005FA3",
          bg: "#001628",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
