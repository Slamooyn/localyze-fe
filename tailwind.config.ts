import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Verdict colors — the only large semantic color usage (spec §2)
        prime: { DEFAULT: "#16A34A", bg: "#F0FDF4" },
        strong: { DEFAULT: "#0D9488", bg: "#F0FDFA" },
        conditional: { DEFAULT: "#D97706", bg: "#FFFBEB" },
        avoid: { DEFAULT: "#DC2626", bg: "#FEF2F2" },
        // Brand (Localyze pin)
        brand: { DEFAULT: "#1D4ED8", dark: "#172554" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "pin-pulse": {
          "0%,100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
      },
      animation: {
        "pin-pulse": "pin-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
