import type { Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/figtree";
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
      <body className="bg-lapiz-paper font-cbody text-lapiz-ink antialiased">
        <LangSetter />
        {children}
      </body>
    </html>
  );
}
