import { createHmac, randomBytes, randomUUID } from "node:crypto";
import type { Tracker } from "@lumen/analytics";
import type { BaseProps } from "@lumen/analytics";
import { piiHashKey } from "@lumen/config/secrets";
import {
  COLOREAR, COUNTRIES, IMAGE_COST_USD_CENTS, ageBandOf, booksIn, colorearAdultLevelEnabled, colorearCharacterStage, colorearCountries, colorearLegalLocale, colorearMockPayAllowed, colorearPhotoLimits, colorearPrice, colorearPublicUrl, colorearTestCodeLimits, formatPrice, isSelectableVariant, isProtagonistRole, isThemeId, isValidAge, openaiImageFamily, paperFor, themeLabel, toUsdCents,
  addDays, DAY_MS, type AgeBand, type BrandConfig, type ColorearLang, type ColorearVariant, type CountryCode,
} from "@lumen/config";
import type { DeliveryProvider, Storage } from "@lumen/calls";
import type { Db, OrderRow } from "@lumen/db";
import { COLOREAR_DELIVERY_LEGAL, COLOREAR_LEGAL_RULES, COLOREAR_REFUND_LINE, colorearTrioRefund, resolveAllColorearCheckboxes, COLOREAR_CHECKBOX_ORDER } from "@lumen/legal";
import { convertForProvider, paymentProviderByName, type PaymentEvent, type PaymentProvider } from "@lumen/payments";
import { composeColorearMessage, type MailVars } from "./emails";
import { signLink, verifyLink } from "./link";
import { TEST_CODE_PROVIDER, isTestCodeRef, matchTestCode, testCodeHash, testCodeRef } from "./test-code";
import { buildCharacterFromTextPrompt, buildCharacterPrompt, buildCoverPrompt, buildScenePrompt } from "./prompt";
import { inspectLineArt, maxInkFor, normalizeLineArt } from "./qa";
import { composeCoverFromCharacters } from "./cover";
import { assembleBook } from "./pdf";
import { resolvePersonRole, sanitizePersonName, sanitizeShortText, storyLabelsOf } from "./sanitize";
import { charPath, pagePath, pdfPath, photoPath, statePath, type GenState, type PageState } from "./state";
import { STORY_MAX_ATTEMPTS, TemplateStoryProvider, fillNames, fillVisual, joinNames, repairStory, rolesOf, type StoryProvider } from "./story";
import { ImageProviderError, type GeneratedImage, type ImageProvider, type ImageQuality, type PersonInput, type PersonSubmission, type RefImage, type Story } from "./types";

export interface ColorearDeps {
  db: Db;
  storage: Storage;
  uploads: Storage;
  delivery: DeliveryProvider;
  tracker: Tracker;
  payments: PaymentProvider;
  image: ImageProvider;
  mockImage: ImageProvider;
  story: StoryProvider;
  env: Record<string, string | undefined>;
  now: () => Date;
  brand: BrandConfig;
  /** Starts the next run in a fresh invocation when one stops at its time budget (set by the web layer). */
  continueRun?: (orderId: string) => Promise<void>;
}

export interface ColorearCheckoutInput {
  lang: ColorearLang;
  country: CountryCode;
  email: string;
  persons: PersonSubmission[];
  /** Photo 1 of each person (required), in the order of `persons`. */
  photos: Uint8Array[];
  /** Optional extra photos of the same person (angles, light): `extraPhotos[i]` belongs to `persons[i]`. Up to colorearPhotoLimits() - 1 each. */
  extraPhotos?: Uint8Array[][];
  /** Free text (sanitized) or a catalog theme label. */
  theme?: string;
  themeId?: string;
  age: number | string;
  checkboxIds: string[];
  ip: string | null;
  creative?: string;
  device?: string;
  /** What the buyer chose in the selector: 1 adventure (default) or the Trio. */
  variant?: "single" | "bundle3";
  /**
   * Optional test code (COLOREAR_TEST_CODES). A valid one skips the payment: the order is created with `payment_provider='test_code'`,
   * amount 0 and `test_mode`, and the caller marks it paid with an internal `payment_succeeded` event. Checked on the server only.
   */
  testCode?: string;
}

export type ColorearErrors = Partial<Record<"email" | "country" | "persons" | "photos" | "theme" | "age" | "consent" | "variant" | "code", string>>;

export class ColorearValidationError extends Error {
  constructor(readonly errors: ColorearErrors) {
    super(`Invalid colorear checkout: ${Object.keys(errors).join(", ")}`);
  }
}

export interface OrderDetails {
  v: 1;
  persons: PersonInput[];
  theme: string;
  themeId: string;
  age: number;
  lang: ColorearLang;
  /** Photos uploaded per person, in order (the first is the required one). Lets cleanup delete exactly those files. Absent = 1 each (older orders). */
  photoCounts?: number[];
  /**
   * Orders made from another one (Trio credit, "otra aventura"): the character drawings copied from the parent. They replace
   * stage 1 of the run, so no photo is needed. Names and roles in `persons` are the parent's.
   */
  seed?: Array<{ k: number; ext: "png" | "svg" }>;
  /** Parent orders (single, Trio): until when the character drawings are kept for the Trio credits / the 48 h offer (never photos). */
  charsUntil?: string;
  charsDeletedAt?: string;
  /** Day-25 reminder sent. */
  reminderSentAt?: string;
  /** The delivery page showed the 48 h offer (first time). */
  upsellViewedAt?: string;
  /** Trio: unused adventures were cancelled by a partial refund. */
  creditsCancelledAt?: string;
  /** Emails with commercial content sent for this order (limit: COLOREAR_LEGAL_RULES.maxCommercialEmails). */
  commercialEmails?: number;
}

export type RunStatus = "done" | "partial" | "failed" | "locked" | "skipped";
export interface RunResult {
  status: RunStatus;
  stage?: string;
  reason?: string;
}

class FatalGenError extends Error {}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const token = () => randomBytes(16).toString("hex");
const iso = (d: Date) => d.toISOString();

function sniff(b: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "webp";
  return null;
}

type Sharp = (typeof import("sharp"))["default"];
let sharpLoad: Promise<Sharp | null> | undefined;
/** sharp is loaded once per process (and not at all when it is missing: then photos are stored as sent). */
function loadSharp(): Promise<Sharp | null> {
  sharpLoad ??= import("sharp").then(
    (m) => {
      const mod = m as unknown as { default?: Sharp };
      return mod.default ?? (mod as unknown as Sharp);
    },
    () => null,
  );
  return sharpLoad;
}

/**
 * Most pixels a photo may have BEFORE it is decoded. The browser sends at most 2048 px on the long side (about 4 MP), so 40 MP leaves ten times
 * the room; a "pixel bomb" (a 30 KB PNG that is 16000 x 16000) is refused from its header, without decoding it. sharp's default is 268 MP.
 */
export const MAX_INPUT_PIXELS = 40_000_000;
/** Photos re-encoded at the same time for one order (5 people x 3 photos = 15 would otherwise be decoded together). */
export const PREPARE_CONCURRENCY = 3;

/** Re-encodes an uploaded photo: fixes orientation, strips metadata (EXIF/GPS), limits size. Returns null when it is not a valid image or has too many pixels. */
export async function prepareUpload(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (!sniff(bytes)) return null;
  const sharp = await loadSharp();
  if (!sharp) return bytes;
  try {
    const out = await sharp(Buffer.from(bytes), { limitInputPixels: MAX_INPUT_PIXELS }).rotate().resize({ width: 1536, height: 1536, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
    return new Uint8Array(out);
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Maps `items` with at most `limit` calls in flight, in order. Once one call throws, no new call starts (the ones in flight finish) and that error is rethrown. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  let failure: { error: unknown } | null = null;
  const worker = async () => {
    while (!failure && next < items.length) {
      const i = next++;
      try {
        out[i] = await fn(items[i]!, i);
      } catch (error) {
        failure ??= { error };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  if (failure) throw (failure as { error: unknown }).error;
  return out;
}

export class ColorearEngine {
  constructor(readonly d: ColorearDeps) {}

  // ------------------------------------------------------------------ helpers

  private props(o: OrderRow): BaseProps {
    return { product: o.product, country: o.country, language: o.language, creative: o.creative, device: (o.device as BaseProps["device"]) ?? "unknown", order_id: o.id, test_mode: o.test_mode, variant: o.variant };
  }

  private details(o: OrderRow): OrderDetails | null {
    try {
      const j = JSON.parse(o.details ?? "null") as OrderDetails | null;
      return j && j.v === 1 ? j : null;
    } catch {
      return null;
    }
  }

  private legalVars() {
    const b = this.d.brand;
    return { MARCA: b.brand, TITULAR: b.holder, EMAIL_PRIVACIDAD: b.privacyEmail, EMAIL_SOPORTE: b.supportEmail, DOMINIO: b.domain };
  }

  private imageQuality(): ImageQuality {
    const q = (this.d.env.IMAGE_QUALITY ?? "medium").toLowerCase();
    return q === "low" || q === "high" ? q : "medium";
  }

  /**
   * Model and quality of each image step for a provider. Pages: the provider's own model (OPENAI_IMAGE_MODEL) and IMAGE_QUALITY.
   * Characters: COLOREAR_CHARACTER_MODEL / COLOREAR_CHARACTER_QUALITY when set; otherwise the same as the pages (nothing changes).
   * The character model is an OpenAI model id, so it only applies when the book is drawn by the OpenAI provider.
   * `override` is the model to send with character requests (undefined = the provider's own).
   */
  private stagesFor(image: ImageProvider): { pages: { model: string; quality: ImageQuality }; characters: { model: string; quality: ImageQuality; override: string | undefined } } {
    const quality = this.imageQuality();
    const c = colorearCharacterStage(this.d.env);
    const override = image.name === "openai" && c.model && c.model !== image.model ? c.model : undefined;
    return { pages: { model: image.model, quality }, characters: { model: override ?? image.model, quality: c.quality ?? quality, override } };
  }

  /** What the book is drawn with, for the health check and the cost comparison: the same resolution a new book would get. */
  imageStages(): { provider: string; pages: { model: string; quality: string }; characters: { model: string; quality: string } } {
    const st = this.stagesFor(this.d.image);
    return { provider: this.d.image.name, pages: st.pages, characters: { model: st.characters.model, quality: st.characters.quality } };
  }

  private costCapCents(): number {
    const n = Number(this.d.env.COLOREAR_MAX_COST_USD ?? 4);
    return (Number.isFinite(n) && n > 0 ? n : 4) * 100;
  }

  private async getState(orderId: string): Promise<GenState | null> {
    const f = await this.d.storage.get(statePath(orderId));
    if (!f) return null;
    try {
      return JSON.parse(new TextDecoder().decode(f.bytes)) as GenState;
    } catch {
      return null;
    }
  }

  private async putState(orderId: string, s: GenState): Promise<void> {
    s.updatedAt = iso(this.d.now());
    await this.d.storage.put(statePath(orderId), new TextEncoder().encode(JSON.stringify(s)), "application/json");
  }

  private orderByToken(accessToken: string): Promise<OrderRow | undefined> {
    return this.d.db.orders.find({ access_token: accessToken, product: COLOREAR.slug }, { limit: 1 }).then((r) => r[0]);
  }

  // ------------------------------------------------------------------ checkout

  validate(input: ColorearCheckoutInput): { errors: ColorearErrors; persons: PersonInput[]; theme: string; age: number } {
    const errors: ColorearErrors = {};
    if (!colorearCountries(this.d.env).includes(input.country)) errors.country = "Country not open for sale";
    if (!EMAIL_RE.test(input.email.trim())) errors.email = "Invalid email";
    const persons: PersonInput[] = [];
    if (input.persons.length < 1 || input.persons.length > COLOREAR.maxPhotos) errors.persons = "1 to 5 people";
    else {
      const ageNum = Number(input.age);
      for (const [idx, p] of input.persons.entries()) {
        const n = sanitizePersonName(p.name);
        if (!n.ok) {
          errors.persons = `Invalid person (name:${n.reason})`;
          break;
        }
        const r = resolvePersonRole(p, idx, Number.isFinite(ageNum) ? Math.min(ageNum, 12) : COLOREAR.ageMin);
        if (!r.ok) {
          errors.persons = `Invalid person (role:${r.reason})`;
          break;
        }
        persons.push({ name: n.value, ...r.value });
      }
    }
    if (input.photos.length !== input.persons.length || input.photos.length < 1) errors.photos = "A photo for each person";
    else {
      const limits = colorearPhotoLimits(this.d.env);
      const extras = input.extraPhotos ?? [];
      const all = [...input.photos, ...extras.flat()];
      if (extras.length > input.photos.length || extras.some((list, i) => 1 + list.length > (i === 0 ? limits.main : limits.other))) errors.photos = "Too many photos for one person";
      else if (all.some((p) => p.byteLength > COLOREAR.maxPhotoBytes || !sniff(p))) errors.photos = "Invalid or too large photo";
    }
    let theme = "";
    if (input.theme && input.theme.trim()) {
      const t = sanitizeShortText(input.theme, 50);
      if (!t.ok) errors.theme = `Invalid theme (${t.reason})`;
      else theme = t.value;
    }
    const age = Number(input.age);
    // The "Adults" level is off by default (COLOREAR_ADULT_LEVEL): the server refuses it even if the form is forged. Ages 3 to 12 stay open.
    if (!isValidAge(age) || (ageBandOf(age) === "adult" && !colorearAdultLevelEnabled(this.d.env))) errors.age = "Choose one of the detail levels";
    const checked = new Set(input.checkboxIds);
    if (!COLOREAR_CHECKBOX_ORDER.every((id) => checked.has(id))) errors.consent = "All consent boxes are required";
    if (input.variant !== undefined && !isSelectableVariant(input.variant)) errors.variant = "Unknown option";
    // Same answer when the feature is off and when the code is wrong: nothing reveals whether codes exist.
    if ((input.testCode ?? "").trim() && !matchTestCode(this.d.env, input.testCode!)) errors.code = "invalid";
    return { errors, persons, theme, age };
  }

  /**
   * Invitation-only: the payment provider is the mock and mock payments are closed (live deployment without COLOREAR_ALLOW_MOCK_PAY).
   * Nobody can pay, so an order needs a valid test code. Checked first, before any photo is read, re-encoded or stored.
   */
  inviteOnly(): boolean {
    return this.d.payments.name === "mock" && !colorearMockPayAllowed(this.d.env);
  }

  async createCheckout(input: ColorearCheckoutInput, urls: { successUrl: (o: OrderRow) => string; cancelUrl: string }): Promise<{ order: OrderRow; checkoutUrl: string }> {
    if (this.inviteOnly() && !(input.testCode ?? "").trim()) throw new ColorearValidationError({ code: "required" });
    const v = this.validate(input);
    if (Object.keys(v.errors).length) {
      if (v.errors.theme || v.errors.persons) await this.d.tracker.track("content_blocked", { product: COLOREAR.slug, country: input.country, language: input.lang, creative: input.creative ?? "none", device: (input.device as BaseProps["device"]) ?? "unknown", stage: "input", reason: v.errors.theme ? "theme" : "person" });
      throw new ColorearValidationError(v.errors);
    }
    // Test code: checked against the caps before anything is stored (and once more after the insert, see below).
    const code = (input.testCode ?? "").trim() ? matchTestCode(this.d.env, input.testCode!) : null;
    const codeHash = code ? testCodeHash(this.d.env, code) : null;
    const books = booksIn(input.variant === "bundle3" ? "bundle3" : "single");
    if (codeHash) await this.assertTestCodeFits(codeHash, books, null);
    // All photos of every person, re-encoded (EXIF/GPS stripped, orientation fixed), at most PREPARE_CONCURRENCY at a time: photo 1 first, then the extras of that person.
    const flat = input.photos.flatMap((first, i) => [first, ...(input.extraPhotos?.[i] ?? [])].map((bytes, j) => ({ i, j, bytes })));
    const done = await mapLimit(flat, PREPARE_CONCURRENCY, async (p) => {
      const out = await prepareUpload(p.bytes);
      if (!out) throw new ColorearValidationError({ photos: "Unreadable photo" });
      return out;
    });
    const prepared: Uint8Array[][] = input.photos.map(() => []);
    flat.forEach((p, k) => (prepared[p.i]![p.j] = done[k]!));
    const photoCounts = prepared.map((g) => g.length);
    const now = this.d.now();
    const id = randomUUID();
    const variant: "single" | "bundle3" = input.variant === "bundle3" ? "bundle3" : "single";
    const price = colorearPrice(input.country, variant);
    const lang = input.lang;
    const languageCode = lang === "en" ? "en" : input.country === "ES" ? "es-ES" : "es-419";
    const names = joinNames(v.persons.map((p) => p.name), lang);
    const details: OrderDetails = { v: 1, persons: v.persons, theme: v.theme, themeId: input.themeId && isThemeId(input.themeId) ? input.themeId : v.theme ? "custom" : "none", age: v.age, lang, photoCounts };
    // If a put or the insert fails, no photo may stay behind without an order (nothing would ever sweep it).
    const orderInput: Parameters<typeof this.d.db.orders.insert>[0] = {
      id,
      access_token: token(),
      product: COLOREAR.slug,
      variant,
      calls_included: 0,
      country: input.country,
      locale: colorearLegalLocale(input.country, input.lang),
      language: languageCode,
      currency: price.currency,
      // A test-code order has no price: it is never charged and never refunded.
      amount_minor: codeHash ? 0 : price.amountMinor,
      amount_usd_cents: codeHash ? 0 : toUsdCents(price.amountMinor, price.currency, this.d.env),
      status: "created",
      email: input.email.trim().toLowerCase(),
      phone_e164: null,
      phone_e164_hash: null,
      child_first_name: names.slice(0, 120),
      child_age: v.age,
      details: JSON.stringify(details),
      consent_draft: { checkbox_ids: [...new Set(input.checkboxIds)], accepted_at: iso(now), ip: input.ip },
      timezone: "UTC",
      window_start: iso(now),
      window_end: iso(now),
      payment_provider: codeHash ? TEST_CODE_PROVIDER : null,
      // The reference carries the code hash, which is how uses are counted in the database (no new column needed).
      checkout_id: codeHash ? testCodeRef(codeHash, id) : null,
      payment_id: null,
      test_mode: !!codeHash || this.d.payments.name === "mock" || this.d.payments.sandbox === true || this.d.env.TEST_MODE === "1",
      creative: input.creative ?? "none",
      device: input.device ?? "unknown",
      paid_at: null,
      delivered_at: null,
      refunded_at: null,
      refund_reason: null,
      refund_amount_minor: null,
      purge_at: iso(addDays(now, COLOREAR.retentionDays + 1)),
      pii_purged_at: null,
    };
    let order: OrderRow;
    try {
      // allSettled, not all: when one put fails the others keep running, and deleting before they finish would leave their photos behind with no order to find them.
      const puts = await Promise.allSettled(prepared.flatMap((group, i) => group.map((bytes, j) => this.d.uploads.put(photoPath(id, i + 1, j + 1), bytes, "image/jpeg"))));
      const failed = puts.find((r): r is PromiseRejectedResult => r.status === "rejected");
      if (failed) throw failed.reason;
      order = await this.d.db.orders.insert(orderInput);
    } catch (err) {
      await this.deletePhotos(id, photoCounts);
      throw err;
    }
    if (codeHash) {
      // Two requests can pass the first check together: re-check now that this order is stored; if a cap is reached it is cancelled, photos included.
      try {
        await this.assertTestCodeFits(codeHash, books, order.id);
      } catch (err) {
        await this.deletePhotos(id, photoCounts);
        await this.d.db.orders.update(order.id, { status: "cancelled", purge_at: iso(now) });
        throw err;
      }
    }
    // No payment provider is involved for a test code: the web layer marks the order paid with an internal event (same path as a real payment).
    let session: { provider: string; checkoutId: string; url: string };
    if (codeHash) session = { provider: TEST_CODE_PROVIDER, checkoutId: order.checkout_id!, url: urls.successUrl(order) };
    else {
      const charge = convertForProvider(this.d.payments, order.amount_minor, order.currency as never, this.d.env);
      session = await this.d.payments.createCheckout({
        orderId: order.id,
        productSlug: COLOREAR.slug,
        variant,
        country: order.country,
        productName: `${this.d.brand.brand} - ${COLOREAR.slug}`,
        amountMinor: charge.amountMinor,
        currency: charge.currency,
        customerEmail: order.email!,
        successUrl: urls.successUrl(order),
        cancelUrl: urls.cancelUrl,
        testMode: order.test_mode,
      });
    }
    const updated = codeHash ? order : await this.d.db.orders.update(order.id, { checkout_id: session.checkoutId, payment_provider: session.provider });
    const base = this.props(updated);
    // An order made with a test code records the code variant of K2 (`...-colorear-v5-code`): nothing is charged, so it must not say "Al pagar".
    const resolved = resolveAllColorearCheckboxes(lang === "en" ? "en" : input.country === "ES" ? "es-ES" : "es-419", this.legalVars(), { test: !!codeHash });
    await this.d.tracker.track("consent_given", { ...base, checkbox_ids: [...COLOREAR_CHECKBOX_ORDER], text_version_ids: resolved.map((c) => c.textVersionId) });
    await this.d.tracker.track("checkout_started", { ...base, variant, amount_usd_cents: updated.amount_usd_cents, currency: updated.currency, payment_provider: session.provider, photos_per_person: photoCounts });
    if (codeHash) {
      const limits = colorearTestCodeLimits(this.d.env);
      const used = await this.testCodeBooks(codeHash, null);
      await this.d.tracker.track("test_code_redeemed", { ...base, variant, code_hash: codeHash, uses_total: used.total, uses_24h: used.day, max_uses: limits.maxUses, daily_cap: limits.dailyCap });
    }
    return { order: updated, checkoutUrl: session.url };
  }

  // ------------------------------------------------------------------ photos

  /** Deletes the stored photos of an order: `counts[k-1]` files for person k (photo 1 is the required one). Returns how many it looked for. */
  private async deletePhotos(orderId: string, counts: number[]): Promise<number> {
    const jobs = counts.flatMap((n, i) => Array.from({ length: n }, (_, j) => this.d.uploads.delete(photoPath(orderId, i + 1, j + 1)).catch(() => undefined)));
    await Promise.all(jobs);
    return jobs.length;
  }

  /** Photo counts of an order as recorded at checkout (orders from before several photos had 1 per person). */
  private photoCountsOf(det: OrderDetails | null): number[] {
    return det?.photoCounts ?? Array.from({ length: det?.persons.length ?? COLOREAR.maxPhotos }, () => 1);
  }

  // ------------------------------------------------------------------ test codes

  /** Orders made with this code that count against its caps (cancelled ones, e.g. rejected by a cap, do not). `window_start` is the redeem time (engine clock). */
  private async testCodeOrders(hash: string): Promise<OrderRow[]> {
    const rows = await this.d.db.orders.find({ product: COLOREAR.slug, payment_provider: TEST_CODE_PROVIDER });
    return rows
      .filter((o) => o.status !== "cancelled" && isTestCodeRef(o.checkout_id, hash))
      .sort((a, b) => new Date(a.window_start).getTime() - new Date(b.window_start).getTime() || (a.id < b.id ? -1 : 1));
  }

  /**
   * Books the code has used, in total and in the last 24 h. The caps count BOOKS, not orders: a Trio is 3 (it makes 3 real books; its 2 free
   * adventures are separate rows and are not counted again), a single adventure is 1. `exceptId` leaves out the order just inserted.
   */
  private async testCodeBooks(hash: string, exceptId: string | null): Promise<{ total: number; day: number }> {
    const others = (await this.testCodeOrders(hash)).filter((o) => o.id !== exceptId);
    const since = this.d.now().getTime() - DAY_MS;
    const sum = (rows: OrderRow[]) => rows.reduce((n, o) => n + booksIn(o.variant === "bundle3" ? "bundle3" : "single"), 0);
    return { total: sum(others), day: sum(others.filter((o) => new Date(o.window_start).getTime() > since)) };
  }

  /**
   * Does an order of `books` books still fit `COLOREAR_TEST_CODE_MAX_USES` (all time) and `COLOREAR_TEST_CODE_DAILY_CAP` (rolling 24 h), both in
   * books? Throws `code: "exhausted"` when nothing is left, and `code: "left_<n>"` when some books are left but not enough (a Trio with 1 or 2 left).
   * Under a burst of simultaneous requests this fails closed: each request sees the others' rows, so at most the cap ever gets through, and a
   * request refused by a tie can simply be sent again.
   */
  private async assertTestCodeFits(hash: string, books: number, exceptId: string | null): Promise<void> {
    const { maxUses, dailyCap } = colorearTestCodeLimits(this.d.env);
    const used = await this.testCodeBooks(hash, exceptId);
    const left = Math.max(0, Math.min(maxUses - used.total, dailyCap - used.day));
    if (left >= books) return;
    throw new ColorearValidationError({ code: left > 0 ? `left_${left}` : "exhausted" });
  }

  private isTestCodeOrder(o: OrderRow): boolean {
    return o.payment_provider === TEST_CODE_PROVIDER;
  }

  /** A test-code order or a child of one (free Trio adventure). */
  private async isTestCodeFamily(o: OrderRow): Promise<boolean> {
    if (this.isTestCodeOrder(o)) return true;
    const parent = o.parent_order_id ? await this.d.db.orders.get(o.parent_order_id) : null;
    return !!parent && this.isTestCodeOrder(parent);
  }

  // ------------------------------------------------------------------ payment

  async handlePaymentEvent(event: PaymentEvent): Promise<OrderRow | null> {
    if (event.type === "payment_succeeded") return this.confirmPayment(event);
    if (event.type === "refunded") {
      const o = await this.findOrder(event.orderId, event.checkoutId);
      // A partial refund we started (Trio, unused adventures) comes back as this webhook too: `refunded_at` is already set, so it is not a full refund.
      if (o && o.status !== "refunded" && !o.refunded_at) await this.markRefunded(o, "provider_refund", false, false);
    }
    return null;
  }

  private async findOrder(orderId: string | null, checkoutId: string | null): Promise<OrderRow | null> {
    let o: OrderRow | null = orderId ? await this.d.db.orders.get(orderId) : null;
    if (!o && checkoutId) o = (await this.d.db.orders.find({ checkout_id: checkoutId }, { limit: 1 }))[0] ?? null;
    return o && o.product === COLOREAR.slug ? o : null;
  }

  async confirmPayment(event: Extract<PaymentEvent, { type: "payment_succeeded" }>): Promise<OrderRow | null> {
    const order = await this.findOrder(event.orderId, event.checkoutId);
    if (!order) return null;
    if (order.status !== "created") return order; // duplicate webhook
    // An order opened through the mock provider is never marked paid while mock payments are closed (defense in depth: the routes already refuse).
    if (order.payment_provider === "mock" && !colorearMockPayAllowed(this.d.env)) {
      console.warn("[colorear] ignored a mock payment event for an order: mock payments are closed");
      return order;
    }
    const now = this.d.now();
    const draft = order.consent_draft;
    if (!draft) throw new Error(`Order ${order.id} has no consent draft`);
    const lang = (this.details(order)?.lang ?? "es") === "en" ? "en" : order.country === "ES" ? "es-ES" : "es-419";
    // Same variant the buyer saw: the text of an order made with a test code says "Al usar el código", not "Al pagar".
    for (const c of resolveAllColorearCheckboxes(lang, this.legalVars(), { test: this.isTestCodeOrder(order) })) {
      if (!draft.checkbox_ids.includes(c.checkboxId)) continue;
      await this.d.db.consents.insert({
        order_id: order.id,
        payment_id: event.paymentId,
        checkbox_id: c.checkboxId,
        text_version_id: c.textVersionId,
        text_sha256: c.sha256,
        locale: order.locale,
        accepted_at: draft.accepted_at,
        ip: draft.ip,
        // The consents table keys evidence by a hash of the contact point; colorear has no phone, so it is the hash of the email.
        phone_e164_hash: await this.hashEmail(order.email ?? order.id),
        window_start: null,
        window_end: null,
        product_slug: COLOREAR.slug,
        purge_at: iso(addDays(now, 4 * 365)),
      });
    }
    const paid = await this.d.db.orders.update(order.id, { status: "paid", payment_id: event.paymentId, paid_at: iso(now), consent_draft: null });
    const paidVariant = paid.variant === "bundle3" || paid.variant === "add1" ? paid.variant : "single";
    await this.d.tracker.track("paid", { ...this.props(paid), variant: paidVariant, amount_usd_cents: paid.amount_usd_cents, currency: paid.currency, payment_provider: paid.payment_provider ?? this.d.payments.name });
    if (paidVariant === "add1") await this.d.tracker.track("upsell_purchased", { ...this.props(paid), offer: "add1", amount_usd_cents: paid.amount_usd_cents, currency: paid.currency });
    await this.sendMail(paidVariant === "add1" ? "receipt_add" : "receipt", paid);
    // The adventure bought has its own copy of the drawings: the parent's are no longer needed (D26).
    if (paidVariant === "add1" && paid.parent_order_id) {
      const parent = await this.d.db.orders.get(paid.parent_order_id);
      const pdet = parent ? this.details(parent) : null;
      if (parent && pdet && !pdet.charsDeletedAt) await this.eraseCharacters(parent, "last_adventure");
    }
    return paid;
  }

  private async hashEmail(email: string): Promise<string> {
    return createHmac("sha256", piiHashKey(this.d.env)).update(email).digest("hex");
  }

  // ------------------------------------------------------------------ mail

  /** Links in emails and pages of a colorear order always use COLOREAR_PUBLIC_URL (default https://www.pintoria.app). */
  private publicUrl(): string {
    return colorearPublicUrl(this.d.env);
  }

  private async mailVars(o: OrderRow, opts: { daysLeft?: number } = {}): Promise<MailVars> {
    const base = this.publicUrl();
    const kind = o.variant === "add1" ? "add" : o.variant === "credit" ? "credit" : "main";
    const parent = kind === "credit" && o.parent_order_id ? await this.d.db.orders.get(o.parent_order_id) : null;
    const vars: MailVars = {
      names: o.child_first_name ?? "",
      price: formatPrice(o.amount_minor, o.currency as never, COUNTRIES[o.country].priceFormatLocale),
      testOrder: this.isTestCodeOrder(o),
      statusLink: `${base}/colorear/confirmacion/${o.access_token}`,
      deliveryLink: `${base}/colorear/entrega/${o.access_token}`,
      refundLink: `${base}/colorear/reembolso/${o.access_token}`,
      deleteDate: o.purge_at ? iso(new Date(o.purge_at)).slice(0, 10) : "",
      holder: this.d.brand.holder,
      privacyEmail: this.d.brand.privacyEmail,
      supportEmail: this.d.brand.supportEmail,
      brand: this.d.brand.brand,
      notes: [],
      kind,
      parentLink: parent ? `${base}/colorear/entrega/${parent.access_token}` : undefined,
      daysLeft: opts.daysLeft,
      legalLang: this.legalLangOf(o),
      address: this.d.env.LEGAL_ADDRESS ?? "[DOMICILIO PENDIENTE]",
      stopLink: `${base}/api/colorear/baja?t=${o.access_token}&s=${signLink(this.d.env, "baja", o.access_token, 60 * 86_400, this.d.now().getTime())}`,
      landingLink: `${base}${(this.details(o)?.lang ?? "es") === "en" ? "/en" : "/"}`,
      commercialOk: await this.commercialAllowed(o),
    };
    // Trio: adventures still to create. Single / Trio without credits: the 48 h offer (only in the delivery email).
    if (kind === "main" && (o.variant === "single" || o.variant === "bundle3")) {
      const det = this.details(o);
      const credits = det ? await this.creditsOf(o, det) : null;
      if (credits && credits.left > 0 && credits.usable) {
        vars.creditsLeft = credits.left;
        vars.creditsUntil = o.purge_at ? iso(new Date(o.purge_at)).slice(0, 10) : "";
      } else if (det && o.status !== "refunded" && vars.commercialOk) {
        const offer = await this.offerOf(o, det, o.delivered_at ? new Date(o.delivered_at) : this.d.now());
        if (offer) {
          vars.offerPrice = offer.price;
          vars.offerUntil = `${offer.until.slice(0, 16).replace("T", " ")} UTC`;
          vars.offerLink = vars.deliveryLink;
        }
      }
    }
    return vars;
  }

  private legalLangOf(o: OrderRow): "es-419" | "es-ES" | "en" {
    return (this.details(o)?.lang ?? "es") === "en" ? "en" : o.country === "ES" ? "es-ES" : "es-419";
  }

  private offersKey(email: string): Promise<string> {
    return this.hashEmail(`offers:${email.trim().toLowerCase()}`);
  }

  /**
   * Commercial content (the offer) needs: not unsubscribed, and fewer than COLOREAR_LEGAL_RULES.maxCommercialEmails sent for this order.
   * Never for an order made with a test code or for the free Trio adventures of one: nobody bought anything, so there is no prior sale that
   * allows an offer without consent (PECR reg. 22, LSSI art. 21.2), and it would count against the limit of three.
   */
  private async commercialAllowed(o: OrderRow): Promise<boolean> {
    if (!o.email) return false;
    if (await this.isTestCodeFamily(o)) return false;
    if ((this.details(o)?.commercialEmails ?? 0) >= COLOREAR_LEGAL_RULES.maxCommercialEmails) return false;
    return !(await this.d.db.suppression.get(await this.offersKey(o.email)));
  }

  /** One-click stop of offers (link in every email with commercial content). Valid with the order token and its signed link. */
  async unsubscribeOffers(accessToken: string, sig: string | null): Promise<boolean> {
    if (!verifyLink(this.d.env, "baja", accessToken, sig, this.d.now().getTime())) return false;
    const o = await this.orderByToken(accessToken);
    if (!o?.email) return !!o;
    const key = await this.offersKey(o.email);
    if (!(await this.d.db.suppression.get(key))) await this.d.db.suppression.insert({ phone_e164_hash: key, source: "colorear_offers" });
    return true;
  }

  private async sendMail(kind: "receipt" | "receipt_add" | "delivery" | "refund" | "reminder", o: OrderRow, notes: string[] = [], opts: { daysLeft?: number } = {}): Promise<boolean> {
    if (!o.email) return false;
    const det = this.details(o);
    const vars = { ...(await this.mailVars(o, opts)), notes };
    const msg = composeColorearMessage(kind, det?.lang ?? "es", o.email, vars);
    const res = await this.d.delivery.send(msg);
    const commercial = (kind === "delivery" && !!vars.offerPrice) || (kind === "reminder" && !!vars.commercialOk && !(vars.creditsLeft && vars.creditsLeft > 0));
    if (commercial && res.status === "sent") await this.patchDetails(o.id, { commercialEmails: (det?.commercialEmails ?? 0) + 1 });
    await this.d.db.deliveries.insert({
      order_id: o.id,
      kind: kind === "receipt_add" ? "receipt" : kind,
      channel: res.channel,
      status: res.status,
      provider: res.provider,
      provider_id: res.providerId,
      mp3_path: null,
      pdf_path: kind === "delivery" ? pdfPath(o.id) : null,
      link_expires_at: kind === "delivery" ? o.purge_at : null,
      survey_answer: null,
      survey_at: null,
      purge_at: iso(addDays(this.d.now(), 13 * 30)),
    });
    return res.status === "sent";
  }

  // ------------------------------------------------------------------ generation

  /**
   * Mock or sandbox payments + a real image provider could burn money on fake orders: a small daily cap, or an allow-listed
   * email, keeps it safe. Real (live-key) payments always get the real images: every sale pays its own generation.
   */
  private async imageFor(order: OrderRow): Promise<ImageProvider> {
    const real = this.d.image;
    const unpaidProvider = this.d.payments.name === "mock" || this.d.payments.sandbox === true;
    if (real.name === "mock" || !unpaidProvider) return real;
    // Test-code orders (and the Trio adventures made from one) are always real: their cost is capped when the code is redeemed.
    if (await this.isTestCodeFamily(order)) return real;
    const allow = (this.d.env.COLOREAR_TEST_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (order.email && allow.includes(order.email.toLowerCase())) return real;
    const cap = Number(this.d.env.COLOREAR_MOCK_REAL_DAILY_CAP ?? 3);
    const dayStart = new Date(this.d.now());
    dayStart.setUTCHours(0, 0, 0, 0);
    const today = await this.d.db.orders.find({ product: COLOREAR.slug, test_mode: true, paid_at: { gte: iso(dayStart) } });
    const sorted = today.sort((a, b) => (a.paid_at! < b.paid_at! ? -1 : a.paid_at! > b.paid_at! ? 1 : a.id < b.id ? -1 : 1));
    const index = sorted.findIndex((o) => o.id === order.id) + 1;
    return index >= 1 && index <= (Number.isFinite(cap) ? cap : 3) ? real : this.d.mockImage;
  }

  private async initState(order: OrderRow, det: OrderDetails): Promise<GenState> {
    const image = await this.imageFor(order);
    const stages = this.stagesFor(image);
    if (colorearCharacterStage(this.d.env).ignored) console.warn("[colorear] COLOREAR_CHARACTER_MODEL is not a usable OpenAI image model id (or is a shut-down one): ignored, the characters use the page model");
    const now = iso(this.d.now());
    const pages: PageState[] = Array.from({ length: COLOREAR.scenes + 1 }, (_, n) => ({ n, status: "pending", attempts: 0 }));
    const state: GenState = {
      v: 1,
      stage: "queued",
      provider: image.name,
      model: stages.pages.model,
      quality: stages.pages.quality,
      characterModel: stages.characters.model,
      characterQuality: stages.characters.quality,
      startedAt: now,
      updatedAt: now,
      lease: null,
      costCents: 0,
      costCharactersCents: 0,
      calls: 0,
      retries: 0,
      // Trio credit / "otra aventura": the characters are the parent's drawings, already copied; no photo is involved.
      characters: det.seed ? det.seed.map((c) => ({ k: c.k, status: "done" as const, attempts: 0, ext: c.ext })) : det.persons.map((_, i) => ({ k: i + 1, status: "pending" as const, attempts: 0 })),
      story: null,
      pages,
      notes: [],
      effectiveProvider: image.name,
      ...(det.seed ? { photosDeletedAt: now } : {}),
    };
    await this.putState(order.id, state);
    await this.d.tracker.track("generation_started", { ...this.props(order), pages_total: COLOREAR.pagesTotal, provider: image.name, model: image.model, quality: state.quality, character_model: stages.characters.model, character_quality: stages.characters.quality, age_band: ageBandOf(det.age), persons: det.persons.length, theme: det.themeId });
    return state;
  }

  /** Is there work to start now? True when paid, not finished, and no run holds the lease. Used by the status page and the sweeper. */
  async needsRun(order: OrderRow): Promise<boolean> {
    if (order.product !== COLOREAR.slug || order.pii_purged_at) return false;
    if (order.status !== "paid" && order.status !== "completed") return false;
    const state = await this.getState(order.id);
    if (!state) return true;
    if (state.stage === "failed" || state.stage === "done") return state.stage === "done" && order.status === "completed";
    return !state.lease || new Date(state.lease.until) < this.d.now();
  }

  /** Self-healing from the status page: if the book is paid and nobody is working on it, ask for a new run. Cheap and safe to call often. */
  async resumeIfStalled(accessToken: string): Promise<boolean> {
    const order = await this.orderByToken(accessToken);
    if (!order || !this.d.continueRun || !(await this.needsRun(order))) return false;
    await this.d.continueRun(order.id);
    return true;
  }

  async runGeneration(orderId: string, opts: { budgetMs?: number; concurrency?: number } = {}): Promise<RunResult> {
    const startedAt = Date.now();
    const budgetMs = opts.budgetMs ?? Number(this.d.env.COLOREAR_RUN_BUDGET_MS ?? 230_000);
    const concurrency = opts.concurrency ?? Math.max(1, Math.min(16, Number(this.d.env.COLOREAR_CONCURRENCY ?? 12) || 12));
    const remaining = () => budgetMs - (Date.now() - startedAt);
    const order = await this.d.db.orders.get(orderId);
    if (!order || order.product !== COLOREAR.slug || order.pii_purged_at) return { status: "skipped" };
    if (order.status !== "paid" && order.status !== "completed") return { status: "skipped", reason: order.status };
    const det = this.details(order);
    if (!det) return { status: "failed", reason: "no_details" };

    let state = (await this.getState(orderId)) ?? (await this.initState(order, det));
    if (state.stage === "failed") return { status: "failed", stage: state.stage, reason: state.failedReason };
    // lease: soft lock in storage (read-modify-write, then confirm after a short pause)
    const workerId = randomUUID();
    if (state.lease && new Date(state.lease.until) > this.d.now()) return { status: "locked", stage: state.stage };
    state.lease = { id: workerId, until: iso(new Date(this.d.now().getTime() + budgetMs + 20_000)) };
    await this.putState(orderId, state);
    await sleep(250);
    const check = await this.getState(orderId);
    if (!check || check.lease?.id !== workerId) return { status: "locked", stage: state.stage };
    state = check;

    let saving: Promise<void> = Promise.resolve();
    const save = () => (saving = saving.then(() => this.putState(orderId, state)));
    const image = state.provider === this.d.image.name ? this.d.image : this.d.mockImage;
    const band = ageBandOf(det.age);
    const counts = this.photoCountsOf(det);
    const roles = rolesOf(det.persons);
    const names = det.persons.map((p) => p.name);
    const quality = (state.quality as ImageQuality) ?? "medium";
    // Character step: the model and quality recorded when the book started (books from before the setting have none: same as the pages).
    const charQuality = (state.characterQuality as ImageQuality | undefined) ?? quality;
    const charModel = image.name === "openai" && state.characterModel && state.characterModel !== image.model ? state.characterModel : undefined;
    const cap = this.costCapCents();

    const render = async (label: string, req: Parameters<ImageProvider["render"]>[0], inspect: { emptyTop?: number }, counter: { attempts: number }): Promise<{ img: GeneratedImage; bytes: Uint8Array; ext: "png" | "svg"; fallback: boolean }> => {
      let lastReason = "";
      let rateLimited = 0;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (remaining() < 5000) throw new BudgetError();
        if (state.costCents > cap) throw new FatalGenError("cost_cap");
        counter.attempts++;
        try {
          state.calls++;
          const img = await image.render(req);
          state.costCents += img.costUsdCents;
          if (req.kind === "character") state.costCharactersCents = (state.costCharactersCents ?? 0) + img.costUsdCents;
          if (img.format === "svg") return { img, bytes: img.bytes, ext: "svg", fallback: false };
          const norm = await normalizeLineArt(img.bytes);
          const rep = await inspectLineArt(norm, { maxInk: maxInkFor(req.ageBand), ...inspect });
          if (rep.ok) return { img, bytes: norm, ext: "png", fallback: false };
          lastReason = `qa:${rep.reasons.join("+")}`;
        } catch (err) {
          if (err instanceof BudgetError || err instanceof FatalGenError) throw err;
          if (err instanceof ImageProviderError) {
            if (err.kind === "auth" || err.kind === "config") throw new FatalGenError(`provider_${err.kind}`);
            lastReason = err.kind;
            if (err.kind === "moderation") {
              await this.d.tracker.track("content_blocked", { ...this.props(order), stage: "output", reason: `${label}:moderation` });
              throw new ModerationError(err.message);
            }
            if (err.kind === "rate_limit") {
              const wait = Math.min(err.retryAfterMs ?? 6000, 20_000);
              if (remaining() < wait + 8000) throw new BudgetError();
              await sleep(wait);
              // a rate limit says nothing about the page: wait and ask again without using one of its 3 attempts (up to 8 times)
              if (rateLimited++ < 8) attempt--;
            }
          } else lastReason = "unknown";
        }
        state.retries++;
        (state.issues ??= []).push(`${label}#${attempt + 1}:${lastReason}`.slice(0, 80));
        await this.d.tracker.track("generation_page_retried", { ...this.props(order), page_index: -1, attempt: attempt + 1, reason: `${label}:${lastReason}` });
      }
      // local fallback so one bad page never blocks the book
      const fb = await this.d.mockImage.render(req);
      return { img: fb, bytes: fb.bytes, ext: "svg", fallback: true };
    };

    try {
      // ---------------- stage 1: characters
      if (state.characters.some((c) => c.status === "pending")) {
        state.stage = "characters";
        await save();
        await pool(state.characters.filter((c) => c.status === "pending"), concurrency, async (c) => {
          if (remaining() < 5000) throw new BudgetError();
          const role = roles[c.k - 1] ?? "person";
          // Approximate age of the protagonist (the age behind the chosen level), so the face gets the proportions of a child that age.
          const person = det.persons[c.k - 1];
          const ageYears = person?.roleId && isProtagonistRole(person.roleId) ? Math.min(det.age, 12) : undefined;
          // every photo of this person goes in as a reference (up to the limit set at checkout): more angles, closer likeness
          const stored = await Promise.all(Array.from({ length: counts[c.k - 1] ?? 1 }, (_, j) => this.d.uploads.get(photoPath(orderId, c.k, j + 1))));
          const refs: RefImage[] = stored.filter((p): p is NonNullable<typeof p> => !!p).map((p) => ({ bytes: p.bytes, mime: (p.contentType.includes("png") ? "image/png" : "image/jpeg") as RefImage["mime"] }));
          let result: Awaited<ReturnType<typeof render>> | null = null;
          if (refs.length) {
            try {
              result = await render(`char${c.k}`, { prompt: buildCharacterPrompt(role, band, refs.length, ageYears), width: 1024, height: 1024, quality: charQuality, refs, ...(charModel ? { model: charModel } : {}), kind: "character", ageBand: band, hints: { roles: [role], setting: "", seed: c.k } }, {}, c);
            } catch (err) {
              if (!(err instanceof ModerationError)) throw err;
            }
          }
          if (!result) {
            // photo missing or refused: draw the person from the description alone
            c.status = "text_fallback";
            state.notes.push(`photo_${c.k}_text`);
            result = await render(`char${c.k}t`, { prompt: buildCharacterFromTextPrompt(role, band), width: 1024, height: 1024, quality: charQuality, refs: [], ...(charModel ? { model: charModel } : {}), kind: "character", ageBand: band, hints: { roles: [role], setting: "", seed: c.k } }, {}, c).catch(async (err) => {
              if (err instanceof ModerationError) {
                const fb = await this.d.mockImage.render({ prompt: "", width: 1024, height: 1024, quality, refs: [], kind: "character", ageBand: band, hints: { roles: [role], setting: "", seed: c.k } });
                return { img: fb, bytes: fb.bytes, ext: "svg" as const, fallback: true };
              }
              throw err;
            });
          }
          await this.d.storage.put(charPath(orderId, c.k, result.ext), result.bytes, result.ext === "svg" ? "image/svg+xml" : "image/png");
          c.ext = result.ext;
          if (c.status === "pending") c.status = "done";
          await save();
        });
        // the originals are no longer needed: erase them now (never later than 24 h in any case)
        if (!state.photosDeletedAt) {
          const erased = await this.deletePhotos(orderId, counts);
          state.photosDeletedAt = iso(this.d.now());
          await this.d.tracker.track("photos_deleted", { ...this.props(order), count: erased, reason: "characters_ready" });
          await save();
        }
      }

      // ---------------- stage 2: story
      if (!state.story) {
        state.stage = "story";
        // The attempt is counted and saved BEFORE trying, so a crash or a timeout counts too and the book can never retry this stage forever.
        state.storyAttempts = (state.storyAttempts ?? 0) + 1;
        await save();
        const req = { roles, labels: storyLabelsOf(det.persons, det.lang), lang: det.lang, band, theme: det.theme, themeId: det.themeId };
        let written: Story;
        try {
          written = await this.d.story.write(req);
        } catch (err) {
          const why = err instanceof Error ? err.message : "error";
          (state.issues ??= []).push(`story#${state.storyAttempts}:${why}`.slice(0, 80));
          if (state.storyAttempts < STORY_MAX_ATTEMPTS) {
            await save();
            throw err; // the next run asks again
          }
          // Out of attempts: the local template, with any scene that cannot be printed replaced. A paid book is never blocked by its story.
          console.warn("[colorear] story: using the local safe story for run", orderId.slice(0, 8), "after", state.storyAttempts, "attempts:", why);
          written = await new TemplateStoryProvider().write(req);
        }
        // Whoever wrote it, no scene that fails the content filter reaches the book: it is replaced by a generic scene of the same theme.
        const fixed = repairStory(written, req);
        state.story = { ...fixed, writer: written.writer };
        for (const r of fixed.repaired ?? []) {
          (state.issues ??= []).push(`story-scene-${r.n}-replaced:${r.reason}`.slice(0, 80));
          await this.d.tracker.track("content_blocked", { ...this.props(order), stage: "output", reason: `story_scene_${r.n}:${r.reason}` });
        }
        await save();
      }
      const story = state.story!;

      // ---------------- stage 3: cover + scenes
      if (state.pages.some((p) => p.status === "pending")) {
        state.stage = "scenes";
        await save();
        const charRefs = new Map<number, RefImage>();
        for (const c of state.characters) {
          if (c.ext !== "png") continue;
          const f = await this.d.storage.get(charPath(orderId, c.k, "png"));
          if (f) charRefs.set(c.k, { bytes: f.bytes, mime: "image/png" });
        }
        await pool(state.pages.filter((p) => p.status === "pending"), concurrency, async (p) => {
          if (remaining() < 5000) throw new BudgetError();
          const isCover = p.n === 0;
          const scene = isCover ? null : story.scenes[p.n - 1]!;
          const present = isCover ? roles.map((_, i) => i + 1) : scene!.present;
          const refs = present.map((k) => charRefs.get(k)).filter((r): r is RefImage => !!r);
          const visual = isCover
            ? `${fillVisual("{all}", present, roles)} smiling and waving together${det.theme ? `, with a backdrop inspired by: ${det.theme}` : ", ready for an adventure with backpacks and a treasure map"}`
            : fillVisual(scene!.visual, present, roles);
          const prompt = isCover ? buildCoverPrompt(visual, band, refs.length) : buildScenePrompt(visual, band, refs.length);
          const req = { prompt, width: 1024, height: 1536, quality, refs, kind: isCover ? ("cover" as const) : ("scene" as const), ageBand: band, hints: { roles: present.map((k) => roles[k - 1] ?? "person"), setting: scene?.visual ?? "", seed: p.n + 7 } };
          let result;
          try {
            result = await render(`page${p.n}`, req, { emptyTop: isCover ? 0.05 : 0 }, p);
          } catch (err) {
            if (!(err instanceof ModerationError)) throw err;
            // refused: ask again with a plain, safe description of the same scene
            result = await render(`page${p.n}s`, { ...req, prompt: isCover ? buildCoverPrompt("the cartoon characters smiling together outdoors", band, refs.length) : buildScenePrompt("the cartoon characters smiling and playing together outdoors", band, refs.length) }, { emptyTop: 0 }, p).catch(async (e2) => {
              if (!(e2 instanceof ModerationError)) throw e2;
              const fb = await this.d.mockImage.render(req);
              return { img: fb, bytes: fb.bytes, ext: "svg" as const, fallback: true };
            });
          }
          if (isCover && result.fallback) {
            // never a stick-figure cover: compose it from the real characters of this book
            const collage = await composeCoverFromCharacters([...charRefs.values()].map((r) => r.bytes));
            if (collage) {
              result = { ...result, bytes: collage, ext: "png" as const, fallback: false };
              (state.issues ??= []).push("cover:collage");
            }
          }
          await this.d.storage.put(pagePath(orderId, p.n, result.ext), result.bytes, result.ext === "svg" ? "image/svg+xml" : "image/png");
          p.ext = result.ext;
          p.status = result.fallback ? "fallback" : "done";
          await save();
        });
        const fallbacks = state.pages.filter((p) => p.status === "fallback").length;
        if (fallbacks > 5 && state.provider !== "mock") throw new FatalGenError("too_many_fallback_pages");
      }

      // ---------------- stage 4: assemble + deliver
      state.stage = "assemble";
      await save();
      const pageImages: GeneratedImage[] = [];
      for (const p of state.pages) {
        const f = await this.d.storage.get(pagePath(orderId, p.n, p.ext ?? "png"));
        if (!f) throw new Error(`missing page ${p.n}`);
        pageImages.push({ format: p.ext === "svg" ? "svg" : "png", bytes: f.bytes, costUsdCents: 0, costSource: "free" });
      }
      const bytes = await assembleBook({
        lang: det.lang,
        namesLine: joinNames(names, det.lang),
        paper: paperFor(order.country),
        cover: pageImages[0]!,
        scenes: story.scenes.map((s, i) => ({ image: pageImages[i + 1]!, text: fillNames(s.text, names, det.lang) })),
        brand: this.d.brand.brand,
        title: fillNames(story.title, names, det.lang),
      });
      await this.d.storage.put(pdfPath(orderId), bytes, "application/pdf");
      state.pdfBytes = bytes.byteLength;
      state.stage = "done";
      state.doneAt = iso(this.d.now());
      state.lease = null;
      const delivered = new Date(this.d.now());
      const completed = await this.d.db.orders.update(orderId, { status: "completed", purge_at: iso(addDays(delivered, COLOREAR.retentionDays)) });
      // intermediate files are no longer needed. The character drawings of a first book (single or Trio) are the exception: they are kept
      // for the Trio's extra adventures / the 48 h offer and erased by the sweeper at `charsUntil` (30 days Trio, 48 h single). Photos are
      // gone since stage 1 either way.
      const keepsCharacters = (order.variant === "single" && !this.isTestCodeOrder(order)) || order.variant === "bundle3";
      if (keepsCharacters) {
        const until = order.variant === "bundle3" ? addDays(delivered, COLOREAR.creditDays) : new Date(delivered.getTime() + COLOREAR.upsellHours * 3_600_000);
        await this.patchDetails(orderId, { charsUntil: iso(until) });
      } else for (const c of state.characters) await this.d.storage.delete(charPath(orderId, c.k, c.ext ?? "png"));
      for (const p of state.pages) await this.d.storage.delete(pagePath(orderId, p.n, p.ext ?? "png"));
      await save();
      await this.d.tracker.track("generation_completed", {
        ...this.props(completed),
        provider: state.provider,
        images_generated: state.calls,
        retries: state.retries,
        image_cost_usd_cents: Math.round(state.costCents * 100) / 100,
        // Per step, to compare models: pages use `model` / `quality`, the character step its own.
        model: state.model,
        quality: state.quality,
        character_model: state.characterModel ?? state.model,
        character_quality: state.characterQuality ?? state.quality,
        character_cost_usd_cents: Math.round((state.costCharactersCents ?? 0) * 100) / 100,
        pages_cost_usd_cents: Math.round((state.costCents - (state.costCharactersCents ?? 0)) * 100) / 100,
        duration_seconds: Math.round((this.d.now().getTime() - new Date(state.startedAt).getTime()) / 1000),
        pdf_bytes: bytes.byteLength,
      });
      const sent = await this.sendMail("delivery", completed, state.notes.some((n) => n.startsWith("photo_")) ? [det.lang === "es" ? "No pudimos usar alguna foto y dibujamos a esa persona a partir de su descripción." : "We could not use one of the photos, so that person was drawn from the description."] : []);
      await this.d.db.orders.update(orderId, { status: "delivered", delivered_at: iso(this.d.now()) });
      await this.d.tracker.track("delivered", { ...this.props(completed), channel: sent ? "email" : "web" });
      return { status: "done", stage: "done" };
    } catch (err) {
      if (err instanceof BudgetError) {
        state.lease = null;
        await saving.catch(() => undefined);
        await this.putState(orderId, state);
        if (this.d.continueRun) await this.d.continueRun(orderId).catch(() => undefined);
        return { status: "partial", stage: state.stage };
      }
      if (err instanceof FatalGenError) {
        state.stage = "failed";
        state.failedReason = err.message;
        state.lease = null;
        await saving.catch(() => undefined);
        await this.putState(orderId, state);
        await this.d.tracker.track("generation_failed", { ...this.props(order), reason: err.message, pages_done: state.pages.filter((p) => p.status !== "pending").length });
        const fresh = (await this.d.db.orders.get(orderId)) ?? order;
        await this.markRefunded(fresh, "technical_failure", true, true);
        return { status: "failed", stage: "failed", reason: err.message };
      }
      // unexpected: release the lease so the next poll/sweep retries
      state.lease = null;
      await saving.catch(() => undefined);
      await this.putState(orderId, state).catch(() => undefined);
      console.error("[colorear] run error", err instanceof Error ? err.message : err);
      return { status: "partial", stage: state.stage, reason: err instanceof Error ? err.message : "error" };
    }
  }

  // ------------------------------------------------------------------ Trio credits and "otra aventura"

  /**
   * Trio (bundle3) and "otra aventura" (add1) reuse the CHARACTER DRAWINGS of the first book, never the photos (those are erased as
   * today, within 24 h). Every extra book is an order of its own (`parent_order_id`): a free `credit` child for the 2 extra Trio
   * adventures, or a paid `add1` child. The run is the same as for any order, with stage 1 (characters) already done from a copy
   * of the parent's drawings. The drawings are kept only until `details.charsUntil`: 30 days for the Trio, 48 h after delivery for
   * the offer (the later of both when it applies), then the sweeper erases them.
   */
  private locks = new Map<string, Promise<unknown>>();
  private withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(key) ?? Promise.resolve();
    const next = prev.catch(() => undefined).then(fn);
    this.locks.set(key, next);
    void next.finally(() => { if (this.locks.get(key) === next) this.locks.delete(key); }).catch(() => undefined);
    return next;
  }

  private static readonly TRIO_EXTRA = 2;

  private alive(o: OrderRow, det: OrderDetails): boolean {
    return !o.pii_purged_at && (o.status === "delivered" || o.status === "completed") && !!o.purge_at && new Date(o.purge_at) > this.d.now() && !det.charsDeletedAt;
  }

  /** Credits of a Trio: how many of its 2 extra adventures are left. A cancelled (failed) extra book gives its credit back. */
  private async creditsOf(parent: OrderRow, det: OrderDetails): Promise<{ left: number; total: number; usable: boolean } | null> {
    if (parent.variant !== "bundle3") return null;
    const kids = await this.d.db.orders.find({ parent_order_id: parent.id, variant: "credit" });
    const used = kids.filter((k) => k.status !== "cancelled" && k.status !== "refunded").length;
    const left = det.creditsCancelledAt ? 0 : Math.max(0, ColorearEngine.TRIO_EXTRA - used);
    return { left, total: ColorearEngine.TRIO_EXTRA, usable: left > 0 && this.alive(parent, det) };
  }

  /** The 48 h offer "otra aventura con las mismas fotos", or null when it does not apply (not delivered, window over, Trio credits still open, drawings gone). */
  private async offerOf(parent: OrderRow, det: OrderDetails, deliveredAt: Date): Promise<{ price: string; amountMinor: number; until: string } | null> {
    // Only the buyer of ONE adventure gets the 48 h offer; a Trio buyer already has his adventures (D26: drawings kept until the last one).
    if (parent.variant !== "single") return null;
    // Test-code orders do not get the paid offer (there is nothing to charge it with): hidden, and no drawings are kept for it.
    if (this.isTestCodeOrder(parent)) return null;
    if (!this.alive(parent, det)) return null;
    const until = new Date(deliveredAt.getTime() + COLOREAR.upsellHours * 3_600_000);
    if (until <= this.d.now()) return null;
    const p = colorearPrice(parent.country, "add1");
    return { price: formatPrice(p.amountMinor, p.currency, COUNTRIES[parent.country].priceFormatLocale), amountMinor: p.amountMinor, until: iso(until) };
  }

  private cleanTheme(theme: string | undefined, themeId: string | undefined): { ok: true; theme: string; themeId: string } | { ok: false } {
    let value = "";
    if (theme && theme.trim()) {
      const t = sanitizeShortText(theme, 50);
      if (!t.ok) return { ok: false };
      value = t.value;
    }
    return { ok: true, theme: value, themeId: themeId && isThemeId(themeId) ? themeId : value ? "custom" : "none" };
  }

  /** Copies the parent's character drawings to the child's own paths. Null when they are gone. */
  private async copyCharacters(parent: OrderRow, childId: string): Promise<Array<{ k: number; ext: "png" | "svg" }> | null> {
    const st = await this.getState(parent.id);
    if (!st || !st.characters.length) return null;
    const seed: Array<{ k: number; ext: "png" | "svg" }> = [];
    for (const c of st.characters) {
      const ext = c.ext ?? "png";
      const f = await this.d.storage.get(charPath(parent.id, c.k, ext));
      if (!f) {
        for (const done of seed) await this.d.storage.delete(charPath(childId, done.k, done.ext)).catch(() => undefined);
        return null;
      }
      await this.d.storage.put(charPath(childId, c.k, ext), f.bytes, ext === "svg" ? "image/svg+xml" : "image/png");
      seed.push({ k: c.k, ext });
    }
    return seed;
  }

  private async patchDetails(orderId: string, patch: Partial<OrderDetails>): Promise<void> {
    const o = await this.d.db.orders.get(orderId);
    const det = o ? this.details(o) : null;
    if (o && det) await this.d.db.orders.update(orderId, { details: JSON.stringify({ ...det, ...patch }) });
  }

  private async insertChild(parent: OrderRow, pdet: OrderDetails, variant: "credit" | "add1", t: { theme: string; themeId: string }, seed: Array<{ k: number; ext: "png" | "svg" }>, id: string, extra: Partial<OrderRow>): Promise<OrderRow> {
    const now = this.d.now();
    const det: OrderDetails = { v: 1, persons: pdet.persons, theme: t.theme, themeId: t.themeId, age: pdet.age, lang: pdet.lang, seed };
    return this.d.db.orders.insert({
      id,
      access_token: token(),
      product: COLOREAR.slug,
      variant,
      parent_order_id: parent.id,
      calls_included: 0,
      country: parent.country,
      locale: parent.locale,
      language: parent.language,
      currency: parent.currency,
      amount_minor: 0,
      amount_usd_cents: 0,
      status: "created",
      email: parent.email,
      phone_e164: null,
      phone_e164_hash: null,
      child_first_name: parent.child_first_name,
      child_age: parent.child_age,
      details: JSON.stringify(det),
      consent_draft: null,
      timezone: "UTC",
      window_start: iso(now),
      window_end: iso(now),
      payment_provider: null,
      checkout_id: null,
      payment_id: null,
      test_mode: parent.test_mode,
      creative: parent.creative,
      device: parent.device,
      paid_at: null,
      delivered_at: null,
      refunded_at: null,
      refund_reason: null,
      refund_amount_minor: null,
      purge_at: iso(addDays(now, COLOREAR.retentionDays + 1)),
      pii_purged_at: null,
      ...extra,
    });
  }

  /**
   * One of the Trio's 2 extra adventures, with 1 click: the buyer only chooses the theme. Creates a free `credit` order that reuses the
   * parent's character drawings and returns its token; the caller starts the run (`kickRun`). Idempotent per slot (unique `checkout_id`).
   */
  async useCredit(accessToken: string, input: { theme?: string; themeId?: string }): Promise<{ ok: true; orderId: string; token: string; creditsLeft: number } | { ok: false; reason: "not_found" | "no_credits" | "expired" | "invalid_theme" | "busy" }> {
    const first = await this.orderByToken(accessToken);
    if (!first) return { ok: false, reason: "not_found" };
    return this.withLock(first.id, async () => {
      const parent = await this.d.db.orders.get(first.id);
      const pdet = parent ? this.details(parent) : null;
      if (!parent || !pdet || parent.variant !== "bundle3" || parent.status !== "delivered") return { ok: false, reason: "not_found" } as const;
      const credits = await this.creditsOf(parent, pdet);
      if (!credits) return { ok: false, reason: "not_found" } as const;
      if (!this.alive(parent, pdet)) return { ok: false, reason: "expired" } as const;
      if (credits.left <= 0) return { ok: false, reason: "no_credits" } as const;
      const t = this.cleanTheme(input.theme, input.themeId);
      if (!t.ok) {
        await this.d.tracker.track("content_blocked", { ...this.props(parent), stage: "input", reason: "theme" });
        return { ok: false, reason: "invalid_theme" } as const;
      }
      const childId = randomUUID();
      const seed = await this.copyCharacters(parent, childId);
      if (!seed) return { ok: false, reason: "expired" } as const;
      const slot = (await this.d.db.orders.find({ parent_order_id: parent.id, variant: "credit" })).length + 1;
      const now = this.d.now();
      let child: OrderRow;
      try {
        child = await this.insertChild(parent, pdet, "credit", t, seed, childId, { status: "paid", paid_at: iso(now), payment_provider: "credit", checkout_id: `credit:${parent.id}:${slot}` });
      } catch {
        for (const c of seed) await this.d.storage.delete(charPath(childId, c.k, c.ext)).catch(() => undefined);
        return { ok: false, reason: "busy" } as const;
      }
      const left = credits.left - 1;
      await this.d.tracker.track("credit_used", { ...this.props(child), variant: "credit", credits_left: left, credits_total: credits.total });
      // Last adventure requested: the child already holds its own copy, so the parent's drawings are erased now (D26: not kept after the last one).
      if (left === 0) await this.eraseCharacters(parent, "credits_used");
      return { ok: true, orderId: child.id, token: child.access_token, creditsLeft: left } as const;
    });
  }

  signUpsell(accessToken: string, until: string): string {
    const ttl = Math.max(1, Math.floor((new Date(until).getTime() - this.d.now().getTime()) / 1000));
    return signLink(this.d.env, "upsell", accessToken, ttl, this.d.now().getTime());
  }

  /**
   * "Otra aventura con las mismas fotos": checkout of the `add1` product for the 48 h after delivery. Needs the signed offer link
   * (made by getStatus while the offer is open) and re-checks the window. The order starts unpaid and reuses the parent's drawings,
   * copied now so the window cannot close while the buyer is paying. Pays through the same path as any order (mock or Polar).
   */
  async createUpsellCheckout(accessToken: string, sig: string | null, input: { theme?: string; themeId?: string; ip: string | null }, urls: { successUrl: (o: OrderRow) => string; cancelUrl: string }): Promise<{ ok: true; checkoutUrl: string; order: OrderRow } | { ok: false; reason: "not_found" | "expired" | "invalid_theme" }> {
    const parent = await this.orderByToken(accessToken);
    const pdet = parent ? this.details(parent) : null;
    if (!parent || !pdet || !parent.delivered_at) return { ok: false, reason: "not_found" };
    const offer = await this.offerOf(parent, pdet, new Date(parent.delivered_at));
    if (!offer || !verifyLink(this.d.env, "upsell", accessToken, sig, this.d.now().getTime())) return { ok: false, reason: "expired" };
    const t = this.cleanTheme(input.theme, input.themeId);
    if (!t.ok) {
      await this.d.tracker.track("content_blocked", { ...this.props(parent), stage: "input", reason: "theme" });
      return { ok: false, reason: "invalid_theme" };
    }
    const childId = randomUUID();
    const seed = await this.copyCharacters(parent, childId);
    if (!seed) return { ok: false, reason: "expired" };
    const p = colorearPrice(parent.country, "add1");
    const child = await this.insertChild(parent, pdet, "add1", t, seed, childId, {
      amount_minor: p.amountMinor,
      amount_usd_cents: toUsdCents(p.amountMinor, p.currency, this.d.env),
      consent_draft: { checkbox_ids: ["K2"], accepted_at: iso(this.d.now()), ip: input.ip },
    });
    const charge = convertForProvider(this.d.payments, child.amount_minor, child.currency as never, this.d.env);
    const session = await this.d.payments.createCheckout({
      orderId: child.id,
      productSlug: COLOREAR.slug,
      variant: "add1",
      country: child.country,
      productName: `${this.d.brand.brand} - ${COLOREAR.slug} - add1`,
      amountMinor: charge.amountMinor,
      currency: charge.currency,
      customerEmail: child.email!,
      successUrl: urls.successUrl(child),
      cancelUrl: urls.cancelUrl,
      testMode: child.test_mode,
    });
    const updated = await this.d.db.orders.update(child.id, { checkout_id: session.checkoutId, payment_provider: session.provider });
    await this.d.tracker.track("checkout_started", { ...this.props(updated), variant: "add1", amount_usd_cents: updated.amount_usd_cents, currency: updated.currency, payment_provider: session.provider });
    return { ok: true, checkoutUrl: session.url, order: updated };
  }

  /** First time the delivery page shows the offer: one `upsell_viewed` event per order. */
  async trackUpsellViewed(accessToken: string): Promise<void> {
    const o = await this.orderByToken(accessToken);
    const det = o ? this.details(o) : null;
    if (!o || !det || det.upsellViewedAt || !o.delivered_at) return;
    const offer = await this.offerOf(o, det, new Date(o.delivered_at));
    if (!offer) return;
    await this.patchDetails(o.id, { upsellViewedAt: iso(this.d.now()) });
    await this.d.tracker.track("upsell_viewed", { ...this.props(o), offer: "add1", hours_left: Math.max(0, Math.round((new Date(offer.until).getTime() - this.d.now().getTime()) / 3_600_000)) });
  }

  /** Erases the character drawings of a parent order now and records it (no content in the log). */
  private async eraseCharacters(o: OrderRow, reason: string): Promise<void> {
    const count = await this.deleteCharacters(o.id);
    await this.patchDetails(o.id, { charsDeletedAt: iso(this.d.now()) });
    await this.d.tracker.track("characters_deleted", { ...this.props(o), count, reason });
  }

  /** "Delete my characters" button (single-adventure buyers). The book stays until its date; the 48 h offer ends. */
  async deleteMyCharacters(accessToken: string): Promise<{ ok: boolean; message?: string }> {
    const o = await this.orderByToken(accessToken);
    const det = o ? this.details(o) : null;
    if (!o || !det || o.pii_purged_at || o.variant !== "single") return { ok: false };
    if (!det.charsDeletedAt) await this.eraseCharacters(o, "button");
    const lang = det.lang === "en" ? "en" : o.country === "ES" ? "es-ES" : "es-419";
    return { ok: true, message: COLOREAR_DELIVERY_LEGAL[lang].deleteDoneOffer.replace("{{FECHA_BORRADO}}", (o.purge_at ?? "").slice(0, 10)) };
  }

  private async deleteCharacters(orderId: string): Promise<number> {
    let n = 0;
    for (let k = 1; k <= COLOREAR.maxPhotos; k++) for (const ext of ["png", "svg"]) {
      const f = await this.d.storage.get(charPath(orderId, k, ext));
      if (f) { await this.d.storage.delete(charPath(orderId, k, ext)); n++; }
    }
    return n;
  }

  /** A refund of the parent also ends its unused Trio adventures: the extra books (free credits) are cancelled and erased. Paid `add1` books keep their own refund. */
  private async cancelCreditBooks(parent: OrderRow): Promise<void> {
    const kids = await this.d.db.orders.find({ parent_order_id: parent.id, variant: "credit" });
    for (const k of kids) {
      if (k.status === "cancelled" || k.status === "refunded" || k.pii_purged_at) continue;
      await this.deleteFiles(k);
      await this.d.db.orders.update(k.id, { status: "cancelled", purge_at: iso(this.d.now()) });
    }
  }

  // ------------------------------------------------------------------ refunds and cleanup

  /** Erases every file of an order: photos (all of them, as recorded in its details), character drawings, pages and the PDF. */
  private async deleteFiles(order: OrderRow): Promise<void> {
    const orderId = order.id;
    await this.d.storage.delete(pdfPath(orderId)).catch(() => undefined);
    // details can already be gone (a purged order swept again): then look for the most that could ever have been stored
    const counts = this.details(order) ? this.photoCountsOf(this.details(order)) : Array.from({ length: COLOREAR.maxPhotos }, () => COLOREAR.photosPerPersonCeiling);
    await this.deletePhotos(orderId, counts);
    for (let k = 1; k <= COLOREAR.maxPhotos; k++) for (const ext of ["png", "svg"]) await this.d.storage.delete(charPath(orderId, k, ext)).catch(() => undefined);
    for (let n = 0; n <= COLOREAR.scenes; n++) for (const ext of ["png", "svg"]) await this.d.storage.delete(pagePath(orderId, n, ext)).catch(() => undefined);
  }

  /**
   * Refunds go to the provider that charged the order, not to the active one: after switching gateways (mock -> Recurrente,
   * Recurrente -> another) old orders still refund where the money is. Falls back to the active provider when the order's
   * provider is unknown or not configured (same behaviour as before).
   */
  private paymentsFor(order: OrderRow): PaymentProvider {
    const name = order.payment_provider;
    if (!name || name === this.d.payments.name) return this.d.payments;
    try {
      return paymentProviderByName(name, this.d.env);
    } catch (err) {
      console.warn(`[colorear] provider ${name} of order ${order.id} is not configured; refunding through ${this.d.payments.name}`, err instanceof Error ? err.message : err);
      return this.d.payments;
    }
  }

  async markRefunded(order: OrderRow, reason: string, automatic: boolean, callProvider = true): Promise<{ refunded: boolean; reason?: string }> {
    if (order.status === "refunded") return { refunded: true, reason: "already_refunded" };
    if (!order.payment_id) {
      // Never paid, or a free Trio adventure that failed: cancelled, and the credit goes back to the Trio (creditsOf ignores cancelled books).
      await this.d.db.orders.update(order.id, { status: "cancelled" });
      await this.deleteFiles(order);
      return { refunded: false, reason: "not_paid" };
    }
    // A test-code order was never charged: there is nothing to give back at the provider.
    if (callProvider && !this.isTestCodeOrder(order)) await this.paymentsFor(order).refund({ paymentId: order.payment_id, currency: order.currency as never, reason });
    const now = this.d.now();
    await this.deleteFiles(order);
    await this.cancelCreditBooks(order);
    await this.d.db.orders.update(order.id, { status: "refunded", refunded_at: iso(now), refund_reason: reason, refund_amount_minor: order.amount_minor, purge_at: iso(now) });
    await this.d.tracker.track("refunded", { ...this.props(order), reason, amount_usd_cents: order.amount_usd_cents, automatic });
    await this.d.tracker.track("photos_deleted", { ...this.props(order), count: 0, reason: "refund" });
    await this.sendMail("refund", order);
    return { refunded: true };
  }

  async refundByLink(accessToken: string): Promise<{ refunded: boolean; reason?: string }> {
    const order = await this.orderByToken(accessToken);
    if (!order) return { refunded: false, reason: "not_found" };
    const base = new Date(order.delivered_at ?? order.paid_at ?? order.created_at).getTime();
    const days = (this.d.now().getTime() - base) / 86_400_000;
    if (days > COLOREAR.refundWindowDays) return { refunded: false, reason: "outside_window" };
    // Test-code orders have no money to split: "refund" just cancels the order and erases everything (Trio included).
    if (order.variant === "bundle3" && order.payment_id && order.status !== "refunded" && !this.isTestCodeOrder(order)) return this.refundTrio(order, days);
    return this.markRefunded(order, "customer_request", false);
  }

  /**
   * Trio refund (D26 (6)), window counted from the first delivery: only the first adventure used -> full refund; more requested -> the
   * unused ones, one third of the price each (colorearTrioRefund). A partial refund keeps the books already made, cancels the unused
   * adventures and erases the drawings. Partial refunds in Polar are [no verificado]: if the provider call fails nothing is changed and
   * the buyer is told to write to us (plan B of legal: full or none).
   */
  private async refundTrio(order: OrderRow, days: number): Promise<{ refunded: boolean; reason?: string }> {
    const kids = (await this.d.db.orders.find({ parent_order_id: order.id, variant: "credit" })).filter((k) => k.status !== "cancelled" && k.status !== "refunded");
    const used = 1 + kids.length;
    const r = colorearTrioRefund({ paidMinor: order.amount_minor, credits: COLOREAR_LEGAL_RULES.trioAdventures, used, daysSinceFirstDelivery: days, alreadyRefundedMinor: order.refund_amount_minor ?? 0 });
    if (r.rule === "none") return { refunded: false, reason: "nothing_to_refund" };
    if (r.rule === "full") return this.markRefunded(order, "customer_request", false);
    const now = this.d.now();
    // Mark first: the provider's refund webhook can arrive before this method returns and must not be read as a full refund.
    await this.d.db.orders.update(order.id, { refunded_at: iso(now) });
    try {
      await this.paymentsFor(order).refund({ paymentId: order.payment_id!, amountMinor: r.refundMinor, currency: order.currency as never, reason: "customer_request_unused_adventures" });
    } catch (err) {
      console.error("[colorear] partial refund failed", err instanceof Error ? err.message : err);
      await this.d.db.orders.update(order.id, { refunded_at: null });
      return { refunded: false, reason: "partial_failed" };
    }
    await this.patchDetails(order.id, { creditsCancelledAt: iso(now) });
    await this.d.db.orders.update(order.id, { refund_amount_minor: (order.refund_amount_minor ?? 0) + r.refundMinor, refund_reason: "customer_request_unused_adventures", refunded_at: iso(now) });
    const fresh = (await this.d.db.orders.get(order.id)) ?? order;
    if (!(this.details(fresh)?.charsDeletedAt)) await this.eraseCharacters(fresh, "refund");
    await this.d.tracker.track("refunded", { ...this.props(order), reason: "unused_adventures", amount_usd_cents: toUsdCents(r.refundMinor, order.currency as never, this.d.env), automatic: false });
    return { refunded: true, reason: "partial" };
  }

  /** Cron/sweeper: resumes stalled books, refunds books that could not be made in time, erases stray photos and expired books. */
  async sweep(opts: { maxRuns?: number } = {}): Promise<{ resumed: number; refunded: number; photosErased: number; charsErased: number; reminded: number; purged: number }> {
    const out = { resumed: 0, refunded: 0, photosErased: 0, charsErased: 0, reminded: 0, purged: 0 };
    const now = this.d.now();
    const refundAfterMs = Number(this.d.env.COLOREAR_REFUND_AFTER_MIN ?? 45) * 60_000;
    const open = await this.d.db.orders.find({ product: COLOREAR.slug, status: { in: ["paid", "completed"] } });
    for (const o of open) {
      if (o.pii_purged_at) continue;
      if (o.status === "paid" && o.paid_at && now.getTime() - new Date(o.paid_at).getTime() > refundAfterMs) {
        const st = await this.getState(o.id);
        if (!st || !st.lease || new Date(st.lease.until) < now) {
          await this.d.tracker.track("generation_failed", { ...this.props(o), reason: "timeout", pages_done: st ? st.pages.filter((p) => p.status !== "pending").length : 0 });
          await this.markRefunded(o, "technical_failure", true);
          out.refunded++;
          continue;
        }
      }
      if (out.resumed < (opts.maxRuns ?? 2) && (await this.needsRun(o))) {
        out.resumed++;
        // on the web the run needs its own invocation (maxDuration); in scripts and tests it runs inline
        if (this.d.continueRun) await this.d.continueRun(o.id).catch(() => undefined);
        else await this.runGeneration(o.id);
      }
    }
    // photos of unpaid or abandoned orders: gone after 2 h unpaid, 24 h otherwise
    const created = await this.d.db.orders.find({ product: COLOREAR.slug, status: { in: ["created", "paid"] } });
    for (const o of created) {
      if (o.pii_purged_at) continue;
      const age = now.getTime() - new Date(o.created_at).getTime();
      const limit = o.status === "created" ? 2 * 3600_000 : COLOREAR.photoMaxHours * 3600_000;
      if (age > limit) {
        const erased = await this.deletePhotos(o.id, this.photoCountsOf(this.details(o)));
        await this.d.tracker.track("photos_deleted", { ...this.props(o), count: erased, reason: o.status === "created" ? "unpaid" : "retention" });
        out.photosErased++;
        if (o.status === "created") await this.d.db.orders.update(o.id, { status: "cancelled", purge_at: iso(now) });
      }
    }
    // Character drawings kept for the Trio's extra adventures / the 48 h offer: erased when their window ends (photos are never kept).
    // Day-25 reminder: "your book is deleted on <date>", 5 days before the deletion, once per book.
    const live = await this.d.db.orders.find({ product: COLOREAR.slug, status: { in: ["completed", "delivered"] } });
    for (const o of live) {
      if (o.pii_purged_at) continue;
      let det = this.details(o);
      if (!det) continue;
      if (det.charsUntil && !det.charsDeletedAt && new Date(det.charsUntil) <= now) {
        await this.eraseCharacters(o, "window_ended");
        out.charsErased++;
        det = { ...det, charsDeletedAt: iso(now) };
      }
      if (o.status === "delivered" && o.email && o.purge_at && !det.reminderSentAt) {
        const purge = new Date(o.purge_at);
        if (now >= addDays(purge, -COLOREAR.reminderDaysBefore) && now < purge) {
          const daysLeft = Math.max(1, Math.ceil((purge.getTime() - now.getTime()) / DAY_MS));
          const fresh = (await this.d.db.orders.get(o.id)) ?? o;
          const hasCredits = fresh.variant === "bundle3" && ((await this.creditsOf(fresh, det))?.usable ?? false);
          if (await this.sendMail("reminder", fresh, [], { daysLeft })) {
            await this.patchDetails(o.id, { reminderSentAt: iso(now) });
            await this.d.tracker.track("expiry_reminder_sent", { ...this.props(o), days_left: daysLeft, has_credits: hasCredits, sent: true });
            out.reminded++;
          }
        }
      }
    }
    // expired books
    const due = await this.d.db.orders.find({ product: COLOREAR.slug, purge_at: { lte: iso(now) } });
    for (const o of due) {
      if (o.status === "purged" && o.pii_purged_at) continue;
      await this.deleteFiles(o);
      await this.d.db.orders.update(o.id, { email: null, child_first_name: null, child_age: null, details: null, consent_draft: null, pii_purged_at: o.pii_purged_at ?? iso(now), status: o.status === "refunded" || o.status === "cancelled" ? o.status : "purged" });
      out.purged++;
    }
    return out;
  }

  // ------------------------------------------------------------------ read side (web)

  async getStatus(accessToken: string): Promise<ColorearStatus | null> {
    const order = await this.orderByToken(accessToken);
    if (!order) return null;
    const det = this.details(order);
    const lang = det?.lang ?? "es";
    const kind: ColorearStatus["kind"] = order.variant === "add1" ? "add" : order.variant === "credit" ? "credit" : "main";
    const base = { lang, names: order.pii_purged_at ? "" : order.child_first_name ?? "", country: order.country, testMode: order.test_mode, variant: order.variant, kind, parentToken: null as string | null, credits: null as ColorearStatus["credits"], creditsExpired: false, books: [] as ColorearBookRef[], offer: null as ColorearStatus["offer"], legal: { characters: null, offerTerms: null, deleteButton: null } as ColorearStatus["legal"] };
    const none = { characters: [], pages: [], notes: [], expiresAt: null, hasPdf: false };
    if (order.pii_purged_at || order.status === "purged") return { ...base, ...none, phase: "gone", progress: 1, stage: "gone" };
    if (order.status === "refunded") return { ...base, ...none, phase: "refunded", progress: 0, stage: "refunded" };
    if (order.status === "created") return { ...base, ...none, phase: "awaiting_payment", progress: 0, stage: "created" };
    // a free Trio adventure that could not be made is cancelled and its credit returns to the Trio
    if (order.status === "cancelled") return { ...base, ...none, phase: kind === "credit" ? "failed" : "gone", progress: 0, stage: "cancelled", parentToken: await this.parentTokenOf(order) };
    const st = await this.getState(order.id);
    const total = (det?.persons.length ?? 1) + 1 + COLOREAR.scenes + 1;
    const doneUnits = st ? st.characters.filter((c) => c.status !== "pending").length + (st.story ? 1 : 0) + st.pages.filter((p) => p.status !== "pending").length : 0;
    const ready = order.status === "delivered" || (order.status === "completed" && st?.stage === "done");
    const out: ColorearStatus = {
      ...base,
      phase: ready ? "ready" : st?.stage === "failed" ? "failed" : "working",
      progress: ready ? 1 : Math.min(0.97, doneUnits / total),
      stage: st?.stage ?? "queued",
      characters: st ? st.characters.filter((c) => c.status !== "pending").map((c) => c.k) : [],
      pages: st ? st.pages.filter((p) => p.status !== "pending").map((p) => p.n) : [],
      notes: st?.notes ?? [],
      expiresAt: order.purge_at,
      hasPdf: ready,
      parentToken: kind === "credit" ? await this.parentTokenOf(order) : null,
    };
    if (kind === "main" && det && (ready || st?.stage === "failed" || order.status === "completed")) {
      const credits = await this.creditsOf(order, det);
      if (credits && credits.usable) out.credits = { left: credits.left, total: credits.total, until: order.purge_at ?? "" };
      out.creditsExpired = !!credits && credits.left > 0 && !credits.usable;
      out.books = await this.booksOf(order);
      // Legal strings of the delivery page (owned by legal-compliance), with the REAL dates: the drawings are erased and the offer ends then.
      const L = COLOREAR_DELIVERY_LEGAL[this.legalLangOf(order)];
      const day = (iso8: string) => new Date(iso8).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
      const stamp = (iso8: string) => new Date(iso8).toLocaleString(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" });
      const keeps = !det.charsDeletedAt && !!ready;
      if (keeps && order.variant === "single" && det.charsUntil) out.legal.characters = L.charactersOffer.replace("{{FECHA_PERSONAJES}}", stamp(det.charsUntil));
      if (keeps && order.variant === "bundle3" && credits?.usable && order.purge_at) out.legal.characters = L.charactersTrio.replace("{{FECHA_CREDITOS}}", day(order.purge_at));
      if (keeps && order.variant === "single" && det.charsUntil) out.legal.deleteButton = L.deleteButton;
      const offer = ready ? await this.offerOf(order, det, order.delivered_at ? new Date(order.delivered_at) : this.d.now()) : null;
      if (offer) {
        const legalLoc = lang === "en" ? "en" : order.country === "ES" ? "es-ES" : "es-419";
        const k2 = resolveAllColorearCheckboxes(legalLoc, this.legalVars()).find((c) => c.checkboxId === "K2");
        out.legal.offerTerms = L.offerTerms.replace("{{FECHA_OFERTA}}", stamp(offer.until));
        out.offer = { price: offer.price, until: offer.until, sig: this.signUpsell(accessToken, offer.until), hoursLeft: Math.max(1, Math.ceil((new Date(offer.until).getTime() - this.d.now().getTime()) / 3_600_000)), payNotice: k2?.text ?? "" };
      }
    }
    return out;
  }

  private async parentTokenOf(o: OrderRow): Promise<string | null> {
    const parent = o.parent_order_id ? await this.d.db.orders.get(o.parent_order_id) : null;
    return parent && !parent.pii_purged_at ? parent.access_token : null;
  }

  /** The other adventures of a purchase (Trio credits and "otra aventura" books), for the delivery page. Cancelled and unpaid ones are not shown. */
  private async booksOf(parent: OrderRow): Promise<ColorearBookRef[]> {
    const kids = (await this.d.db.orders.find({ parent_order_id: parent.id }, { orderBy: "created_at" })).filter((k) => !["created", "cancelled", "refunded", "purged"].includes(k.status) && !k.pii_purged_at);
    return kids.map((k) => {
      const d = this.details(k);
      const lang = d?.lang ?? "es";
      const label = d && d.theme ? d.theme : lang === "es" ? "Aventura sorpresa" : "Surprise adventure";
      return { token: k.access_token, label, phase: k.status === "delivered" ? ("ready" as const) : ("working" as const), kind: k.variant === "add1" ? ("add" as const) : ("credit" as const) };
    });
  }

  async readPdf(accessToken: string): Promise<{ bytes: Uint8Array; filename: string; order: OrderRow } | null> {
    const order = await this.orderByToken(accessToken);
    if (!order || order.pii_purged_at || (order.status !== "delivered" && order.status !== "completed")) return null;
    const f = await this.d.storage.get(pdfPath(order.id));
    if (!f) return null;
    return { bytes: f.bytes, filename: `libro-para-colorear.pdf`, order };
  }

  /** Progress thumbnails while the book is being made: c1..c5 (characters) and p0..p22 (cover, scenes). */
  async readStageImage(accessToken: string, key: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
    const order = await this.orderByToken(accessToken);
    if (!order || order.pii_purged_at || (order.status !== "paid" && order.status !== "completed")) return null;
    const m = /^([cp])(\d{1,2})$/.exec(key);
    if (!m) return null;
    const n = Number(m[2]);
    for (const ext of ["png", "svg"]) {
      const f = await this.d.storage.get(m[1] === "c" ? charPath(order.id, n, ext) : pagePath(order.id, n, ext));
      if (f) return { bytes: f.bytes, contentType: ext === "svg" ? "image/svg+xml" : "image/png" };
    }
    return null;
  }

  signDownload(accessToken: string, ttlSeconds = 600): string {
    return signLink(this.d.env, "pdf", accessToken, ttlSeconds, this.d.now().getTime());
  }
  verifyDownload(accessToken: string, signed: string | null): boolean {
    return verifyLink(this.d.env, "pdf", accessToken, signed, this.d.now().getTime());
  }

  async answerSurvey(accessToken: string, answer: "loved" | "ok" | "bad"): Promise<boolean> {
    const order = await this.orderByToken(accessToken);
    if (!order) return false;
    const delivery = (await this.d.db.deliveries.find({ order_id: order.id, kind: "delivery" }, { limit: 1 }))[0];
    if (!delivery || delivery.survey_answer) return false;
    await this.d.db.deliveries.update(delivery.id, { survey_answer: answer, survey_at: iso(this.d.now()) });
    await this.d.tracker.track("survey_answered", { ...this.props(order), answer });
    return true;
  }

  async trackDownload(accessToken: string): Promise<void> {
    const order = await this.orderByToken(accessToken);
    if (order) await this.d.tracker.track("book_downloaded", { ...this.props(order), kind: "pdf" });
  }

  /** Estimated cost per book in USD cents for a provider, for the cost budget in docs. */
  static estimateCostCents(model: string, quality: ImageQuality, persons: number): number {
    const family = openaiImageFamily(model);
    const price = IMAGE_COST_USD_CENTS[family === "mini" ? "openai-mini" : family === "v1" ? "openai" : "openai-v2"][quality];
    return price * (persons + COLOREAR.scenes + 1);
  }
}

export interface ColorearBookRef {
  token: string;
  /** What the buyer asked for (catalog label or free text), shown to the buyer only. */
  label: string;
  phase: "working" | "ready";
  kind: "credit" | "add";
}

export interface ColorearStatus {
  phase: "awaiting_payment" | "working" | "ready" | "failed" | "refunded" | "gone";
  variant: string;
  /** main = the purchase (1 adventure or Trio), add = "otra aventura" purchase, credit = free Trio adventure. */
  kind: "main" | "add" | "credit";
  /** Free Trio adventure: token of the order that lists all the adventures. */
  parentToken: string | null;
  /** Trio: adventures that can still be created with 1 click, and when they expire. Null when none (or not a Trio). */
  credits: { left: number; total: number; until: string } | null;
  /** Trio whose unused adventures expired. */
  creditsExpired: boolean;
  /** Other adventures of this purchase. */
  books: ColorearBookRef[];
  /** "Otra aventura con las mismas fotos" while the 48 h window is open. `sig` is the signed link required by the checkout. */
  offer: { price: string; until: string; sig: string; hoursLeft: number; payNotice: string } | null;
  /** Legal strings with their real dates (drawings kept until..., offer valid until..., delete button). Null when they do not apply. */
  legal: { characters: string | null; offerTerms: string | null; deleteButton: string | null };
  progress: number;
  stage: string;
  lang: ColorearLang;
  names: string;
  country: string;
  testMode: boolean;
  characters: number[];
  pages: number[];
  notes: string[];
  expiresAt: string | null;
  hasPdf: boolean;
}

class BudgetError extends Error {}
class ModerationError extends Error {}

/** Runs `fn` over items with at most `limit` in flight; stops scheduling new work after the first error and rethrows it. */
async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
  let i = 0;
  let failure: unknown = null;
  const worker = async () => {
    while (!failure) {
      const idx = i++;
      if (idx >= items.length) return;
      try {
        await fn(items[idx]!);
      } catch (err) {
        failure ??= err;
        return;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  if (failure) throw failure;
}

export { themeLabel };
