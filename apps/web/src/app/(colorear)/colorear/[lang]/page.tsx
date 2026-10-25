import Image from "next/image";
import { notFound } from "next/navigation";
import { COLOREAR_DEFAULT_COUNTRY, COLOREAR_THEMES, colorearCountriesFor, colorearPhotoLimits, colorearTestCodesEnabled, colorearLegalLocale, colorearPrice, colorearPublicUrl, COUNTRIES, formatPrice, isColorearLang, type CountryCode } from "@lumen/config";
import { COLOREAR_EMAIL_LINE, COLOREAR_REFUND_LINE, COLOREAR_TRIO_LINE, COLOREAR_TRIO_REFUND_LINE, renderColorearAviso, resolveAllColorearCheckboxes } from "@lumen/legal";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { ColorearForm, type CountryLegal } from "@/components/colorear/ColorearForm";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { ThemeIcon } from "@/components/colorear/ThemeIcon";
import { colorearLegalVars } from "@/lib/legal-vars";

export const dynamic = "force-dynamic";

const COUNTRY_NAMES = {
  es: { MX: "México", ES: "España", US: "Estados Unidos", GB: "Reino Unido" },
  en: { MX: "Mexico", ES: "Spain", US: "United States", GB: "United Kingdom" },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isColorearLang(lang)) return {};
  const c = COLOREAR_COPY[lang];
  const base = colorearPublicUrl();
  // Canonical is always the clean Pintoria URL, whichever host served the page (vercel.app, lumen-labs.co, pintoria.app).
  return { title: c.siteTitle, description: c.siteDescription, alternates: { canonical: `${base}${lang === "en" ? "/en" : "/"}`, languages: { es: `${base}/`, en: `${base}/en` } }, openGraph: { title: c.siteTitle, description: c.siteDescription, url: `${base}${lang === "en" ? "/en" : "/"}`, siteName: "Pintoria" } };
}

export default async function Landing({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { lang } = await params;
  if (!isColorearLang(lang)) notFound();
  const sp = await searchParams;
  const c = COLOREAR_COPY[lang];
  const vars = colorearLegalVars();
  const countries = colorearCountriesFor(lang);
  const perCountry: Record<string, CountryLegal> = {};
  for (const code of countries) {
    const legal = colorearLegalLocale(code);
    const fmt = (v: "single" | "bundle3") => { const q = colorearPrice(code, v); return formatPrice(q.amountMinor, q.currency, COUNTRIES[code].priceFormatLocale); };
    const one = colorearPrice(code, "single");
    perCountry[code] = {
      country: code,
      label: COUNTRY_NAMES[lang][code],
      prices: { single: fmt("single"), bundle3: fmt("bundle3"), threeSingles: formatPrice(one.amountMinor * 3, one.currency, COUNTRIES[code].priceFormatLocale) },
      trioLine: COLOREAR_TRIO_LINE[legal],
      trioRefundLine: COLOREAR_TRIO_REFUND_LINE[legal],
      emailLine: COLOREAR_EMAIL_LINE[legal],
      checkboxes: resolveAllColorearCheckboxes(legal, vars).map((k) => ({ id: k.checkboxId, text: k.text })),
      aviso: renderColorearAviso(legal, vars, { gb: code === "GB" }),
      refundLine: COLOREAR_REFUND_LINE[legal],
    };
  }
  const first = (countries.includes(COLOREAR_DEFAULT_COUNTRY[lang]) ? COLOREAR_DEFAULT_COUNTRY[lang] : countries[0]) as CountryCode;
  const price = perCountry[first]!.prices.single;
  const themes = COLOREAR_THEMES.map((t) => ({ id: t.id, label: t[lang] }));
  const stepIcons = ["dinosaurs", "space", "castles", "pirates"];
  return (
    <>
      <CHeader lang={lang} />
      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 pb-12 pt-2 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:pt-4">
          <div>
            <p className="c-stamp c-stamp-hero -rotate-1">{c.hero.kicker}</p>
            <h1 className="c-h c-hero-h mt-4 text-[2.75rem] md:text-[4rem]">{c.hero.title}</h1>
            <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-lapiz-ink">{c.hero.text}</p>
            <a href="#crear" className="c-btn c-btn-hero mt-7">{c.hero.cta}</a>
            <p className="mt-4 text-lg font-bold">{c.hero.price(price)}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.hero.badges.map((b) => (
                <li key={b} className="c-pill">{b}</li>
              ))}
            </ul>
          </div>
          <div className="c-marker c-marker-hero relative mx-auto w-[calc(100%-14px)] max-w-sm rotate-2 p-3 md:w-full">
            <Image src="/colorear/sample-2.webp" alt={c.samples.alts[1]!} width={480} height={720} priority className="h-auto w-full rounded-xl" />
          </div>
        </section>
        <div aria-hidden className="mx-auto h-[3px] max-w-5xl rounded-full bg-lapiz-ink/90" style={{ width: "calc(100% - 2rem)" }} />

        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="c-h c-rule text-3xl">{c.steps.title}</h2>
          <ol className="relative mt-8 grid gap-4 md:grid-cols-3">
            {c.steps.items.map((s, i) => (
              <li key={s.t} className={`relative rounded-2xl border p-5 ${i === 1 ? "border-[2.5px] border-lapiz-ink bg-lapiz-tint shadow-[4px_4px_0_0_#1b6b67]" : "border-lapiz-line bg-white"}`}>
                {i === 1 && <span className="c-stamp absolute -top-3.5 right-4 rotate-2">{lang === "es" ? "La parte divertida" : "The fun part"}</span>}
                <span aria-hidden className={`c-h grid h-9 w-9 place-items-center rounded-full border text-base ${i === 1 ? "border-lapiz-teal bg-lapiz-teal text-white" : "border-lapiz-ink/40"}`}>{i + 1}</span>
                <h3 className="c-h mt-3 text-xl">{s.t}</h3>
                <p className="mt-1 leading-relaxed text-lapiz-ink/90">{s.d}</p>
                {i === 1 && (
                  <div aria-hidden className="mt-4 flex gap-3 text-lapiz-teal">
                    {stepIcons.map((id) => <ThemeIcon key={id} id={id} className="h-9 w-9" />)}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="c-h c-rule text-3xl">{c.samples.title}</h2>
            <span className="c-stamp rotate-1">{lang === "es" ? "Pago único, sin suscripción" : "One-time, no subscription"}</span>
          </div>
          <p className="mt-3 max-w-2xl">{c.samples.text}</p>
          <div className="mt-6 grid grid-cols-3 gap-4 pr-1 sm:gap-6">
            {[1, 2, 3].map((n) => (
              <Image key={n} src={`/colorear/sample-${n}.webp`} alt={c.samples.alts[n - 1]!} width={480} height={720} className={`c-marker-sm h-auto w-full ${["-rotate-1", "rotate-1", "-rotate-[0.5deg]"][n - 1]}`} />
            ))}
          </div>
          <p className="mt-3 text-sm text-lapiz-muted">{c.samples.caption}</p>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-2xl border border-lapiz-teal/40 bg-lapiz-tint p-6 sm:p-8">
            <h2 className="c-h text-2xl">{c.privacy.title}</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {c.privacy.items.map((i) => (
                <li key={i} className="flex gap-3">
                  <svg aria-hidden viewBox="0 0 16 16" width="18" height="18" className="mt-1 shrink-0" fill="none" stroke="#1b6b67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.500l3.200 3L13 4.500" /></svg>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="crear" className="mx-auto max-w-3xl scroll-mt-4 px-4 py-10">
          <ColorearForm lang={lang} countries={perCountry} defaultCountry={first} themes={themes} creative={(sp.c ?? "none").slice(0, 40)} codeEnabled={colorearTestCodesEnabled()} photoLimits={colorearPhotoLimits()} />
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="c-h c-rule text-3xl">{c.faq.title}</h2>
          <div className="mt-6 divide-y divide-lapiz-line rounded-2xl border border-lapiz-line bg-white">
            {c.faq.items.map((f) => (
              <details key={f.q} className="group px-5 py-1">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg aria-hidden viewBox="0 0 16 16" width="16" height="16" className="shrink-0 transition-transform group-open:rotate-45" fill="none" stroke="#23303b" strokeWidth="1.8" strokeLinecap="round"><path d="M8 2v12M2 8h12" /></svg>
                </summary>
                <p className="pb-4 leading-relaxed text-lapiz-ink/90">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <CFooter lang={lang} />
    </>
  );
}
