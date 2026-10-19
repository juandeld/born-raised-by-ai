import { isCountry, type CountryCode, type Currency } from "./pricing";
import { RETENTION_DAYS } from "./retention";

/**
 * Colorear (name + age + 3 themes, no photos). Single source of truth for the web app and the generate engine.
 * Decision D15: images come from OpenAI gpt-image-1 by default once OPENAI_API_KEY exists; Nano Banana is the alternate.
 */
export const COLOREAR = {
  slug: "colorear",
  /** Cover + 46 drawings + back cover. */
  pagesTotal: 48,
  drawings: 46,
  ageMin: 3,
  ageMax: 8,
  refundWindowDays: 7,
  /** Order data and book files are deleted this many days after delivery (D8). */
  retentionDays: RETENTION_DAYS.order,
  themesRequired: 3,
} as const;

/** Price of the 48-page book in minor units of the local currency. $21.99 proposed by marketing-growth, confirmed by pricing (docs/planes/colorear-precios.md). */
export const COLOREAR_PRICES: Record<CountryCode, { amountMinor: number; currency: Currency }> = {
  US: { amountMinor: 2199, currency: "USD" },
  ES: { amountMinor: 1999, currency: "EUR" },
  GB: { amountMinor: 1699, currency: "GBP" },
  MX: { amountMinor: 39900, currency: "MXN" },
};

export function colorearPrice(country: CountryCode): { amountMinor: number; currency: Currency } {
  return COLOREAR_PRICES[country];
}

/** Countries where the book is sold. No calls are involved, so US is open (organic channels; ads there stay gated by marketing rules). */
export function colorearCountries(env: Record<string, string | undefined> = process.env): CountryCode[] {
  const raw = env.COLOREAR_COUNTRIES ?? "MX,ES,GB,US";
  const list = raw.split(",").map((s) => s.trim().toUpperCase()).filter(isCountry);
  return list.length ? list : ["MX"];
}

export type ColorearLang = "es" | "en";
export const COLOREAR_LANGS: ColorearLang[] = ["es", "en"];

export function isColorearLang(v: string | undefined | null): v is ColorearLang {
  return v === "es" || v === "en";
}

/** Default country per page language. */
export const COLOREAR_DEFAULT_COUNTRY: Record<ColorearLang, CountryCode> = { es: "MX", en: "US" };

export function colorearCountriesFor(lang: ColorearLang, env: Record<string, string | undefined> = process.env): CountryCode[] {
  const open = colorearCountries(env);
  const pref: Record<ColorearLang, CountryCode[]> = { es: ["MX", "ES"], en: ["US", "GB"] };
  const list = pref[lang].filter((c) => open.includes(c));
  return list.length ? list : [open[0]!];
}

/** Legal text variant of each country (es-ES differs from es-419 in the checkboxes). */
export function colorearLegalLocale(country: CountryCode): "es-419" | "es-ES" | "en" {
  return country === "ES" ? "es-ES" : country === "US" || country === "GB" ? "en" : "es-419";
}

/** Paper of the PDF: Letter for the Americas, A4 elsewhere. */
export function paperFor(country: CountryCode): "letter" | "a4" {
  return country === "MX" || country === "US" ? "letter" : "a4";
}

export type AgeBand = "3-4" | "5-6" | "7-8";

export function ageBandOf(age: number): AgeBand {
  return age <= 4 ? "3-4" : age <= 6 ? "5-6" : "7-8";
}

export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= COLOREAR.ageMin && age <= COLOREAR.ageMax;
}

export interface ColorearTheme {
  id: string;
  emoji: string;
  es: string;
  en: string;
}

/**
 * Closed catalog (no free text in v1: lowers brand/copyright and moderation risk). Ids are what travels in analytics and prompts.
 * Subject banks for each id live in engines/generate/src/subjects.ts; a test checks both lists match.
 * No theme names a brand, character with a license, or real person.
 */
export const COLOREAR_THEMES: ColorearTheme[] = [
  { id: "dinosaurs", emoji: "\u{1F995}", es: "Dinosaurios", en: "Dinosaurs" },
  { id: "space", emoji: "\u{1F680}", es: "Espacio", en: "Space" },
  { id: "jungle", emoji: "\u{1F981}", es: "Animales de la selva", en: "Jungle animals" },
  { id: "farm", emoji: "\u{1F404}", es: "La granja", en: "The farm" },
  { id: "pets", emoji: "\u{1F436}", es: "Perros y gatos", en: "Dogs and cats" },
  { id: "ocean", emoji: "\u{1F433}", es: "Mar y océano", en: "Sea and ocean" },
  { id: "mermaids", emoji: "\u{1F9DC}", es: "Sirenas", en: "Mermaids" },
  { id: "unicorns", emoji: "\u{1F984}", es: "Unicornios", en: "Unicorns" },
  { id: "dragons", emoji: "\u{1F409}", es: "Dragones", en: "Dragons" },
  { id: "castles", emoji: "\u{1F3F0}", es: "Castillos y princesas", en: "Castles and princesses" },
  { id: "fairies", emoji: "\u{1F9DA}", es: "Hadas", en: "Fairies" },
  { id: "pirates", emoji: "\u{1F3F4}‍☠️", es: "Piratas", en: "Pirates" },
  { id: "robots", emoji: "\u{1F916}", es: "Robots", en: "Robots" },
  { id: "cars", emoji: "\u{1F697}", es: "Carros y carreras", en: "Cars and racing" },
  { id: "trucks", emoji: "\u{1F69C}", es: "Camiones y tractores", en: "Trucks and diggers" },
  { id: "trains", emoji: "\u{1F682}", es: "Trenes", en: "Trains" },
  { id: "planes", emoji: "✈️", es: "Aviones y globos", en: "Planes and balloons" },
  { id: "heroes", emoji: "\u{1F9B8}", es: "Superhéroes", en: "Superheroes" },
  { id: "bugs", emoji: "\u{1F98B}", es: "Mariposas e insectos", en: "Butterflies and bugs" },
  { id: "garden", emoji: "\u{1F33B}", es: "Flores y jardín", en: "Flowers and garden" },
  { id: "sweets", emoji: "\u{1F366}", es: "Helados y postres", en: "Ice cream and treats" },
  { id: "soccer", emoji: "⚽", es: "Fútbol y deportes", en: "Soccer and sports" },
  { id: "music", emoji: "\u{1F3B8}", es: "Música", en: "Music" },
  { id: "christmas", emoji: "\u{1F384}", es: "Navidad", en: "Christmas" },
];

export const COLOREAR_THEME_IDS = COLOREAR_THEMES.map((t) => t.id);

export function isThemeId(v: string): boolean {
  return COLOREAR_THEME_IDS.includes(v);
}

export function themeLabel(id: string, lang: ColorearLang): string {
  const t = COLOREAR_THEMES.find((x) => x.id === id);
  return t ? t[lang] : id;
}

/** Image providers. `mock` draws locally and is free; `openai` needs OPENAI_API_KEY (D15). */
export type ImageProviderName = "openai" | "nanobanana" | "mock";

export function imageProviderName(env: Record<string, string | undefined> = process.env): ImageProviderName {
  const v = (env.IMAGE_PROVIDER ?? "mock").toLowerCase();
  return v === "openai" || v === "nanobanana" ? v : "mock";
}

/**
 * Estimated cost of one 1024x1536 image in USD cents, by provider and quality. [no verificado] taken from public OpenAI
 * pricing as remembered (low ~ $0.016, medium ~ $0.063, high ~ $0.25); confirm with the first real invoice.
 */
export const IMAGE_COST_USD_CENTS: Record<ImageProviderName, Record<"low" | "medium" | "high", number>> = {
  openai: { low: 1.6, medium: 6.3, high: 25 },
  nanobanana: { low: 3.4, medium: 3.4, high: 3.4 },
  mock: { low: 0, medium: 0, high: 0 },
};
