import { fill } from "@lumen/legal";
import { COUNTRIES, DEFAULT_COUNTRY_BY_LOCALE, formatPrice, priceFor } from "@lumen/config";
import { Markdown } from "@/components/Markdown";
import { Footer, Header } from "@/components/SiteChrome";
import { LEGAL_DOCS } from "@/lib/legal-docs.generated";
import { documentVars } from "@/lib/legal-vars";
import { resolveSlug } from "@/lib/slugs";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { slug, locale, copy } = resolveSlug((await params).lang);
  const country = DEFAULT_COUNTRY_BY_LOCALE[locale];
  const p = priceFor(country, "single");
  const text = fill(LEGAL_DOCS.privacy[slug], documentVars(formatPrice(p.amountMinor, p.currency, COUNTRIES[country].priceFormatLocale)));
  return (
    <>
      <div className="bg-night-950"><Header slug={slug} copy={copy} dark /></div>
      <main className="container-narrow py-8 text-[15px] leading-relaxed">
        <Markdown source={text} />
      </main>
      <Footer slug={slug} copy={copy} />
    </>
  );
}
