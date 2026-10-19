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
        // Colorear ("lapiz": graphite ink, deep teal, marigold highlight on warm paper). Contrast on paper: ink 12:1, muted 5.9:1, teal 6:1.
        lapiz: { ink: "#23303b", muted: "#55626e", paper: "#fbfaf7", line: "#d6dadc", teal: "#1b6b67", "teal-dark": "#145551", tint: "#e4f0ee", gold: "#f0b43c", "gold-tint": "#fcf1d6", mist: "#eef2f5", error: "#b3261e" },
      },
      fontFamily: { display: ["var(--font-display)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"], cdisplay: ["'Bricolage Grotesque'", "ui-rounded", "system-ui", "sans-serif"], cbody: ["Figtree", "system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
