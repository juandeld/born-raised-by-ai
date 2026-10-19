import { COUNTRIES, COUNTRIES_BY_LOCALE, DEFAULT_COUNTRY_BY_LOCALE, LOCALE_SLUG, SLUG_LOCALE, enabledCountries, isCountry, type CountryCode, type Locale, type Variant } from "@lumen/config";
import { notFound } from "next/navigation";
import { COPY, type Copy } from "./copy";

export type Slug = "es" | "es-es" | "en";
export const SLUGS: Slug[] = ["es", "es-es", "en"];

export function isSlug(v: string): v is Slug {
  return (SLUGS as string[]).includes(v);
}

/** Resolves the [lang] route segment or 404s. */
export function resolveSlug(raw: string): { slug: Slug; locale: Locale; copy: Copy } {
  if (!isSlug(raw)) notFound();
  return { slug: raw, locale: SLUG_LOCALE[raw], copy: COPY[raw] };
}

export const slugOf = (locale: Locale): Slug => LOCALE_SLUG[locale];

/** Countries that can be bought from this route and are open for sale (US stays hidden until enabled). */
export function countriesFor(locale: Locale, env: Record<string, string | undefined> = process.env): CountryCode[] {
  const open = enabledCountries(env);
  const list = COUNTRIES_BY_LOCALE[locale].filter((c) => open.includes(c));
  return list.length ? list : [DEFAULT_COUNTRY_BY_LOCALE[locale]];
}

export function pickCountry(locale: Locale, requested: string | undefined, env: Record<string, string | undefined> = process.env): CountryCode {
  const allowed = countriesFor(locale, env);
  const want = requested?.toUpperCase();
  return isCountry(want) && allowed.includes(want) ? want : allowed[0]!;
}

export function pickVariant(raw: string | undefined): Variant {
  return raw === "bundle" ? "bundle" : "single";
}

/** The second call of the bundle is not schedulable yet (one date and window per order): off unless BUNDLE_ENABLED=1. */
export function bundleEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.BUNDLE_ENABLED === "1";
}

export function timezonesFor(country: CountryCode): string[] {
  const extra: Record<CountryCode, string[]> = {
    MX: ["America/Mexico_City", "America/Cancun", "America/Tijuana", "America/Hermosillo", "America/Chihuahua"],
    ES: ["Europe/Madrid", "Atlantic/Canary"],
    GB: ["Europe/London"],
    US: ["America/New_York", "America/Chicago", "America/Denver", "America/Phoenix", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu"],
  };
  const list = extra[country];
  return list.includes(COUNTRIES[country].defaultTimezone) ? list : [COUNTRIES[country].defaultTimezone, ...list];
}
