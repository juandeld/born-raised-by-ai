import { COLOREAR_PRICES, enabledCountries, priceFor, colorearCountries, type CountryCode, type Currency, type Variant } from "@lumen/config";

/**
 * What must exist in Polar for the live catalog, derived from the prices in `@lumen/config` (single source of truth).
 * `POLAR_PRODUCT_MAP` is one JSON object shared by every product line: {"<product>:<COUNTRY>:<variant>": "<Polar product uuid>"}.
 * Jinglo (slug `santa`) and Colorear (slug `colorear`) both read it; nobody edits another line's code to add a product.
 */
export interface CatalogItem {
  key: string;
  product: "santa" | "colorear";
  country: CountryCode;
  variant: Variant;
  currency: Currency;
  amountMinor: number;
  /** Needed for the product to be sellable with the current env. False for the package while BUNDLE_ENABLED is off. */
  required: boolean;
}

export function polarCatalog(env: Record<string, string | undefined> = process.env): CatalogItem[] {
  const items: CatalogItem[] = [];
  const bundleOn = env.BUNDLE_ENABLED === "1";
  for (const country of enabledCountries(env)) {
    for (const variant of ["single", "bundle"] as const) {
      const p = priceFor(country, variant);
      items.push({ key: `santa:${country}:${variant}`, product: "santa", country, variant, currency: p.currency, amountMinor: p.amountMinor, required: variant === "single" || bundleOn });
    }
  }
  for (const country of colorearCountries(env)) {
    const p = COLOREAR_PRICES[country];
    items.push({ key: `colorear:${country}:single`, product: "colorear", country, variant: "single", currency: p.currency, amountMinor: p.amountMinor, required: true });
  }
  return items;
}

export interface CatalogCheck {
  ok: boolean;
  missing: string[];
  /** Keys in the map that no live product uses (typos, countries switched off). */
  unknown: string[];
  /** Entries that are not UUID-shaped. */
  malformed: string[];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function checkProductMap(map: Record<string, string>, env: Record<string, string | undefined> = process.env): CatalogCheck {
  const cat = polarCatalog(env);
  const missing = cat.filter((c) => c.required && !map[c.key]).map((c) => c.key);
  const known = new Set(cat.map((c) => c.key));
  const unknown = Object.keys(map).filter((k) => !known.has(k));
  const malformed = Object.entries(map).filter(([, v]) => !UUID.test(v)).map(([k]) => k);
  return { ok: missing.length === 0 && malformed.length === 0, missing, unknown, malformed };
}

export function describeCatalogItem(i: CatalogItem): string {
  return `${i.key}  ${(i.amountMinor / 100).toFixed(2)} ${i.currency}${i.required ? "" : "  (apagado: crear solo cuando se encienda BUNDLE_ENABLED)"}`;
}
