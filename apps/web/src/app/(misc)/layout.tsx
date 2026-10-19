import type { Viewport } from "next";
import { fontVars } from "@/lib/fonts";
import "../globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#13233f" };
export const metadata = { title: "Jinglo", robots: { index: false }, icons: { icon: "/jinglo/logo.svg" } };

export default function MiscLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVars}>
      <body className="jl-body">{children}</body>
    </html>
  );
}
