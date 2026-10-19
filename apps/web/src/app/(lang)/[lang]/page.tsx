import type { Metadata } from "next";
import { COUNTRIES, SEASON, formatPrice, priceFor, type CountryCode } from "@lumen/config";
import { Landing } from "@/components/jinglo/Landing";
import { getLandingCopy, longDate } from "@/lib/landing-copy";
import { bundleEnabled, countriesFor, pickCountry, resolveSlug } from "@/lib/slugs";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Instant (UTC) at which the given local wall-clock time happens in `tz`. */
function zonedToUtc(date: string, time: string, tz: string): Date {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const [hh, mm, ss] = time.split(":").map(Number) as [number, number, number];
  const guess = Date.UTC(y, m - 1, d, hh, mm, ss);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).formatToParts(new Date(guess));
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const localAsUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"), g("second"));
  return new Date(guess - (localAsUtc - guess));
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }): Promise<Metadata> {
  const { slug, locale } = resolveSlug((await params).lang);
  const country = pickCountry(locale, one((await searchParams).c));
  const c = getLandingCopy(slug, country);
  return { title: c.doc, description: c.description, openGraph: { title: c.doc, description: c.description, type: "website" } };
}

export default async function LandingPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<SP> }) {
  const { slug, locale } = resolveSlug((await params).lang);
  const sp = await searchParams;
  const country = pickCountry(locale, one(sp.c));
  const countries = countriesFor(locale);
  const creative = one(sp.cr) ?? one(sp.utm_content) ?? "none";
  const cfg = COUNTRIES[country];
  const copy = getLandingCopy(slug, country);
  const price = (v: "single" | "bundle") => {
    const p = priceFor(country, v);
    return formatPrice(p.amountMinor, p.currency, cfg.priceFormatLocale);
  };
  const cr = creative !== "none" ? `&cr=${encodeURIComponent(creative)}` : "";
  const buy = (v: "single" | "bundle") => `/${slug}/comprar?c=${country}&v=${v}${cr}`;
  const deadline = zonedToUtc(SEASON.lastBookingDate, "23:59:59", cfg.defaultTimezone);
  const rawName = one(sp.n) ?? "";
  const langs = [
    { slug: "es", label: "ES", href: "/es" },
    { slug: "es-es", label: "ES-ES", href: "/es-es" },
    { slug: "en", label: "EN", href: "/en" },
  ];

  return (
    <Landing
      slug={slug}
      country={country}
      creative={creative}
      copy={copy}
      price={price("single")}
      price2={price("bundle")}
      buyHref={buy("single")}
      bundleHref={bundleEnabled() ? buy("bundle") : null}
      deadlineIso={deadline.toISOString()}
      deadlineLabel={longDate(SEASON.lastBookingDate, cfg.priceFormatLocale)}
      langs={langs}
      countries={countries.map((c: CountryCode) => ({ code: c, href: `/${slug}?c=${c}${cr}`, current: c === country }))}
      initialName={rawName}
    />
  );
}
