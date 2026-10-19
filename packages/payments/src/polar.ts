import { PaymentConfigError } from "./types";
import type { CheckoutRequest, CheckoutSession, PaymentEvent, PaymentProvider, RefundRequest } from "./types";
import { verifyStandardWebhook } from "./standard-webhooks";

/**
 * Polar (merchant of record). Real adapter over fetch; needs POLAR_ACCESS_TOKEN, POLAR_WEBHOOK_SECRET and
 * POLAR_PRODUCT_MAP (JSON {"santa:MX:single":"<product uuid>", ...}) because each country/variant is a Polar
 * product with its own price. [no verificado: cannot be tested without an account; see docs/arquitectura/pendientes-cuentas.md]
 */
export interface PolarConfig {
  accessToken: string;
  webhookSecret: string;
  productMap: Record<string, string>;
  server: "sandbox" | "production";
}

export class PolarPaymentProvider implements PaymentProvider {
  readonly name = "polar" as const;
  readonly supportedCurrencies = "any" as const;
  /** Polar's hosted checkout is card based and shows Apple Pay / Google Pay by device. [no verificado] */
  readonly walletMethods = ["apple_pay", "google_pay"] as const;

  constructor(private readonly cfg: PolarConfig, private readonly fetchFn: typeof fetch = fetch) {}

  static fromEnv(env: Record<string, string | undefined>): PolarPaymentProvider {
    if (!env.POLAR_ACCESS_TOKEN || !env.POLAR_WEBHOOK_SECRET) throw new PaymentConfigError("POLAR_ACCESS_TOKEN and POLAR_WEBHOOK_SECRET are required");
    let productMap: Record<string, string> = {};
    try {
      productMap = JSON.parse(env.POLAR_PRODUCT_MAP ?? "{}");
    } catch {
      throw new PaymentConfigError("POLAR_PRODUCT_MAP must be valid JSON");
    }
    return new PolarPaymentProvider({
      accessToken: env.POLAR_ACCESS_TOKEN,
      webhookSecret: env.POLAR_WEBHOOK_SECRET,
      productMap,
      server: env.POLAR_SERVER === "production" ? "production" : "sandbox",
    });
  }

  private get base(): string {
    return this.cfg.server === "production" ? "https://api.polar.sh" : "https://sandbox-api.polar.sh";
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    const key = `${req.productSlug}:${req.country}:${req.variant}`;
    const productId = this.cfg.productMap[key];
    if (!productId) throw new PaymentConfigError(`No Polar product configured for "${key}" in POLAR_PRODUCT_MAP`);
    const res = await this.fetchFn(`${this.base}/v1/checkouts/`, {
      method: "POST",
      headers: { authorization: `Bearer ${this.cfg.accessToken}`, "content-type": "application/json" },
      body: JSON.stringify({
        products: [productId],
        success_url: req.successUrl,
        customer_email: req.customerEmail,
        allow_discount_codes: false,
        // Only the random order id travels to Polar. No child data (Polar never receives it).
        metadata: { order_id: req.orderId },
      }),
    });
    if (!res.ok) throw new Error(`Polar createCheckout ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { id: string; url: string };
    return { provider: this.name, checkoutId: j.id, url: j.url };
  }

  async parseWebhook(rawBody: string, headers: Record<string, string | undefined>): Promise<PaymentEvent | null> {
    const ok = verifyStandardWebhook({
      key: Buffer.from(this.cfg.webhookSecret, "utf8"),
      id: headers["webhook-id"],
      timestamp: headers["webhook-timestamp"],
      signatureHeader: headers["webhook-signature"],
      body: rawBody,
    });
    if (!ok) throw new Error("Polar webhook signature invalid");
    const ev = JSON.parse(rawBody) as { type: string; data: { id: string; checkout_id?: string; metadata?: Record<string, string> } };
    const orderId = ev.data.metadata?.order_id ?? null;
    const checkoutId = ev.data.checkout_id ?? null;
    if (ev.type === "order.paid") return { type: "payment_succeeded", orderId, checkoutId, paymentId: ev.data.id };
    if (ev.type === "order.refunded") return { type: "refunded", orderId, checkoutId, paymentId: ev.data.id };
    return null;
  }

  /**
   * Full refund by default. Polar's refund endpoint needs the amount, so without `amountMinor` we read the order first and
   * refund its whole net amount plus tax. [no verificado: field names net_amount / tax_amount; confirm in sandbox]
   */
  async refund(req: RefundRequest): Promise<{ refundId: string }> {
    const headers = { authorization: `Bearer ${this.cfg.accessToken}`, "content-type": "application/json" };
    let amount = req.amountMinor;
    let taxAmount: number | undefined;
    if (amount === undefined) {
      const o = await this.fetchFn(`${this.base}/v1/orders/${req.paymentId}`, { headers });
      if (!o.ok) throw new Error(`Polar get order ${o.status}: ${await o.text()}`);
      const order = (await o.json()) as { net_amount?: number; tax_amount?: number; total_amount?: number; amount?: number };
      amount = order.net_amount ?? order.amount ?? order.total_amount;
      taxAmount = order.tax_amount;
      if (amount === undefined) throw new Error("Polar order has no amount; cannot refund automatically");
    }
    const res = await this.fetchFn(`${this.base}/v1/refunds/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        order_id: req.paymentId,
        reason: "customer_request",
        comment: req.reason.slice(0, 200),
        amount,
        ...(taxAmount !== undefined ? { tax_amount: taxAmount } : {}),
        revoke_benefits: true,
      }),
    });
    if (!res.ok) throw new Error(`Polar refund ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { id: string };
    return { refundId: j.id };
  }
}
