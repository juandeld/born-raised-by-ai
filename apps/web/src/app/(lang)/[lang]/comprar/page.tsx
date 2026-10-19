import Link from "next/link";
import { COUNTRIES, formatPrice, priceFor } from "@lumen/config";
import { REFUND_LINE, REMINDER_LINE, languageOf, renderAviso, resolveAllCheckboxes } from "@lumen/legal";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Footer, Header } from "@/components/SiteChrome";
import { getEngine } from "@/lib/engine";
import { legalReady, legalVars } from "@/lib/legal-vars";
import { serializeFormCopy } from "@/lib/copy";
import { bundleEnabled, pickCountry, pickVariant, resolveSlug, timezonesFor } from "@/lib/slugs";

export const metadata = { robots: { index: false } };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Comprar({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }) {
  const { slug, locale, copy } = resolveSlug((await params).lang);
  const sp = await searchParams;
  const country = pickCountry(locale, one(sp.c));
  const requested = pickVariant(one(sp.v));
  const variant = requested === "bundle" && !bundleEnabled() ? "single" : requested;
  const creative = one(sp.cr) ?? one(sp.utm_content) ?? "none";
  const c = COUNTRIES[country];
  const vars = legalVars();
  const lang = languageOf(c.preludeLocale);
  const aviso = renderAviso(lang, vars, { gb: country === "GB" });
  const checkboxes = resolveAllCheckboxes(c.preludeLocale, vars).map((x) => ({ id: x.checkboxId, text: x.text }));
  const p = priceFor(country, variant);
  const price = formatPrice(p.amountMinor, p.currency, c.priceFormatLocale);
  const variantName = variant === "bundle" ? copy.pricing.bundle.name : copy.pricing.single.name;
  const wallets = getEngine().deps.payments.walletMethods.length > 0;

  return (
    <>
      <div className="bg-night-950"><Header slug={slug} copy={copy} dark /></div>
      <main className="container-narrow py-8">
        {!legalReady() ? (
          <p className="rounded-2xl border-2 border-berry-500 p-4 font-semibold">Checkout closed: legal holder not configured (LEGAL_HOLDER).</p>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold">{copy.form.title}</h1>
            <p className="mt-1 text-night-900/80">{copy.form.sub}</p>
            <p className="mt-1 text-sm text-night-900/60">{copy.form.stepNote}</p>
            <div className="mt-6">
              <CheckoutForm
                slug={slug}
                country={country}
                variant={variant}
                creative={creative}
                callingCode={c.callingCode}
                timezones={timezonesFor(country)}
                defaultTimezone={c.defaultTimezone}
                twelveHour={locale === "en"}
                summary={copy.form.summary(variantName, price)}
                payLabel={copy.form.pay(price)}
                copy={serializeFormCopy(copy.form)}
                aviso={{ title: aviso.title, intro: aviso.intro, sections: aviso.sections, privacyLink: aviso.privacyLink, privacyHref: `/${slug}/privacidad` }}
                checkboxes={checkboxes}
                reminder={REMINDER_LINE[lang]}
                refund={REFUND_LINE[lang]}
                wallets={wallets}
                termsHref={`/${slug}/terminos`}
              />
            </div>
            <p className="mt-6 text-center text-sm"><Link href={`/${slug}`} className="underline underline-offset-2">&larr; {copy.refundPage.back}</Link></p>
          </>
        )}
      </main>
      <Footer slug={slug} copy={copy} />
    </>
  );
}
