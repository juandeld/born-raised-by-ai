import type { Viewport } from "next";
import "../globals.css";
import { LangSetter } from "@/components/colorear/LangSetter";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbfaf7" };
export const metadata = {
  title: "Pintoria",
  description: "Tu familia para colorear / Your family to color",
  icons: { icon: [{ url: "/pintoria/mark-a.svg", type: "image/svg+xml" }, { url: "/pintoria/favicon-32.png", sizes: "32x32", type: "image/png" }], apple: [{ url: "/pintoria/apple-touch-icon.png", sizes: "180x180" }] },
};

/** Own root layout for /colorear/**: graphite-line look, separate from Santa. The page language is set from the first path segment. */
export default function ColorearLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap" />
      </head>
      <body className="bg-lapiz-paper font-cbody text-lapiz-ink antialiased">
        <LangSetter />
        {children}
      </body>
    </html>
  );
}
