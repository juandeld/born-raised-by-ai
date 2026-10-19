import { isCountry, type CountryCode, type Currency } from "./pricing";
import { RETENTION_DAYS } from "./retention";

/**
 * Colorear, "Tu familia para colorear": the buyer uploads 1-5 photos (child, siblings, pet, grandma...) and receives a 24-page
 * PDF where those people, turned into friendly line-art characters, live an adventure with a short story and their names.
 * Decision D15: images come from OpenAI (gpt-image-1-mini by default); Nano Banana is the alternate provider.
 */
export const COLOREAR = {
  slug: "colorear",
  /** Cover + 22 story scenes + final "draw your family" page. */
  pagesTotal: 24,
  scenes: 22,
  maxPhotos: 5,
  /** Server-side limit per photo after the browser compressed it (Vercel body limit is 4.5 MB per request). */
  maxPhotoBytes: 900_000,
  /** Original upload limit shown to the buyer (compressed in the browser before sending). */
  maxUploadMb: 10,
  ageMin: 3,
  ageMax: 8,
  refundWindowDays: 7,
  /** Finished book (PDF) is deleted this many days after delivery (D8). */
  retentionDays: RETENTION_DAYS.order,
  /** Photos are deleted as soon as the characters exist, and never later than this many hours after upload. */
  photoMaxHours: 24,
} as const;

/** Price of the 24-page book in minor units of the local currency ($12.99 per Juan, 18-oct; docs/planes/colorear-precios.md). */
export const COLOREAR_PRICES: Record<CountryCode, { amountMinor: number; currency: Currency }> = {
  US: { amountMinor: 1299, currency: "USD" },
  ES: { amountMinor: 1199, currency: "EUR" },
  GB: { amountMinor: 999, currency: "GBP" },
  MX: { amountMinor: 22900, currency: "MXN" },
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
 * Suggestion chips for the optional "adventure theme" (the buyer may also type a city or a theme). The id travels in analytics.
 * Subject banks live in engines/generate/src/subjects.ts (story ideas for the template story and the mock). No brands.
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
export const IMAGE_COST_USD_CENTS: Record<ImageProviderName | "openai-mini", Record<"low" | "medium" | "high", number>> = {
  openai: { low: 1.6, medium: 6.3, high: 25 },
  "openai-mini": { low: 0.6, medium: 1.5, high: 5.2 },
  nanobanana: { low: 3.4, medium: 3.4, high: 3.4 },
  mock: { low: 0, medium: 0, high: 0 },
};
