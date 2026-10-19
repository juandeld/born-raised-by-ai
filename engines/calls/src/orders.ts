import { COUNTRIES, DAY_MS, LOCALE_SLUG, RETENTION_DAYS, addDays, enabledCountries, formatPrice, priceFor, toUsdCents, type CountryCode, type Variant } from "@lumen/config";
import type { Locale } from "@lumen/config";
import type { OrderRow } from "@lumen/db";
import { CHECKBOX_ORDER, resolveCheckbox, type CheckboxId } from "@lumen/legal";
import { convertForProvider, type PaymentEvent } from "@lumen/payments";
import type { EngineDeps } from "./deps";
import { composeMessage } from "./emails";
import { sanitizeChildAge, sanitizeChildName, sanitizeOptionalField } from "./guardrails/sanitize";
import { isValidTimezone } from "./window";
import { baseProps, formatLocal, hashPhone, iso, localToUtc, randomToken } from "./util";
import type { Language } from "./types";


export interface CheckoutInput {
  language: Locale;
  country: CountryCode;
  variant: Variant;
  email: string;
  phone: string;
  childName: string;
  childAge?: string | number | null;
  details?: string | null;
  /** Local date YYYY-MM-DD of the call. */
  date: string;
  /** Local start hour of the 2-hour window (8..19). */
  windowStartHour: number;
  timezone: string;
  checkboxIds: string[];
  ip: string | null;
  creative?: string;
  device?: string;
}

export type FieldErrors = Partial<Record<"email" | "phone" | "childName" | "childAge" | "details" | "date" | "window" | "timezone" | "consent" | "country" | "variant", string>>;

export class ValidationError extends Error {
  constructor(readonly errors: FieldErrors) {
    super(`Invalid checkout: ${Object.keys(errors).join(", ")}`);
  }
}

export const WINDOW_HOURS = 2;
export const MIN_START_HOUR = 8;
export const MAX_START_HOUR = 19; // 19:00-21:00 is the last allowed slot
const MAX_DAYS_AHEAD = 90;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

export function legalVars(d: EngineDeps): Record<string, string> {
  return { MARCA: d.brand.brand, TITULAR: d.brand.holder, EMAIL_PRIVACIDAD: d.brand.privacyEmail, EMAIL_SOPORTE: d.brand.supportEmail, DOMINIO: d.brand.domain };
}

export class OrderService {
  constructor(private readonly d: EngineDeps) {}

  /** Validates, sanitizes and builds the order row. Pure apart from the clock. */
  validate(input: CheckoutInput): { row: Omit<OrderRow, "id" | "access_token" | "created_at">; errors: FieldErrors } {
    const errors: FieldErrors = {};
    const now = this.d.now();
    if (!enabledCountries(this.d.env).includes(input.country)) errors.country = "Country not open for sale";
    if (input.variant !== "single" && input.variant !== "bundle") errors.variant = "Invalid variant";
    const country = COUNTRIES[input.country];

    if (!EMAIL_RE.test(input.email.trim())) errors.email = "Invalid email";
    const phone = normalizePhone(input.phone);
    // Test mode (mock payments or TEST_MODE=1) accepts any E.164 number so the owner can test from a country not yet open (e.g. +502).
    const testMode = this.d.payments.name === "mock" || this.d.env.TEST_MODE === "1";
    const countryMatch = testMode || phone.startsWith(`+${country?.callingCode ?? "0"}`);
    if (!/^\+\d{8,15}$/.test(phone) || !countryMatch) errors.phone = `Phone must be in international format starting with +${country?.callingCode}`;

    const name = sanitizeChildName(input.childName);
    if (!name.ok) errors.childName = name.reason;
    const age = sanitizeChildAge(input.childAge ?? null);
    if (input.childAge !== undefined && input.childAge !== null && input.childAge !== "" && age === null) errors.childAge = "Age must be 1-17";
    let details: string | null = null;
    if (input.details && input.details.trim()) {
      const r = sanitizeOptionalField(input.details);
      if (!r.ok) errors.details = r.reason;
      else details = r.value;
    }

    if (!isValidTimezone(input.timezone)) errors.timezone = "Invalid timezone";
    let windowStart = now;
    let windowEnd = now;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.date = "Invalid date";
    else if (!Number.isInteger(input.windowStartHour) || input.windowStartHour < MIN_START_HOUR || input.windowStartHour > MAX_START_HOUR) errors.window = "Invalid window";
    else if (!errors.timezone) {
      windowStart = localToUtc(input.date, input.windowStartHour, input.timezone);
      windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 3600_000);
      if (windowEnd.getTime() < now.getTime() + 20 * 60_000) errors.window = "Window already closed or closing too soon";
      if (windowStart.getTime() > now.getTime() + MAX_DAYS_AHEAD * DAY_MS) errors.date = "Too far ahead";
    }

    // All six boxes are required for a call to a child. The server never trusts the browser: it recomputes the texts.
    const checked = new Set(input.checkboxIds);
    if (!CHECKBOX_ORDER.every((id) => checked.has(id))) errors.consent = "All consent boxes are required";

    const price = priceFor(input.country, input.variant);
    const row: Omit<OrderRow, "id" | "access_token" | "created_at"> = {
      product: this.d.product.slug,
      variant: input.variant,
      calls_included: input.variant === "bundle" ? 2 : 1,
      country: input.country,
      locale: country?.preludeLocale ?? "en-US",
      language: input.language,
      currency: price.currency,
      amount_minor: price.amountMinor,
      amount_usd_cents: toUsdCents(price.amountMinor, price.currency, this.d.env),
      status: "created",
      email: input.email.trim().toLowerCase(),
      phone_e164: phone,
      phone_e164_hash: hashPhone(phone, this.d.env),
      child_first_name: name.ok ? name.value : null,
      child_age: age,
      details,
      consent_draft: { checkbox_ids: [...checked], accepted_at: iso(now), ip: input.ip },
      timezone: input.timezone,
      window_start: iso(windowStart),
      window_end: iso(windowEnd),
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
      purge_at: iso(addDays(windowEnd, RETENTION_DAYS.order)),
      pii_purged_at: null,
    };
    return { row, errors };
  }

  /** Creates the order and the payment session. Returns the URL to send the buyer to. */
  async createCheckout(input: CheckoutInput, urls: { successUrl: (order: OrderRow) => string; cancelUrl: string }): Promise<{ order: OrderRow; checkoutUrl: string }> {
    const { row, errors } = this.validate(input);
    if (Object.keys(errors).length) throw new ValidationError(errors);
    const order = await this.d.db.orders.insert({ ...row, access_token: randomToken() });
    const charge = convertForProvider(this.d.payments, order.amount_minor, order.currency as never, this.d.env);
    const session = await this.d.payments.createCheckout({
      orderId: order.id,
      productSlug: order.product,
      variant: order.variant,
      country: order.country,
      productName: `${this.d.brand.brand} - ${order.product}`,
      amountMinor: charge.amountMinor,
      currency: charge.currency,
      customerEmail: order.email!,
      successUrl: urls.successUrl(order),
      cancelUrl: urls.cancelUrl,
      testMode: order.test_mode,
    });
    const updated = await this.d.db.orders.update(order.id, { checkout_id: session.checkoutId, payment_provider: session.provider });
    const props = baseProps(updated);
    await this.d.tracker.track("consent_given", { ...props, checkbox_ids: [...CHECKBOX_ORDER], text_version_ids: this.resolveConsents(updated).map((c) => c.textVersionId) });
    await this.d.tracker.track("checkout_started", { ...props, variant: updated.variant, amount_usd_cents: updated.amount_usd_cents, currency: updated.currency, payment_provider: session.provider });
    return { order: updated, checkoutUrl: session.url };
  }

  private resolveConsents(order: OrderRow) {
    const vars = legalVars(this.d);
    return CHECKBOX_ORDER.map((id) => resolveCheckbox(id as CheckboxId, order.locale as never, vars));
  }

  /**
   * Payment confirmed (webhook). Idempotent. Writes the consent records (server time of acceptance, IP, exact text id and hash),
   * schedules the call and sends the receipt. If the payment is later refunded before the call, the call is cancelled.
   */
  async confirmPayment(event: PaymentEvent): Promise<OrderRow | null> {
    if (event.type !== "payment_succeeded") return null;
    let order: OrderRow | null = event.orderId ? await this.d.db.orders.get(event.orderId) : null;
    if (!order && event.checkoutId) order = (await this.d.db.orders.find({ checkout_id: event.checkoutId }, { limit: 1 }))[0] ?? null;
    if (!order) return null;
    if (order.status !== "created") return order; // duplicate webhook

    const now = this.d.now();
    const draft = order.consent_draft;
    if (!draft) throw new Error(`Order ${order.id} has no consent draft`);
    for (const c of this.resolveConsents(order)) {
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
        phone_e164_hash: order.phone_e164_hash!,
        window_start: order.window_start,
        window_end: order.window_end,
        product_slug: order.product,
        purge_at: iso(addDays(now, RETENTION_DAYS.consent)),
      });
    }
    const paid = await this.d.db.orders.update(order.id, { status: "paid", payment_id: event.paymentId, paid_at: iso(now), consent_draft: null });
    await this.d.tracker.track("paid", { ...baseProps(paid), variant: paid.variant, amount_usd_cents: paid.amount_usd_cents, currency: paid.currency, payment_provider: paid.payment_provider ?? this.d.payments.name });
    await this.sendReceipt(paid);
    return this.scheduleOrder(paid);
  }

  async scheduleOrder(order: OrderRow): Promise<OrderRow> {
    const scheduled = await this.d.db.orders.update(order.id, { status: "scheduled" });
    await this.d.tracker.track("call_scheduled", { ...baseProps(scheduled), window_start_utc: scheduled.window_start, window_end_utc: scheduled.window_end });
    await this.sendReminder(scheduled);
    await this.d.dispatcher.send("order/scheduled", { orderId: scheduled.id, windowStart: scheduled.window_start });
    return scheduled;
  }

  private mailVars(order: OrderRow) {
    const country = COUNTRIES[order.country];
    const base = this.d.brand.domain;
    const lang = LOCALE_SLUG[order.language as Locale] ?? "es";
    const deleteDate = order.purge_at ? new Date(order.purge_at).toISOString().slice(0, 10) : "";
    return {
      childName: order.child_first_name ?? "",
      price: formatPrice(order.amount_minor, order.currency as never, country.priceFormatLocale),
      deleteDate,
      dataLink: `${base}/${lang}/entrega/${order.access_token}`,
      refundLink: `${base}/${lang}/reembolso/${order.access_token}`,
      optOutLink: `${base}/${lang}/baja/${order.access_token}`,
      callTimeLocal: `${formatLocal(new Date(order.window_start), order.timezone, country.priceFormatLocale)} - ${new Intl.DateTimeFormat(country.priceFormatLocale, { timeZone: order.timezone, timeStyle: "short" }).format(new Date(order.window_end))}`,
      holder: this.d.brand.holder,
      privacyEmail: this.d.brand.privacyEmail,
      supportEmail: this.d.brand.supportEmail,
      brand: this.d.brand.brand,
    };
  }

  private async sendReceipt(order: OrderRow): Promise<void> {
    if (!order.email) return;
    const res = await this.d.delivery.send(composeMessage("receipt", order.language as Language, order.email, this.mailVars(order)));
    await this.logMessage(order, "receipt", res);
  }

  private async sendReminder(order: OrderRow): Promise<void> {
    if (!order.email) return;
    const res = await this.d.delivery.send(composeMessage("reminder", order.language as Language, order.email, this.mailVars(order)));
    await this.logMessage(order, "reminder", res);
  }

  private async logMessage(order: OrderRow, kind: string, res: { channel: "email" | "whatsapp" | "web"; status: "sent" | "failed" | "stub"; provider: string; providerId: string | null }) {
    await this.d.db.deliveries.insert({
      order_id: order.id,
      kind,
      channel: res.channel,
      status: res.status,
      provider: res.provider,
      provider_id: res.providerId,
      mp3_path: null,
      pdf_path: null,
      link_expires_at: null,
      survey_answer: null,
      survey_at: null,
      purge_at: iso(addDays(this.d.now(), RETENTION_DAYS.deliveryLog)),
    });
  }

  /** Opt-out by email link: suppress the number, cancel the call and refund. */
  async optOutByLink(accessToken: string): Promise<OrderRow | null> {
    const order = (await this.d.db.orders.find({ access_token: accessToken }, { limit: 1 }))[0];
    if (!order || !order.phone_e164_hash) return null;
    const existing = await this.d.db.suppression.get(order.phone_e164_hash);
    if (!existing) await this.d.db.suppression.insert({ phone_e164_hash: order.phone_e164_hash, source: "email" });
    await this.d.tracker.track("opted_out", { ...baseProps(order), source: "email" });
    return order;
  }
}
