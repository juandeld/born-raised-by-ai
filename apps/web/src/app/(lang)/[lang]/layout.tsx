import type { Metadata, Viewport } from "next";
import { MetaPixel } from "@/components/MetaPixel";
import { fontVars } from "@/lib/fonts";
import { SLUGS, resolveSlug } from "@/lib/slugs";
import { brandConfig } from "@lumen/config";
import "../../globals.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return SLUGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#13233f" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { copy } = resolveSlug((await params).lang);
  const base = brandConfig().domain;
  return {
    metadataBase: new URL(base),
    title: copy.siteTitle,
    description: copy.siteDescription,
    icons: { icon: "/jinglo/logo.svg" },
    alternates: { languages: { es: "/es", "es-ES": "/es-es", en: "/en" } },
    openGraph: { title: copy.siteTitle, description: copy.siteDescription, type: "website" },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { slug, copy } = resolveSlug((await params).lang);
  return (
    <html lang={copy.htmlLang} className={fontVars}>
      <body className="jl-body">
        {children}
        <MetaPixel id={process.env.META_PIXEL_ID} slug={slug} />
      </body>
    </html>
  );
}
