import { brandConfig, type BrandConfig } from "./env";
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
  /** Photos per person: how many the buyer may add (photo 1 is required, the rest improve the likeness). Env: COLOREAR_MAX_PHOTOS_MAIN / _OTHER. */
  photosPerPersonDefault: 3,
  /** Hard ceiling for the two variables above; also how many files per person cleanup looks for. */
  photosPerPersonCeiling: 5,
  /** Server-side limit per photo after the browser compressed it (Vercel body limit is 4.5 MB per request). */
  maxPhotoBytes: 900_000,
  /** Budget for ALL photos of one submit: Vercel rejects a body over 4.5 MB, and the form fields need a little room. */
  uploadBudgetBytes: 4_000_000,
  /**
   * Largest ORIGINAL file the form tries to open (a 48 MP camera photo, a 20 MB iPhone screenshot, a HEIC). Only a sanity limit: the browser reduces
   * the photo before anything is sent, and the limits that matter (`maxPhotoBytes`, `uploadBudgetBytes`) apply to what is sent, never to the original.
   */
  maxOriginalBytes: 60 * 1024 * 1024,
  ageMin: 3,
  /** 18 stands for "adults": the form offers five detail levels, each sent as one representative age (4, 6, 8, 11, 18). */
  ageMax: 18,
  refundWindowDays: 7,
  /** Finished book (PDF) is deleted this many days after delivery (D8). */
  retentionDays: RETENTION_DAYS.order,
  /** Photos are deleted as soon as the characters exist, and never later than this many hours after upload. */
  photoMaxHours: 24,
  /** "Otra aventura con las mismas fotos" is offered this many hours after delivery; the character drawings (never the photos) are kept until then. */
  upsellHours: 48,
  /** Trio credits (the 2 adventures created after delivery) expire this many days after delivery: same as the book (RETENTION_DAYS.order). */
  creditDays: RETENTION_DAYS.order,
  /** The "your book is deleted on <date>" reminder goes out this many days before the deletion. */
  reminderDaysBefore: 5,
} as const;

/**
 * Sellable variants (docs/pricing/colorear.md, decision of 19-oct): `single` = 1 adventure, `bundle3` = Trio (3 adventures),
 * `add1` = "otra aventura con las mismas fotos" (post-delivery offer, 48 h). `credit` is not sold: it is one of the 2 adventures
 * of a Trio, created for free after delivery. The Cinco and the 48-page book are NOT launched.
 */
export type ColorearVariant = "single" | "bundle3" | "add1";
export type ColorearOrderVariant = ColorearVariant | "credit";
export const COLOREAR_SELECTABLE: readonly ColorearVariant[] = ["single", "bundle3"];

export function isSelectableVariant(v: string | undefined | null): v is "single" | "bundle3" {
  return v === "single" || v === "bundle3";
}

/** Number of books (adventures) a purchase of this variant gives. */
export function booksIn(variant: ColorearOrderVariant): number {
  return variant === "bundle3" ? 3 : 1;
}

/** Public base URL of colorear (links in emails, success_url, delivery and refund pages, canonical). */
export function colorearPublicUrl(env: Record<string, string | undefined> = process.env): string {
  return (env.COLOREAR_PUBLIC_URL || "https://www.pintoria.app").replace(/\/$/, "");
}

/**
 * Prices in minor units of the local currency (docs/pricing/colorear.md, section 1.1; approved by Juan on 19-oct).
 * They must match the Polar products (4 currencies each). The Trio is one step below the price of two single books in every
 * currency, so "3 for less than the price of 2" is literally true.
 */
export const COLOREAR_PRICES: Record<CountryCode, Record<ColorearVariant, { amountMinor: number; currency: Currency }>> = {
  US: { single: { amountMinor: 1299, currency: "USD" }, bundle3: { amountMinor: 2499, currency: "USD" }, add1: { amountMinor: 949, currency: "USD" } },
  ES: { single: { amountMinor: 1199, currency: "EUR" }, bundle3: { amountMinor: 2299, currency: "EUR" }, add1: { amountMinor: 849, currency: "EUR" } },
  GB: { single: { amountMinor: 999, currency: "GBP" }, bundle3: { amountMinor: 1899, currency: "GBP" }, add1: { amountMinor: 749, currency: "GBP" } },
  MX: { single: { amountMinor: 22900, currency: "MXN" }, bundle3: { amountMinor: 42900, currency: "MXN" }, add1: { amountMinor: 16900, currency: "MXN" } },
};

export function colorearPrice(country: CountryCode, variant: ColorearVariant = "single"): { amountMinor: number; currency: Currency } {
  return COLOREAR_PRICES[country][variant];
}

/** Countries where the book is sold. No calls are involved, so US is open (organic channels; ads there stay gated by marketing rules). */
export function colorearCountries(env: Record<string, string | undefined> = process.env): CountryCode[] {
  const raw = env.COLOREAR_COUNTRIES ?? "MX,ES,GB,US";
  const list = raw.split(",").map((s) => s.trim().toUpperCase()).filter(isCountry);
  return list.length ? list : ["MX"];
}

/**
 * Test codes: orders made with a code skip the payment and generate the real book, so the team can test end to end without a
 * payment provider. `COLOREAR_TEST_CODES` is a comma-separated list (case-insensitive); empty or missing = feature off. Two cost brakes
 * count orders in the database: a total per code and a rolling 24 h cap.
 */
export const COLOREAR_TEST_CODE_DEFAULTS = { maxUses: 50, dailyCap: 10 } as const;

/**
 * Does the "mock" payment provider work for colorear orders? It lets anyone "pay" for free and get the real book (and a fake receipt),
 * so on the live deployment it is closed unless `COLOREAR_ALLOW_MOCK_PAY=1`. Outside production it is open unless set to 0/false.
 * Colorear has its own switch: `ALLOW_MOCK_PAYMENTS` (which Santa uses) never opens it. When it is closed and the provider is the mock,
 * only a valid test code can start an order (see `colorearInviteOnly`).
 */
export function colorearMockPayAllowed(env: Record<string, string | undefined> = process.env): boolean {
  const v = (env.COLOREAR_ALLOW_MOCK_PAY ?? "").trim().toLowerCase();
  if (v === "1" || v === "true") return true;
  if (v === "0" || v === "false") return false;
  return env.VERCEL_ENV !== "production";
}

/** Invitation-only mode: the payment provider is the mock and mock payments are closed, so the only way in is a test code. */
export function colorearInviteOnly(env: Record<string, string | undefined> = process.env): boolean {
  return (env.PAYMENT_PROVIDER ?? "mock").trim().toLowerCase() === "mock" && !colorearMockPayAllowed(env);
}

/** Upper-cases and removes all whitespace, so "promo 2026 " and "PROMO2026" are the same code. */
export function normalizeTestCode(raw: string): string {
  return raw.normalize("NFKC").replace(/\s+/g, "").toUpperCase();
}

/** Codes configured in the environment, normalized and without duplicates. Empty when the feature is off. */
export function colorearTestCodes(env: Record<string, string | undefined> = process.env): string[] {
  return [...new Set((env.COLOREAR_TEST_CODES ?? "").split(",").map(normalizeTestCode).filter(Boolean))];
}

export function colorearTestCodesEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return colorearTestCodes(env).length > 0;
}

/** `COLOREAR_TEST_CODE_MAX_USES` (orders per code, in total) and `COLOREAR_TEST_CODE_DAILY_CAP` (orders per code in any 24 h). 0 is allowed and closes the code. */
export function colorearTestCodeLimits(env: Record<string, string | undefined> = process.env): { maxUses: number; dailyCap: number } {
  const num = (v: string | undefined, d: number) => {
    if (v === undefined || v.trim() === "") return d;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : d;
  };
  return { maxUses: num(env.COLOREAR_TEST_CODE_MAX_USES, COLOREAR_TEST_CODE_DEFAULTS.maxUses), dailyCap: num(env.COLOREAR_TEST_CODE_DAILY_CAP, COLOREAR_TEST_CODE_DEFAULTS.dailyCap) };
}

/**
 * How many photos one person (or pet) may have: `main` for the protagonist (card 1), `other` for the rest.
 * `COLOREAR_MAX_PHOTOS_MAIN` and `COLOREAR_MAX_PHOTOS_OTHER`, default 3 each, clamped to 1..5. (Juan can lower `other` to 2 to save cost.)
 */
export function colorearPhotoLimits(env: Record<string, string | undefined> = process.env): { main: number; other: number } {
  const num = (v: string | undefined) => {
    const n = Number(v);
    return v === undefined || v.trim() === "" || !Number.isFinite(n) ? COLOREAR.photosPerPersonDefault : Math.min(COLOREAR.photosPerPersonCeiling, Math.max(1, Math.floor(n)));
  };
  return { main: num(env.COLOREAR_MAX_PHOTOS_MAIN), other: num(env.COLOREAR_MAX_PHOTOS_OTHER) };
}

/** Most photos one order can hold with these limits (5 people: the protagonist plus 4 others). */
export function colorearMaxPhotosTotal(limits: { main: number; other: number }): number {
  return limits.main + (COLOREAR.maxPhotos - 1) * limits.other;
}

/**
 * Size each photo may have so that `count` of them fit one request (Vercel rejects a body over 4.5 MB): 640 KB (the normal target) when
 * they fit, down to 120 KB. The browser compresses to 640 KB when the buyer picks a photo and only re-encodes smaller if the total is too big.
 */
export function colorearPhotoBudget(count: number): number {
  return Math.min(640_000, Math.max(120_000, Math.floor(COLOREAR.uploadBudgetBytes / Math.max(1, count))));
}

/** Brand shown to colorear buyers: COLOREAR_BRAND_NAME, default "Pintoria". Never the Santa brand (BRAND_NAME). */
export function colorearBrandName(env: Record<string, string | undefined> = process.env): string {
  return env.COLOREAR_BRAND_NAME?.trim() || "Pintoria";
}

/** Plain mailbox (no display name); the same check for every colorear address taken from the environment. */
const MAILBOX_RE = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

/** Support mailbox of Pintoria. The domain pintoria.app forwards its mail (ImprovMX); lumen-labs.co has no MX records, so replies sent there bounce. */
export const COLOREAR_SUPPORT_EMAIL_DEFAULT = "soporte@pintoria.app";
/** Privacy mailbox of Pintoria (rights requests, list of sub-processors on request): same domain and same reason as the support one. */
export const COLOREAR_PRIVACY_EMAIL_DEFAULT = "privacidad@pintoria.app";

/**
 * Support address shown in every Pintoria text (legal notice, terms, emails, footer) and used as `reply_to`: `COLOREAR_SUPPORT_EMAIL`, default
 * `soporte@pintoria.app`. It does not follow `SUPPORT_EMAIL`, which belongs to Santa. A value that is not a plain address is ignored.
 */
export function colorearSupportEmail(env: Record<string, string | undefined> = process.env): string {
  const v = env.COLOREAR_SUPPORT_EMAIL?.trim();
  return v && MAILBOX_RE.test(v) ? v : COLOREAR_SUPPORT_EMAIL_DEFAULT;
}

/**
 * Privacy contact printed in every Pintoria text (notice, privacy page, receipt): `COLOREAR_PRIVACY_EMAIL`, default `privacidad@pintoria.app`.
 * It does not follow `PRIVACY_EMAIL`, which belongs to Santa. A value that is not a plain address is ignored.
 */
export function colorearPrivacyEmail(env: Record<string, string | undefined> = process.env): string {
  const v = env.COLOREAR_PRIVACY_EMAIL?.trim();
  return v && MAILBOX_RE.test(v) ? v : COLOREAR_PRIVACY_EMAIL_DEFAULT;
}

/** Brand block of colorear: the shared one with Pintoria's name and mailboxes (never Santa's). */
export function colorearBrandConfig(env: Record<string, string | undefined> = process.env): BrandConfig {
  return { ...brandConfig(env), brand: colorearBrandName(env), supportEmail: colorearSupportEmail(env), privacyEmail: colorearPrivacyEmail(env) };
}

/** Plain address inside "Name <addr>" (or a bare address); null when there is none. */
function addressOf(from: string | undefined): string | null {
  const v = (from ?? "").trim();
  const angled = /<([^<>\s@]+@[^<>\s@]+)>/.exec(v);
  if (angled) return angled[1]!;
  return /^[^\s<>@]+@[^\s<>@]+$/.test(v) ? v : null;
}

/**
 * `From` of every colorear email. `COLOREAR_RESEND_FROM` when set (and it holds an address); otherwise the brand name ("Pintoria") with the
 * SAME address as `RESEND_FROM` (shared with Santa, whose display name is "Jinglo"), which needs no new DNS: "Pintoria <hola@lumen-labs.co>".
 * Once pintoria.app is verified in Resend, set COLOREAR_RESEND_FROM="Pintoria <hola@pintoria.app>".
 */
export function colorearResendFrom(env: Record<string, string | undefined> = process.env): string {
  const own = env.COLOREAR_RESEND_FROM?.trim();
  if (own && addressOf(own)) return own;
  const name = colorearBrandName(env).replace(/[<>"\r\n]/g, "").trim() || "Pintoria";
  return `${name} <${addressOf(env.RESEND_FROM) ?? "hola@lumen-labs.co"}>`;
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

export type AgeBand = "3-4" | "5-6" | "7-8" | "9-12" | "adult";

export function ageBandOf(age: number): AgeBand {
  return age <= 4 ? "3-4" : age <= 6 ? "5-6" : age <= 8 ? "7-8" : age <= 12 ? "9-12" : "adult";
}

/** The five detail levels of the form, in order. `age` is the value the form posts (any age of the band maps to the same level). */
export const AGE_LEVELS: ReadonlyArray<{ band: AgeBand; age: number }> = [
  { band: "3-4", age: 4 }, { band: "5-6", age: 6 }, { band: "7-8", age: 8 }, { band: "9-12", age: 11 }, { band: "adult", age: 18 },
];

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

/** Price family of an OpenAI image model: gpt-image-1-mini, gpt-image-1 (shut down 23-oct-2026) or the 2.5 / 2 generation (flare, sunburst). */
export type OpenAIImageFamily = "mini" | "v1" | "v2";

export function openaiImageFamily(model: string): OpenAIImageFamily {
  if (/mini/i.test(model)) return "mini";
  return /^gpt-image-1$/i.test(model.trim()) ? "v1" : "v2";
}

/**
 * Token prices per 1M (USD) by family, for costing an image from the API `usage`. [no verificado] mini and v1 come from earlier
 * runs (docs/proveedores/openai.md); v2 (gpt-image-2.5-flare and -sunburst, gpt-image-2) from third-party pages that quote OpenAI:
 * text in $5, image in $8, image out $30. Confirm against the first invoice before switching the production model.
 */
export const OPENAI_IMAGE_TOKEN_USD_PER_M: Record<OpenAIImageFamily, { out: number; text: number; image: number }> = {
  mini: { out: 8, text: 2, image: 2.5 },
  v1: { out: 40, text: 5, image: 10 },
  v2: { out: 30, text: 5, image: 8 },
};

/**
 * Estimated cost of one 1024x1536 image in USD cents, by provider and quality. [no verificado] taken from public OpenAI
 * pricing as remembered (low ~ $0.016, medium ~ $0.063, high ~ $0.25); confirm with the first real invoice.
 * `openai-v2` (2.5 flare / sunburst): output-only estimates from a third-party table (low $0.005, medium $0.010, high $0.041), plus the input.
 */
export const IMAGE_COST_USD_CENTS: Record<ImageProviderName | "openai-mini" | "openai-v2", Record<"low" | "medium" | "high", number>> = {
  openai: { low: 1.6, medium: 6.3, high: 25 },
  "openai-mini": { low: 0.6, medium: 1.5, high: 5.2 },
  "openai-v2": { low: 0.6, medium: 1.2, high: 4.5 },
  nanobanana: { low: 3.4, medium: 3.4, high: 3.4 },
  mock: { low: 0, medium: 0, high: 0 },
};
