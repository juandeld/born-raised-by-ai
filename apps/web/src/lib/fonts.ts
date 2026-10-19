import { Fraunces, Pinyon_Script } from "next/font/google";

// Jinglo type: Fraunces (variable: soft, optical size) for everything, Pinyon Script only for the child's name.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", style: ["normal", "italic"], axes: ["SOFT", "opsz"] });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon", display: "swap" });

export const fontVars = `${fraunces.variable} ${pinyon.variable}`;
