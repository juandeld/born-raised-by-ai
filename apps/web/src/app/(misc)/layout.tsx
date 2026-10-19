import type { Viewport } from "next";
import "../globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1020" };
export const metadata = { title: "Santa", robots: { index: false } };

export default function MiscLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
