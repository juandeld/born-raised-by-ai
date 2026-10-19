import { randomBytes, randomUUID } from "node:crypto";
import type { Tracker } from "@lumen/analytics";
import type { BaseProps } from "@lumen/analytics";
import {
  COLOREAR, COUNTRIES, IMAGE_COST_USD_CENTS, ageBandOf, colorearCountries, colorearLegalLocale, colorearPrice, formatPrice, isThemeId, isValidAge, paperFor, themeLabel, toUsdCents,
  addDays, type AgeBand, type BrandConfig, type ColorearLang, type CountryCode,
} from "@lumen/config";
import type { DeliveryProvider, Storage } from "@lumen/calls";
import type { Db, OrderRow } from "@lumen/db";
import { COLOREAR_REFUND_LINE, resolveAllColorearCheckboxes, COLOREAR_CHECKBOX_ORDER } from "@lumen/legal";
import { convertForProvider, type PaymentEvent, type PaymentProvider } from "@lumen/payments";
import { composeColorearMessage, type MailVars } from "./emails";
import { signLink, verifyLink } from "./link";
import { buildCharacterFromTextPrompt, buildCharacterPrompt, buildCoverPrompt, buildScenePrompt } from "./prompt";
import { inspectLineArt, normalizeLineArt } from "./qa";
import { assembleBook } from "./pdf";
import { sanitizePersonName, sanitizeShortText } from "./sanitize";
import { charPath, pagePath, pdfPath, photoPath, statePath, type GenState, type PageState } from "./state";
import { fillNames, fillVisual, joinNames, rolesOf, type StoryProvider } from "./story";
import { ImageProviderError, type GeneratedImage, type ImageProvider, type ImageQuality, type PersonInput, type RefImage } from "./types";

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
  persons: PersonInput[];
  photos: Uint8Array[];
  /** Free text (sanitized) or a catalog theme label. */
  theme?: string;
  themeId?: string;
  age: number | string;
  checkboxIds: string[];
  ip: string | null;
  creative?: string;
  device?: string;
}

export type ColorearErrors = Partial<Record<"email" | "country" | "persons" | "photos" | "theme" | "age" | "consent", string>>;

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

async function loadSharp(): Promise<(typeof import("sharp"))["default"] | null> {
  try {
    const mod = (await import("sharp")) as unknown as { default?: (typeof import("sharp"))["default"] };
    return (mod.default ?? (mod as unknown as (typeof import("sharp"))["default"]));
  } catch {
    return null;
  }
}

/** Re-encodes an uploaded photo: fixes orientation, strips metadata (EXIF/GPS), limits size. Returns null when it is not a valid image. */
export async function prepareUpload(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (!sniff(bytes)) return null;
  const sharp = await loadSharp();
  if (!sharp) return bytes;
  try {
    const out = await sharp(Buffer.from(bytes)).rotate().resize({ width: 1536, height: 1536, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
    return new Uint8Array(out);
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class ColorearEngine {
  constructor(readonly d: ColorearDeps) {}

  // ------------------------------------------------------------------ helpers

  private props(o: OrderRow): BaseProps {
    return { product: o.product, country: o.country, language: o.language, creative: o.creative, device: (o.device as BaseProps["device"]) ?? "unknown", order_id: o.id, test_mode: o.test_mode };
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
      for (const p of input.persons) {
        const n = sanitizePersonName(p.name);
        const r = sanitizeShortText(p.role, 40);
        if (!n.ok || !r.ok) {
          errors.persons = `Invalid person (${!n.ok ? `name:${n.reason}` : `role:${(r as { reason: string }).reason}`})`;
          break;
        }
        persons.push({ name: n.value, role: r.value });
      }
    }
    if (input.photos.length !== input.persons.length || input.photos.length < 1) errors.photos = "One photo per person";
    else if (input.photos.some((p) => p.byteLength > COLOREAR.maxPhotoBytes || !sniff(p))) errors.photos = "Invalid or too large photo";
    let theme = "";
    if (input.theme && input.theme.trim()) {
      const t = sanitizeShortText(input.theme, 50);
      if (!t.ok) errors.theme = `Invalid theme (${t.reason})`;
      else theme = t.value;
    }
    const age = Number(input.age);
    if (!isValidAge(age)) errors.age = "Age must be 3 to 8";
    const checked = new Set(input.checkboxIds);
    if (!COLOREAR_CHECKBOX_ORDER.every((id) => checked.has(id))) errors.consent = "All consent boxes are required";
    return { errors, persons, theme, age };
  }

  async createCheckout(input: ColorearCheckoutInput, urls: { successUrl: (o: OrderRow) => string; cancelUrl: string }): Promise<{ order: OrderRow; checkoutUrl: string }> {
    const v = this.validate(input);
    if (Object.keys(v.errors).length) {
      if (v.errors.theme || v.errors.persons) await this.d.tracker.track("content_blocked", { product: COLOREAR.slug, country: input.country, language: input.lang, creative: input.creative ?? "none", device: (input.device as BaseProps["device"]) ?? "unknown", stage: "input", reason: v.errors.theme ? "theme" : "person" });
      throw new ColorearValidationError(v.errors);
    }
    const prepared: Uint8Array[] = [];
    for (const p of input.photos) {
      const out = await prepareUpload(p);
      if (!out) throw new ColorearValidationError({ photos: "Unreadable photo" });
      prepared.push(out);
    }
    const now = this.d.now();
    const id = randomUUID();
    const price = colorearPrice(input.country);
    const lang = input.lang;
    const languageCode = lang === "en" ? "en" : input.country === "ES" ? "es-ES" : "es-419";
    const names = joinNames(v.persons.map((p) => p.name), lang);
    const details: OrderDetails = { v: 1, persons: v.persons, theme: v.theme, themeId: input.themeId && isThemeId(input.themeId) ? input.themeId : v.theme ? "custom" : "none", age: v.age, lang };
    for (let i = 0; i < prepared.length; i++) await this.d.uploads.put(photoPath(id, i + 1), prepared[i]!, "image/jpeg");
    const order = await this.d.db.orders.insert({
      id,
      access_token: token(),
      product: COLOREAR.slug,
      variant: "single",
      calls_included: 0,
      country: input.country,
      locale: colorearLegalLocale(input.country),
      language: languageCode,
      currency: price.currency,
      amount_minor: price.amountMinor,
      amount_usd_cents: toUsdCents(price.amountMinor, price.currency, this.d.env),
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
      payment_provider: null,
      checkout_id: null,
      payment_id: null,
      test_mode: this.d.payments.name === "mock" || this.d.env.TEST_MODE === "1",
      creative: input.creative ?? "none",
      device: input.device ?? "unknown",
      paid_at: null,
      delivered_at: null,
      refunded_at: null,
      refund_reason: null,
      refund_amount_minor: null,
      purge_at: iso(addDays(now, COLOREAR.retentionDays + 1)),
      pii_purged_at: null,
    });
    const charge = convertForProvider(this.d.payments, order.amount_minor, order.currency as never, this.d.env);
    const session = await this.d.payments.createCheckout({
      orderId: order.id,
      productSlug: COLOREAR.slug,
      variant: "single",
      country: order.country,
      productName: `${this.d.brand.brand} - ${COLOREAR.slug}`,
      amountMinor: charge.amountMinor,
      currency: charge.currency,
      customerEmail: order.email!,
      successUrl: urls.successUrl(order),
      cancelUrl: urls.cancelUrl,
      testMode: order.test_mode,
    });
    const updated = await this.d.db.orders.update(order.id, { checkout_id: session.checkoutId, payment_provider: session.provider });
    const base = this.props(updated);
    const resolved = resolveAllColorearCheckboxes(lang === "en" ? "en" : input.country === "ES" ? "es-ES" : "es-419", this.legalVars());
    await this.d.tracker.track("consent_given", { ...base, checkbox_ids: [...COLOREAR_CHECKBOX_ORDER], text_version_ids: resolved.map((c) => c.textVersionId) });
    await this.d.tracker.track("checkout_started", { ...base, variant: "single", amount_usd_cents: updated.amount_usd_cents, currency: updated.currency, payment_provider: session.provider });
    return { order: updated, checkoutUrl: session.url };
  }

  // ------------------------------------------------------------------ payment

  async handlePaymentEvent(event: PaymentEvent): Promise<OrderRow | null> {
    if (event.type === "payment_succeeded") return this.confirmPayment(event);
    if (event.type === "refunded") {
      const o = await this.findOrder(event.orderId, event.checkoutId);
      if (o && o.status !== "refunded") await this.markRefunded(o, "provider_refund", false, false);
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
    const now = this.d.now();
    const draft = order.consent_draft;
    if (!draft) throw new Error(`Order ${order.id} has no consent draft`);
    const lang = (this.details(order)?.lang ?? "es") === "en" ? "en" : order.country === "ES" ? "es-ES" : "es-419";
    for (const c of resolveAllColorearCheckboxes(lang, this.legalVars())) {
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
    await this.d.tracker.track("paid", { ...this.props(paid), variant: "single", amount_usd_cents: paid.amount_usd_cents, currency: paid.currency, payment_provider: paid.payment_provider ?? this.d.payments.name });
    await this.sendMail("receipt", paid);
    return paid;
  }

  private async hashEmail(email: string): Promise<string> {
    const { createHmac } = await import("node:crypto");
    return createHmac("sha256", this.d.env.PHONE_HASH_SALT ?? "dev-only-salt-change-me").update(email).digest("hex");
  }

  // ------------------------------------------------------------------ mail

  private mailVars(o: OrderRow): MailVars {
    const det = this.details(o);
    const lang = det?.lang ?? "es";
    const base = this.d.brand.domain.replace(/\/$/, "");
    return {
      names: o.child_first_name ?? "",
      price: formatPrice(o.amount_minor, o.currency as never, COUNTRIES[o.country].priceFormatLocale),
      statusLink: `${base}/colorear/confirmacion/${o.access_token}`,
      deliveryLink: `${base}/colorear/entrega/${o.access_token}`,
      refundLink: `${base}/colorear/reembolso/${o.access_token}`,
      deleteDate: o.purge_at ? iso(new Date(o.purge_at)).slice(0, 10) : "",
      holder: this.d.brand.holder,
      privacyEmail: this.d.brand.privacyEmail,
      supportEmail: this.d.brand.supportEmail,
      brand: this.d.brand.brand,
      notes: [],
      ...(lang ? {} : {}),
    };
  }

  private async sendMail(kind: "receipt" | "delivery" | "refund", o: OrderRow, notes: string[] = []): Promise<boolean> {
    if (!o.email) return false;
    const det = this.details(o);
    const msg = composeColorearMessage(kind, det?.lang ?? "es", o.email, { ...this.mailVars(o), notes });
    const res = await this.d.delivery.send(msg);
    await this.d.db.deliveries.insert({
      order_id: o.id,
      kind,
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

  /** Mock payments + a real provider could burn money on fake orders: a small daily cap, or an allow-listed email, keeps it safe. */
  private async imageFor(order: OrderRow): Promise<ImageProvider> {
    const real = this.d.image;
    if (real.name === "mock" || this.d.payments.name !== "mock") return real;
    const allow = (this.d.env.COLOREAR_TEST_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (order.email && allow.includes(order.email.toLowerCase())) return real;
    const cap = Number(this.d.env.COLOREAR_MOCK_REAL_DAILY_CAP ?? 5);
    const dayStart = new Date(this.d.now());
    dayStart.setUTCHours(0, 0, 0, 0);
    const today = await this.d.db.orders.find({ product: COLOREAR.slug, test_mode: true, paid_at: { gte: iso(dayStart) } });
    const sorted = today.sort((a, b) => (a.paid_at! < b.paid_at! ? -1 : a.paid_at! > b.paid_at! ? 1 : a.id < b.id ? -1 : 1));
    const index = sorted.findIndex((o) => o.id === order.id) + 1;
    return index >= 1 && index <= (Number.isFinite(cap) ? cap : 5) ? real : this.d.mockImage;
  }

  private async initState(order: OrderRow, det: OrderDetails): Promise<GenState> {
    const image = await this.imageFor(order);
    const now = iso(this.d.now());
    const pages: PageState[] = Array.from({ length: COLOREAR.scenes + 1 }, (_, n) => ({ n, status: "pending", attempts: 0 }));
    const state: GenState = {
      v: 1,
      stage: "queued",
      provider: image.name,
      model: image.model,
      quality: this.imageQuality(),
      startedAt: now,
      updatedAt: now,
      lease: null,
      costCents: 0,
      calls: 0,
      retries: 0,
      characters: det.persons.map((_, i) => ({ k: i + 1, status: "pending", attempts: 0 })),
      story: null,
      pages,
      notes: [],
      effectiveProvider: image.name,
    };
    await this.putState(order.id, state);
    await this.d.tracker.track("generation_started", { ...this.props(order), pages_total: COLOREAR.pagesTotal, provider: image.name, model: image.model, quality: state.quality, age_band: ageBandOf(det.age), persons: det.persons.length, theme: det.themeId });
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

  async runGeneration(orderId: string, opts: { budgetMs?: number; concurrency?: number } = {}): Promise<RunResult> {
    const startedAt = Date.now();
    const budgetMs = opts.budgetMs ?? Number(this.d.env.COLOREAR_RUN_BUDGET_MS ?? 230_000);
    const concurrency = opts.concurrency ?? 4;
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
    const roles = rolesOf(det.persons);
    const names = det.persons.map((p) => p.name);
    const quality = (state.quality as ImageQuality) ?? "medium";
    const cap = this.costCapCents();

    const render = async (label: string, req: Parameters<ImageProvider["render"]>[0], inspect: { emptyTop?: number }, counter: { attempts: number }): Promise<{ img: GeneratedImage; bytes: Uint8Array; ext: "png" | "svg"; fallback: boolean }> => {
      let lastReason = "";
      for (let attempt = 0; attempt < 3; attempt++) {
        if (remaining() < 5000) throw new BudgetError();
        if (state.costCents > cap) throw new FatalGenError("cost_cap");
        counter.attempts++;
        try {
          state.calls++;
          const img = await image.render(req);
          state.costCents += img.costUsdCents;
          if (img.format === "svg") return { img, bytes: img.bytes, ext: "svg", fallback: false };
          const norm = await normalizeLineArt(img.bytes);
          const rep = await inspectLineArt(norm, inspect);
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
            }
          } else lastReason = "unknown";
        }
        state.retries++;
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
          const photo = await this.d.uploads.get(photoPath(orderId, c.k));
          let result: Awaited<ReturnType<typeof render>> | null = null;
          if (photo) {
            const mime = (photo.contentType.includes("png") ? "image/png" : "image/jpeg") as RefImage["mime"];
            try {
              result = await render(`char${c.k}`, { prompt: buildCharacterPrompt(role, band), width: 1024, height: 1024, quality, refs: [{ bytes: photo.bytes, mime }], kind: "character", ageBand: band, hints: { roles: [role], setting: "", seed: c.k } }, {}, c);
            } catch (err) {
              if (!(err instanceof ModerationError)) throw err;
            }
          }
          if (!result) {
            // photo missing or refused: draw the person from the description alone
            c.status = "text_fallback";
            state.notes.push(`photo_${c.k}_text`);
            result = await render(`char${c.k}t`, { prompt: buildCharacterFromTextPrompt(role, band), width: 1024, height: 1024, quality, refs: [], kind: "character", ageBand: band, hints: { roles: [role], setting: "", seed: c.k } }, {}, c).catch(async (err) => {
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
          for (const c of state.characters) await this.d.uploads.delete(photoPath(orderId, c.k));
          state.photosDeletedAt = iso(this.d.now());
          await this.d.tracker.track("photos_deleted", { ...this.props(order), count: state.characters.length, reason: "characters_ready" });
          await save();
        }
      }

      // ---------------- stage 2: story
      if (!state.story) {
        state.stage = "story";
        await save();
        state.story = await this.d.story.write({ roles, lang: det.lang, band, theme: det.theme });
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
            result = await render(`page${p.n}`, req, { emptyTop: 0 }, p);
          } catch (err) {
            if (!(err instanceof ModerationError)) throw err;
            // refused: ask again with a plain, safe description of the same scene
            result = await render(`page${p.n}s`, { ...req, prompt: isCover ? buildCoverPrompt("the cartoon characters smiling together outdoors", band, refs.length) : buildScenePrompt("the cartoon characters smiling and playing together outdoors", band, refs.length) }, { emptyTop: 0 }, p).catch(async (e2) => {
              if (!(e2 instanceof ModerationError)) throw e2;
              const fb = await this.d.mockImage.render(req);
              return { img: fb, bytes: fb.bytes, ext: "svg" as const, fallback: true };
            });
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
      // intermediate files are no longer needed
      for (const c of state.characters) await this.d.storage.delete(charPath(orderId, c.k, c.ext ?? "png"));
      for (const p of state.pages) await this.d.storage.delete(pagePath(orderId, p.n, p.ext ?? "png"));
      await save();
      await this.d.tracker.track("generation_completed", {
        ...this.props(completed),
        provider: state.provider,
        images_generated: state.calls,
        retries: state.retries,
        image_cost_usd_cents: Math.round(state.costCents * 100) / 100,
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

  // ------------------------------------------------------------------ refunds and cleanup

  private async deleteFiles(orderId: string, state: GenState | null): Promise<void> {
    const det = state;
    await this.d.storage.delete(pdfPath(orderId)).catch(() => undefined);
    for (let k = 1; k <= COLOREAR.maxPhotos; k++) {
      await this.d.uploads.delete(photoPath(orderId, k)).catch(() => undefined);
      for (const ext of ["png", "svg"]) await this.d.storage.delete(charPath(orderId, k, ext)).catch(() => undefined);
    }
    for (let n = 0; n <= COLOREAR.scenes; n++) for (const ext of ["png", "svg"]) await this.d.storage.delete(pagePath(orderId, n, ext)).catch(() => undefined);
    void det;
  }

  async markRefunded(order: OrderRow, reason: string, automatic: boolean, callProvider = true): Promise<{ refunded: boolean; reason?: string }> {
    if (order.status === "refunded") return { refunded: true, reason: "already_refunded" };
    if (!order.payment_id) {
      await this.d.db.orders.update(order.id, { status: "cancelled" });
      await this.deleteFiles(order.id, null);
      return { refunded: false, reason: "not_paid" };
    }
    if (callProvider) await this.d.payments.refund({ paymentId: order.payment_id, currency: order.currency as never, reason });
    const now = this.d.now();
    await this.deleteFiles(order.id, null);
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
    if (this.d.now().getTime() > base + COLOREAR.refundWindowDays * 86_400_000) return { refunded: false, reason: "outside_window" };
    return this.markRefunded(order, "customer_request", false);
  }

  /** Cron/sweeper: resumes stalled books, refunds books that could not be made in time, erases stray photos and expired books. */
  async sweep(opts: { maxRuns?: number } = {}): Promise<{ resumed: number; refunded: number; photosErased: number; purged: number }> {
    const out = { resumed: 0, refunded: 0, photosErased: 0, purged: 0 };
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
        await this.runGeneration(o.id);
      }
    }
    // photos of unpaid or abandoned orders: gone after 2 h unpaid, 24 h otherwise
    const created = await this.d.db.orders.find({ product: COLOREAR.slug, status: { in: ["created", "paid"] } });
    for (const o of created) {
      if (o.pii_purged_at) continue;
      const age = now.getTime() - new Date(o.created_at).getTime();
      const limit = o.status === "created" ? 2 * 3600_000 : COLOREAR.photoMaxHours * 3600_000;
      if (age > limit) {
        for (let k = 1; k <= COLOREAR.maxPhotos; k++) await this.d.uploads.delete(photoPath(o.id, k));
        await this.d.tracker.track("photos_deleted", { ...this.props(o), count: COLOREAR.maxPhotos, reason: o.status === "created" ? "unpaid" : "retention" });
        out.photosErased++;
        if (o.status === "created") await this.d.db.orders.update(o.id, { status: "cancelled", purge_at: iso(now) });
      }
    }
    // expired books
    const due = await this.d.db.orders.find({ product: COLOREAR.slug, purge_at: { lte: iso(now) } });
    for (const o of due) {
      if (o.status === "purged" && o.pii_purged_at) continue;
      await this.deleteFiles(o.id, null);
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
    const base = { lang, names: order.pii_purged_at ? "" : order.child_first_name ?? "", country: order.country, testMode: order.test_mode };
    if (order.pii_purged_at || order.status === "purged") return { ...base, phase: "gone", progress: 1, stage: "gone", characters: [], pages: [], notes: [], expiresAt: null, hasPdf: false };
    if (order.status === "refunded") return { ...base, phase: "refunded", progress: 0, stage: "refunded", characters: [], pages: [], notes: [], expiresAt: null, hasPdf: false };
    if (order.status === "created") return { ...base, phase: "awaiting_payment", progress: 0, stage: "created", characters: [], pages: [], notes: [], expiresAt: null, hasPdf: false };
    if (order.status === "cancelled") return { ...base, phase: "gone", progress: 0, stage: "cancelled", characters: [], pages: [], notes: [], expiresAt: null, hasPdf: false };
    const st = await this.getState(order.id);
    const total = (det?.persons.length ?? 1) + 1 + COLOREAR.scenes + 1;
    const doneUnits = st ? st.characters.filter((c) => c.status !== "pending").length + (st.story ? 1 : 0) + st.pages.filter((p) => p.status !== "pending").length : 0;
    const ready = order.status === "delivered" || (order.status === "completed" && st?.stage === "done");
    return {
      ...base,
      phase: ready ? "ready" : st?.stage === "failed" ? "failed" : "working",
      progress: ready ? 1 : Math.min(0.97, doneUnits / total),
      stage: st?.stage ?? "queued",
      characters: st ? st.characters.filter((c) => c.status !== "pending").map((c) => c.k) : [],
      pages: st ? st.pages.filter((p) => p.status !== "pending").map((p) => p.n) : [],
      notes: st?.notes ?? [],
      expiresAt: order.purge_at,
      hasPdf: ready,
    };
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
    const price = IMAGE_COST_USD_CENTS[/mini/.test(model) ? "openai-mini" : "openai"][quality];
    return price * (persons + COLOREAR.scenes + 1);
  }
}

export interface ColorearStatus {
  phase: "awaiting_payment" | "working" | "ready" | "failed" | "refunded" | "gone";
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
