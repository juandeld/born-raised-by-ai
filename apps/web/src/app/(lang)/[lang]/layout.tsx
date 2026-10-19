import type { Metadata, Viewport } from "next";
import { SLUGS, resolveSlug } from "@/lib/slugs";
import { brandConfig } from "@lumen/config";
import "../../globals.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return SLUGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1020" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { copy } = resolveSlug((await params).lang);
  const base = brandConfig().domain;
  return {
    metadataBase: new URL(base),
    title: copy.siteTitle,
    description: copy.siteDescription,
    alternates: { languages: { es: "/es", "es-ES": "/es-es", en: "/en" } },
    openGraph: { title: copy.siteTitle, description: copy.siteDescription, type: "website" },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { copy } = resolveSlug((await params).lang);
  return (
    <html lang={copy.htmlLang}>
      <body>{children}</body>
    </html>
  );
}
