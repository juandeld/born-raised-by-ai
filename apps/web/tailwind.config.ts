import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Jinglo palette (docs/diseno/jinglo/v2): night blue, cut paper, cranberry, pine, gold.
        night: { 950: "#0d182c", 900: "#13233f", 800: "#1d3358", 700: "#2c4170" },
        gold: { 300: "#f0c982", 400: "#e3ab52", 500: "#c98f35", 600: "#a8731f" },
        holly: { 500: "#2f5d50", 600: "#244a40" },
        berry: { 500: "#a8262c", 600: "#7d1a20" },
        cream: { 50: "#f3e8cf", 100: "#e9dcbd" },
        paper: { DEFAULT: "#f6efdb", 200: "#e9dcbd" },
        ink: { DEFAULT: "#2b2018", soft: "#5a4838" },
        // Colorear ("lapiz": graphite ink, deep teal, marigold highlight on warm paper). Contrast on paper: ink 12:1, muted 5.9:1, teal 6:1.
        lapiz: { ink: "#23303b", muted: "#55626e", paper: "#fbfaf7", line: "#d6dadc", teal: "#1b6b67", "teal-dark": "#145551", tint: "#e4f0ee", gold: "#f0b43c", coral: "#c8452f", "coral-dark": "#a53622", "gold-tint": "#fcf1d6", mist: "#eef2f5", error: "#b3261e" },
      },
      fontFamily: { display: ["var(--font-display)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"], cdisplay: ["'Bricolage Grotesque Variable'", "'Bricolage Grotesque'", "ui-rounded", "system-ui", "sans-serif"], cbody: ["'Figtree Variable'", "Figtree", "system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
