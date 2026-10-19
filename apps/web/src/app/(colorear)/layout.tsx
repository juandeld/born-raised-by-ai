import type { Viewport } from "next";
import "../globals.css";
import { LangSetter } from "@/components/colorear/LangSetter";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffd23f" };
export const metadata = { title: "Colorfam", description: "Tu familia para colorear / Your family to color" };

/** Own root layout for /colorear/**: crayon look, separate from Santa. The page language is set from the first path segment. */
export default function ColorearLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-crayon-paper text-crayon-ink">
        <LangSetter />
        {children}
      </body>
    </html>
  );
}
