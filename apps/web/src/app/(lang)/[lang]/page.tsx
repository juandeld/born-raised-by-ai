import Link from "next/link";
import { COUNTRIES, formatPrice, priceFor, type CountryCode, type Variant } from "@lumen/config";
import { Faq } from "@/components/Faq";
import { SampleAudio } from "@/components/SampleAudio";
import { Footer, Header } from "@/components/SiteChrome";
import { Track } from "@/components/Track";
import { bundleEnabled, countriesFor, pickCountry, resolveSlug } from "@/lib/slugs";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Landing({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }) {
  const { slug, locale, copy } = resolveSlug((await params).lang);
  const sp = await searchParams;
  const country = pickCountry(locale, one(sp.c));
  const countries = countriesFor(locale);
  const creative = one(sp.cr) ?? one(sp.utm_content) ?? "none";
  const character = copy.character(country);
  const price = (v: Variant) => {
    const p = priceFor(country, v);
    return formatPrice(p.amountMinor, p.currency, COUNTRIES[country].priceFormatLocale);
  };
  const buy = (v: Variant) => `/${slug}/comprar?c=${country}&v=${v}${creative !== "none" ? `&cr=${encodeURIComponent(creative)}` : ""}`;
  const bundleOn = bundleEnabled();

  return (
    <>
      <Track event="landing_view" slug={slug} country={country} creative={creative} />
      <div className="relative overflow-hidden bg-gradient-to-b from-night-950 via-night-900 to-night-800 text-cream-50">
        <div aria-hidden className="stars absolute inset-0" />
        <div className="relative">
          <Header slug={slug} copy={copy} dark />
          <section className="container-narrow pb-14 pt-8 text-center">
            <p className="mx-auto inline-block rounded-full bg-gold-400/15 px-4 py-1.5 text-sm font-semibold text-gold-300">{copy.hero.badge}</p>
            <h1 className="mt-5 font-display text-[2.4rem] font-bold leading-[1.08] sm:text-5xl">{copy.hero.title(character)}</h1>
            <p className="mx-auto mt-4 max-w-[34ch] text-lg text-cream-50/85">{copy.hero.sub}</p>
            <div className="mt-8">
              <Link href={buy("single")} className="btn btn-gold">{copy.hero.cta(price("single"))}</Link>
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-cream-50/80">
              {copy.hero.trust.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span aria-hidden className="text-gold-400">&#10003;</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="steps" className="container-narrow pt-12">
        <h2 id="steps" className="font-display text-3xl font-bold">{copy.steps.title}</h2>
        <ol className="mt-5 space-y-4">
          {copy.steps.items.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-3xl border border-night-700/15 bg-white p-5">
              <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night-900 font-display text-lg font-bold text-gold-400">{i + 1}</span>
              <div>
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-night-900/80">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <SampleAudio copy={copy} />

      <section aria-labelledby="pricing" className="container-narrow pt-12">
        <h2 id="pricing" className="font-display text-3xl font-bold">{copy.pricing.title}</h2>
        <p className="mt-1 text-night-900/80">{copy.pricing.oneTime}</p>
        {countries.length > 1 && (
          <div className="mt-3 flex items-center gap-2 text-sm" role="group" aria-label={copy.pricing.country}>
            <span className="font-semibold">{copy.pricing.country}:</span>
            {countries.map((c: CountryCode) => (
              <Link key={c} href={`/${slug}?c=${c}`} aria-current={c === country ? "true" : undefined} className={`rounded-full px-3 py-1 ${c === country ? "bg-night-900 font-bold text-cream-50" : "border border-night-700/30"}`}>{c}</Link>
            ))}
          </div>
        )}
        <div className="mt-5 grid gap-4">
          <article className="rounded-3xl border-2 border-gold-500 bg-white p-5">
            <h3 className="text-lg font-bold">{copy.pricing.single.name}</h3>
            <p className="mt-1 font-display text-4xl font-bold">{price("single")}</p>
            <ul className="mt-3 space-y-1.5 text-night-900/85">
              {copy.pricing.single.bullets.map((b) => (<li key={b} className="flex gap-2"><span aria-hidden className="text-holly-500">&#10003;</span>{b}</li>))}
            </ul>
            <Link href={buy("single")} className="btn btn-gold mt-5">{copy.pricing.choose}</Link>
          </article>
          <article className="rounded-3xl border border-night-700/20 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{copy.pricing.bundle.name}</h3>
              <span className="rounded-full bg-berry-500 px-3 py-1 text-xs font-bold text-white">{copy.pricing.bundle.badge}</span>
            </div>
            <p className="mt-1 font-display text-4xl font-bold">{price("bundle")}</p>
            <ul className="mt-3 space-y-1.5 text-night-900/85">
              {copy.pricing.bundle.bullets.map((b) => (<li key={b} className="flex gap-2"><span aria-hidden className="text-holly-500">&#10003;</span>{b}</li>))}
            </ul>
            {bundleOn ? (
              <Link href={buy("bundle")} className="btn btn-ghost mt-5">{copy.pricing.choose}</Link>
            ) : (
              <button type="button" disabled className="btn btn-ghost mt-5">{copy.pricing.bundle.soon}</button>
            )}
          </article>
        </div>
      </section>

      <Faq copy={copy} />
      <Footer slug={slug} copy={copy} />
    </>
  );
}
