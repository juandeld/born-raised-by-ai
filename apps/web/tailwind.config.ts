import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: { 950: "#0b1020", 900: "#111833", 800: "#1a2347", 700: "#26325e" },
        gold: { 300: "#ffe08a", 400: "#ffd25e", 500: "#f5b82e", 600: "#d99a12" },
        holly: { 500: "#1f7a4d", 600: "#17603c" },
        berry: { 500: "#c62f45", 600: "#a82337" },
        cream: { 50: "#fffaf0", 100: "#fff3dc" },
        // Colorear (crayon palette)
        crayon: { red: "#ef4d3c", orange: "#ff9f1c", yellow: "#ffd23f", green: "#2bb673", blue: "#2e86de", purple: "#8e5cd9", ink: "#1f2340", paper: "#fffdf7", sky: "#e8f3ff", sun: "#fff4cf" },
      },
      fontFamily: { display: ["var(--font-display)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
