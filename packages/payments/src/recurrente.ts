import { PaymentConfigError } from "./types";
import type { CheckoutRequest, CheckoutSession, PaymentEvent, PaymentProvider, RefundRequest } from "./types";
import { verifyStandardWebhook } from "./standard-webhooks";

/**
 * Recurrente (Guatemala; not a merchant of record). Charges in USD or GTQ only, so the checkout service converts
 * EUR/GBP/MXN prices to USD before calling it (see convertForProvider). Needs RECURRENTE_PUBLIC_KEY,
 * RECURRENTE_SECRET_KEY and RECURRENTE_WEBHOOK_SECRET (the endpoint's Svix signing secret, "whsec_...").
 *
 * Written against docs.recurrente.com as of 2026-10-28:
 * - POST /api/checkouts with inline items -> { id: "ch_...", checkout_url }. We pass metadata.order_id and keep
 *   checkout.id on the order, so the webhook can be matched either way.
 * - Webhooks use the unified format: event_type "intent.succeeded" | "intent.failed" | "intent.canceled", top-level
 *   id "in_..." (the intent), checkout { id, status, metadata }. Legacy per-method events ("payment_intent.*",
 *   id "pa_...") are still accepted for accounts created before the unified format.
 * - Signature: Svix headers (svix-id, svix-timestamp, svix-signature) over "${id}.${timestamp}.${body}", HMAC-SHA256
 *   with the base64-decoded part of the whsec_ secret.
 * - POST /api/refunds { intent_id | payment_intent_id, amount_in_cents? } with an Idempotency-Key header. Partial refunds
 *   depend on the card processor behind the account; when unsupported the API rejects and the caller falls back to
 *   "full or nothing" (D26).
 * - Unverified accounts are capped at $50 cumulative in USD (422 amount_exceeds_unverified_limit).
 */
export interface RecurrenteConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
}

/** Checkouts expire after this many minutes; the unpaid-order sweep in the engine runs at 2 h, so keep this below it. */
const CHECKOUT_TTL_MINUTES = 90;

interface RecurrenteIntentEvent {
  event_type?: string;
  type?: string;
  id?: string;
  legacy_id?: string;
  live_mode?: boolean;
  checkout?: { id?: string; status?: string; metadata?: Record<string, string | number | boolean> } | null;
  metadata?: Record<string, string | number | boolean> | null;
}

export class RecurrentePaymentProvider implements PaymentProvider {
  readonly name = "recurrente" as const;
  readonly supportedCurrencies = ["USD"] as ("USD")[];
  readonly walletMethods = [] as const;
  private readonly base = "https://app.recurrente.com/api";

  constructor(private readonly cfg: RecurrenteConfig, private readonly fetchFn: typeof fetch = fetch, private readonly now: () => Date = () => new Date()) {}

  static fromEnv(env: Record<string, string | undefined>): RecurrentePaymentProvider {
    if (!env.RECURRENTE_PUBLIC_KEY || !env.RECURRENTE_SECRET_KEY || !env.RECURRENTE_WEBHOOK_SECRET) {
      throw new PaymentConfigError("RECURRENTE_PUBLIC_KEY, RECURRENTE_SECRET_KEY and RECURRENTE_WEBHOOK_SECRET are required");
    }
    return new RecurrentePaymentProvider({ publicKey: env.RECURRENTE_PUBLIC_KEY, secretKey: env.RECURRENTE_SECRET_KEY, webhookSecret: env.RECURRENTE_WEBHOOK_SECRET });
  }

  /** True when the configured keys are sandbox/test keys (sk_test_...): the dashboard's Sandbox, no real money. */
  get testKeys(): boolean {
    return this.cfg.secretKey.startsWith("sk_test_");
  }

  get sandbox(): boolean {
    return this.testKeys;
  }

  private headers(extra: Record<string, string> = {}) {
    return { "X-PUBLIC-KEY": this.cfg.publicKey, "X-SECRET-KEY": this.cfg.secretKey, "content-type": "application/json", ...extra };
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    if (req.currency !== "USD") throw new PaymentConfigError("Recurrente adapter charges USD only; convert first");
    if (req.amountMinor < 100) throw new PaymentConfigError("Recurrente requires at least 100 cents (USD 1.00) per checkout");
    const expiresAt = new Date(this.now().getTime() + CHECKOUT_TTL_MINUTES * 60_000).toISOString();
    const res = await this.fetchFn(`${this.base}/checkouts`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        items: [
          {
            name: req.productName,
            currency: "USD",
            amount_in_cents: req.amountMinor,
            quantity: 1,
            charge_type: "one_time",
            // Cards only: bank transfer and cash are Guatemala-local methods and would confuse buyers abroad.
            payment_method_types: ["card"],
            available_installments: [],
            tax_category: "good",
          },
        ],
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
        expires_at: expiresAt,
        metadata: { order_id: req.orderId, product: req.productSlug, variant: req.variant, country: req.country, test_mode: req.testMode },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 422 && /amount_exceeds_unverified_limit/.test(text)) {
        throw new Error("Recurrente createCheckout 422: the account is not verified yet (USD 50 cumulative cap). Finish account verification in the Recurrente dashboard.");
      }
      throw new Error(`Recurrente createCheckout ${res.status}: ${text}`);
    }
    const j = (await res.json()) as { id: string; checkout_url: string };
    if (!j.id || !j.checkout_url) throw new Error("Recurrente createCheckout: response without id/checkout_url");
    return { provider: this.name, checkoutId: j.id, url: j.checkout_url };
  }

  async parseWebhook(rawBody: string, headers: Record<string, string | undefined>): Promise<PaymentEvent | null> {
    const secret = this.cfg.webhookSecret.replace(/^whsec_/, "");
    const ok = verifyStandardWebhook({
      key: Buffer.from(secret, "base64"),
      id: headers["svix-id"],
      timestamp: headers["svix-timestamp"],
      signatureHeader: headers["svix-signature"],
      body: rawBody,
    });
    if (!ok) throw new Error("Recurrente webhook signature invalid");
    const ev = JSON.parse(rawBody) as RecurrenteIntentEvent;
    // Unified events carry the name in event_type and the payment method in type; legacy events only have type.
    const type = ev.event_type ?? ev.type ?? "";
    const meta = ev.checkout?.metadata ?? ev.metadata ?? null;
    const rawOrderId = meta?.order_id;
    const orderId = typeof rawOrderId === "string" && rawOrderId ? rawOrderId : null;
    const checkoutId = ev.checkout?.id ?? null;
    const succeeded = type === "intent.succeeded" || type === "payment_intent.succeeded";
    const failed = type === "intent.failed" || type === "intent.canceled" || type === "payment_intent.failed";
    if (succeeded) {
      if (!ev.id) throw new Error("Recurrente webhook: succeeded event without id");
      return { type: "payment_succeeded", orderId, checkoutId, paymentId: ev.id };
    }
    if (failed) return { type: "payment_failed", orderId, checkoutId };
    return null;
  }

  async refund(req: RefundRequest): Promise<{ refundId: string }> {
    // Unified intents are "in_..."; legacy payment ids are "pa_...". The refunds endpoint accepts either name.
    const body: Record<string, unknown> = req.paymentId.startsWith("pa_") ? { payment_intent_id: req.paymentId } : { intent_id: req.paymentId };
    if (req.amountMinor !== undefined) body.amount_in_cents = req.amountMinor;
    const idempotencyKey = `refund:${req.paymentId}:${req.amountMinor ?? "full"}`;
    const res = await this.fetchFn(`${this.base}/refunds`, {
      method: "POST",
      headers: this.headers({ "Idempotency-Key": idempotencyKey }),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Recurrente refund ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { id: string; status?: string; failure_reason?: string | null };
    if (j.status === "failed") throw new Error(`Recurrente refund failed: ${j.failure_reason ?? "unknown"}`);
    return { refundId: j.id };
  }
}
