import { randomUUID } from "node:crypto";
import type { CheckoutRequest, CheckoutSession, PaymentEvent, PaymentProvider, RefundRequest } from "./types";

/**
 * Test-mode payment. createCheckout returns a link to the in-app "mock pay" page; the page posts to the mock
 * webhook, which calls the same confirmation path as the real providers. Never charges anything.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock" as const;
  readonly supportedCurrencies = "any" as const;
  readonly walletMethods = ["apple_pay", "google_pay"] as const;
  readonly refunds: Array<{ paymentId: string; reason: string; amountMinor?: number }> = [];

  constructor(private readonly baseUrl = "http://localhost:3000") {}

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    const checkoutId = `mock_chk_${randomUUID()}`;
    return { provider: this.name, checkoutId, url: `${this.baseUrl}/api/mock-pay?order=${req.orderId}&checkout=${checkoutId}` };
  }

  async parseWebhook(rawBody: string): Promise<PaymentEvent | null> {
    const b = JSON.parse(rawBody) as { type: string; orderId?: string; checkoutId?: string; paymentId?: string };
    const base = { orderId: b.orderId ?? null, checkoutId: b.checkoutId ?? null };
    if (b.type === "payment_succeeded") return { type: "payment_succeeded", ...base, paymentId: b.paymentId ?? `mock_pay_${randomUUID()}` };
    if (b.type === "payment_failed") return { type: "payment_failed", ...base };
    if (b.type === "refunded") return { type: "refunded", ...base, paymentId: b.paymentId ?? "" };
    return null;
  }

  async refund(req: RefundRequest): Promise<{ refundId: string }> {
    this.refunds.push({ paymentId: req.paymentId, reason: req.reason, amountMinor: req.amountMinor });
    return { refundId: `mock_ref_${randomUUID()}` };
  }
}
