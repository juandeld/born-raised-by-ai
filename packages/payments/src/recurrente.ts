import { PaymentConfigError } from "./types";
import type { CheckoutRequest, CheckoutSession, PaymentEvent, PaymentProvider, RefundRequest } from "./types";
import { verifyStandardWebhook } from "./standard-webhooks";

/**
 * Recurrente (Guatemala, plan B, not a merchant of record). Charges in USD or GTQ only, so the checkout service
 * converts EUR/GBP/MXN prices to USD before calling it (see convertForProvider). Needs RECURRENTE_PUBLIC_KEY,
 * RECURRENTE_SECRET_KEY, RECURRENTE_WEBHOOK_SECRET (Svix "whsec_..."). [no verificado: endpoints and payload shapes
 * written from public docs, untested without an account; see docs/arquitectura/pendientes-cuentas.md]
 */
export interface RecurrenteConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
}

export class RecurrentePaymentProvider implements PaymentProvider {
  readonly name = "recurrente" as const;
  readonly supportedCurrencies = ["USD"] as ("USD")[];
  readonly walletMethods = [] as const;
  private readonly base = "https://app.recurrente.com/api";

  constructor(private readonly cfg: RecurrenteConfig, private readonly fetchFn: typeof fetch = fetch) {}

  static fromEnv(env: Record<string, string | undefined>): RecurrentePaymentProvider {
    if (!env.RECURRENTE_PUBLIC_KEY || !env.RECURRENTE_SECRET_KEY || !env.RECURRENTE_WEBHOOK_SECRET) {
      throw new PaymentConfigError("RECURRENTE_PUBLIC_KEY, RECURRENTE_SECRET_KEY and RECURRENTE_WEBHOOK_SECRET are required");
    }
    return new RecurrentePaymentProvider({ publicKey: env.RECURRENTE_PUBLIC_KEY, secretKey: env.RECURRENTE_SECRET_KEY, webhookSecret: env.RECURRENTE_WEBHOOK_SECRET });
  }

  private headers() {
    return { "X-PUBLIC-KEY": this.cfg.publicKey, "X-SECRET-KEY": this.cfg.secretKey, "content-type": "application/json" };
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    if (req.currency !== "USD") throw new PaymentConfigError("Recurrente adapter charges USD only; convert first");
    const res = await this.fetchFn(`${this.base}/checkouts`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        items: [{ name: req.productName, currency: "USD", amount_in_cents: req.amountMinor, quantity: 1 }],
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
        metadata: { order_id: req.orderId },
      }),
    });
    if (!res.ok) throw new Error(`Recurrente createCheckout ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { id: string; checkout_url: string };
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
    const ev = JSON.parse(rawBody) as { event_type?: string; type?: string; id?: string; checkout?: { id?: string }; metadata?: Record<string, string> };
    const type = ev.event_type ?? ev.type;
    const orderId = ev.metadata?.order_id ?? null;
    const checkoutId = ev.checkout?.id ?? null;
    if (type === "payment_intent.succeeded" && ev.id) return { type: "payment_succeeded", orderId, checkoutId, paymentId: ev.id };
    if (type === "payment_intent.failed") return { type: "payment_failed", orderId, checkoutId };
    return null;
  }

  async refund(req: RefundRequest): Promise<{ refundId: string }> {
    const res = await this.fetchFn(`${this.base}/refunds`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ payment_intent_id: req.paymentId }),
    });
    if (!res.ok) throw new Error(`Recurrente refund ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { id: string };
    return { refundId: j.id };
  }
}
