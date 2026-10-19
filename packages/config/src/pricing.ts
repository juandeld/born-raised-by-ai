/**
 * Prices per country. Single source of truth for landing, checkout and costs.
 * Amounts are in minor units (cents) of the local currency.
 * Change prices here only (pricing agent: +-10 % without approval, see docs/reglas-de-decision.md).
 */
export type CountryCode = "US" | "ES" | "GB" | "MX";
export type Currency = "USD" | "EUR" | "GBP" | "MXN";
export type Variant = "single" | "bundle";
export type Locale = "es-419" | "es-ES" | "en";

export interface CountryConfig {
  code: CountryCode;
  currency: Currency;
  /** Default IANA time zone shown in the form (the buyer can change it). */
  defaultTimezone: string;
  /** Locale used for the prelude and the agent (legal text ids). */
  preludeLocale: "es-419" | "es-ES" | "en-US" | "en-GB";
  /** Intl locale used to format prices. */
  priceFormatLocale: string;
  prices: Record<Variant, number>;
  /** Phone country calling code (without +) used to validate E.164 numbers. */
  callingCode: string;
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  US: { code: "US", currency: "USD", defaultTimezone: "America/New_York", preludeLocale: "en-US", priceFormatLocale: "en-US", prices: { single: 1499, bundle: 2499 }, callingCode: "1" },
  ES: { code: "ES", currency: "EUR", defaultTimezone: "Europe/Madrid", preludeLocale: "es-ES", priceFormatLocale: "es-ES", prices: { single: 1299, bundle: 1999 }, callingCode: "34" },
  GB: { code: "GB", currency: "GBP", defaultTimezone: "Europe/London", preludeLocale: "en-GB", priceFormatLocale: "en-GB", prices: { single: 1199, bundle: 1999 }, callingCode: "44" },
  MX: { code: "MX", currency: "MXN", defaultTimezone: "America/Mexico_City", preludeLocale: "es-419", priceFormatLocale: "es-MX", prices: { single: 19900, bundle: 34900 }, callingCode: "52" },
};

export const LOCALES: Locale[] = ["es-419", "es-ES", "en"];

/** Default country per route locale. English defaults to GB; US needs ?c=US (US is gated, see enabledCountries). */
export const DEFAULT_COUNTRY_BY_LOCALE: Record<Locale, CountryCode> = {
  "es-419": "MX",
  "es-ES": "ES",
  en: "GB",
};

export function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export function isCountry(v: string | undefined | null): v is CountryCode {
  return !!v && v in COUNTRIES;
}

/**
 * Countries open for sale. Default excludes US until marketing confirms the gate
 * (bundle + CTR >= 3 %, docs/planes/santa-hitos.md). Override with ENABLED_COUNTRIES=US,ES,GB,MX.
 */
export function enabledCountries(env: Record<string, string | undefined> = process.env): CountryCode[] {
  const raw = env.ENABLED_COUNTRIES ?? "MX,ES,GB";
  return raw.split(",").map((s) => s.trim().toUpperCase()).filter(isCountry);
}

export function priceFor(country: CountryCode, variant: Variant): { amountMinor: number; currency: Currency } {
  const c = COUNTRIES[country];
  return { amountMinor: c.prices[variant], currency: c.currency };
}

export function formatPrice(amountMinor: number, currency: Currency, formatLocale: string): string {
  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

/**
 * ESTIMATED FX to USD (USD per 1 unit of currency). [EST] not verified: used only for the
 * support refund cap (<= $50) and for costs reports. Override with FX_USD_PER_EUR, etc.
 */
export function usdPerUnit(currency: Currency, env: Record<string, string | undefined> = process.env): number {
  const defaults: Record<Currency, number> = { USD: 1, EUR: 1.15, GBP: 1.3, MXN: 0.055 };
  const override = env[`FX_USD_PER_${currency}`];
  const n = override ? Number(override) : NaN;
  return Number.isFinite(n) && n > 0 ? n : defaults[currency];
}

export function toUsdCents(amountMinor: number, currency: Currency, env: Record<string, string | undefined> = process.env): number {
  return Math.round(amountMinor * usdPerUnit(currency, env));
}
