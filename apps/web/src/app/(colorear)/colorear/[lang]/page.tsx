import Image from "next/image";
import { notFound } from "next/navigation";
import { COLOREAR_DEFAULT_COUNTRY, COLOREAR_THEMES, colorearCountriesFor, colorearLegalLocale, colorearPrice, COUNTRIES, formatPrice, isColorearLang, type CountryCode } from "@lumen/config";
import { COLOREAR_REFUND_LINE, renderColorearAviso, resolveAllColorearCheckboxes } from "@lumen/legal";
import { CFooter, CHeader } from "@/components/colorear/Chrome";
import { ColorearForm, type CountryLegal } from "@/components/colorear/ColorearForm";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { legalVars } from "@/lib/legal-vars";

export const dynamic = "force-dynamic";

const COUNTRY_NAMES = {
  es: { MX: "México", ES: "España", US: "Estados Unidos", GB: "Reino Unido" },
  en: { MX: "Mexico", ES: "Spain", US: "United States", GB: "United Kingdom" },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isColorearLang(lang)) return {};
  const c = COLOREAR_COPY[lang];
  return { title: c.siteTitle, description: c.siteDescription, alternates: { languages: { es: "/colorear/es", en: "/colorear/en" } } };
}

export default async function Landing({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { lang } = await params;
  if (!isColorearLang(lang)) notFound();
  const sp = await searchParams;
  const c = COLOREAR_COPY[lang];
  const vars = legalVars();
  const countries = colorearCountriesFor(lang);
  const perCountry: Record<string, CountryLegal> = {};
  for (const code of countries) {
    const legal = colorearLegalLocale(code);
    const p = colorearPrice(code);
    perCountry[code] = {
      country: code,
      label: COUNTRY_NAMES[lang][code],
      price: formatPrice(p.amountMinor, p.currency, COUNTRIES[code].priceFormatLocale),
      checkboxes: resolveAllColorearCheckboxes(legal, vars).map((k) => ({ id: k.checkboxId, text: k.text })),
      aviso: renderColorearAviso(legal, vars, { gb: code === "GB" }),
      refundLine: COLOREAR_REFUND_LINE[legal],
    };
  }
  const first = (countries.includes(COLOREAR_DEFAULT_COUNTRY[lang]) ? COLOREAR_DEFAULT_COUNTRY[lang] : countries[0]) as CountryCode;
  const price = perCountry[first]!.price;
  const themes = COLOREAR_THEMES.map((t) => ({ id: t.id, emoji: t.emoji, label: t[lang] }));
  return (
    <>
      <CHeader lang={lang} />
      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 pb-10 pt-4 md:grid-cols-2">
          <div>
            <p className="inline-block rounded-full border-[3px] border-crayon-ink bg-crayon-yellow px-3 py-1 text-sm font-extrabold">{c.hero.kicker}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{c.hero.title}</h1>
            <p className="mt-4 text-lg">{c.hero.text}</p>
            <a href="#crear" className="mt-6 inline-flex min-h-[56px] items-center rounded-full border-[3px] border-crayon-ink bg-crayon-red px-8 text-lg font-extrabold text-white shadow-[0_6px_0_0_#1f2340] transition active:translate-y-[2px] active:shadow-[0_4px_0_0_#1f2340]">
              {c.hero.cta}
            </a>
            <p className="mt-3 font-semibold">{c.hero.price(price)}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.hero.badges.map((b) => (
                <li key={b} className="rounded-full border-2 border-crayon-ink bg-white px-3 py-1 text-sm font-bold">{b}</li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-sm rotate-2 rounded-3xl border-[3px] border-crayon-ink bg-white p-3 shadow-[8px_8px_0_0_#1f2340]">
            <Image src="/colorear/sample-2.webp" alt={c.samples.alts[1]!} width={480} height={720} priority className="h-auto w-full rounded-2xl" />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8">
          <h2 className="text-2xl font-black md:text-3xl">{c.steps.title}</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            {c.steps.items.map((s, i) => (
              <li key={s.t} className={`rounded-3xl border-[3px] border-crayon-ink p-5 ${["bg-crayon-sky", "bg-crayon-sun", "bg-white"][i]}`}>
                <h3 className="text-lg font-extrabold">{s.t}</h3>
                <p className="mt-1">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8">
          <h2 className="text-2xl font-black md:text-3xl">{c.samples.title}</h2>
          <p className="mt-1">{c.samples.text}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <Image key={n} src={`/colorear/sample-${n}.webp`} alt={c.samples.alts[n - 1]!} width={480} height={720} className="h-auto w-full rounded-2xl border-[3px] border-crayon-ink bg-white" />
            ))}
          </div>
          <p className="mt-2 text-sm opacity-80">{c.samples.caption}</p>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="rounded-3xl border-[3px] border-crayon-ink bg-crayon-green/15 p-6">
            <h2 className="text-2xl font-black">{c.privacy.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              {c.privacy.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        </section>

        <section id="crear" className="mx-auto max-w-2xl scroll-mt-4 px-4 py-8">
          <ColorearForm lang={lang} countries={perCountry} defaultCountry={first} themes={themes} creative={(sp.c ?? "none").slice(0, 40)} />
        </section>

        <section className="mx-auto max-w-3xl px-4 py-8">
          <h2 className="text-2xl font-black md:text-3xl">{c.faq.title}</h2>
          <div className="mt-4 space-y-3">
            {c.faq.items.map((f) => (
              <details key={f.q} className="rounded-2xl border-[3px] border-crayon-ink bg-white p-4">
                <summary className="cursor-pointer font-extrabold">{f.q}</summary>
                <p className="mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <CFooter lang={lang} />
    </>
  );
}
