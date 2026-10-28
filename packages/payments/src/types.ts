import type { ColorearVariant, Currency, CountryCode, Variant } from "@lumen/config";

export interface CheckoutRequest {
  orderId: string;
  productSlug: string;
  /** Santa: single | bundle. Colorear: single | bundle3 | add1. The Polar product key is `<slug>:<country>:<variant>`. */
  variant: Variant | ColorearVariant;
  country: CountryCode;
  productName: string;
  /** Amount in minor units of `currency`. The caller already converted if the provider needs it. */
  amountMinor: number;
  currency: Currency;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  testMode: boolean;
}

export interface CheckoutSession {
  provider: string;
  checkoutId: string;
  url: string;
}

export type PaymentEvent =
  | { type: "payment_succeeded"; orderId: string | null; checkoutId: string | null; paymentId: string }
  | { type: "payment_failed"; orderId: string | null; checkoutId: string | null }
  | { type: "refunded"; orderId: string | null; checkoutId: string | null; paymentId: string };

export interface RefundRequest {
  paymentId: string;
  amountMinor?: number;
  currency: Currency;
  reason: string;
}

export interface PaymentProvider {
  readonly name: "polar" | "recurrente" | "mock";
  /** Currencies the provider can charge. Others are converted to USD by the checkout service. */
  readonly supportedCurrencies: Currency[] | "any";
  /**
   * Wallets the hosted checkout offers on its own (the page only shows badges; the wallet button lives in the provider page).
   * Apple Pay / Google Pay are placeholders until the account is connected and tested: see docs/arquitectura/pendientes-cuentas.md.
   */
  readonly walletMethods: ReadonlyArray<"apple_pay" | "google_pay">;
  /** True when the provider runs on test/sandbox keys: checkouts look real but no money moves, so orders are test_mode and cost-capped. */
  readonly sandbox?: boolean;
  createCheckout(req: CheckoutRequest): Promise<CheckoutSession>;
  /** Verifies the signature and returns a normalized event, or null for events we ignore. Throws if the signature is invalid. */
  parseWebhook(rawBody: string, headers: Record<string, string | undefined>): Promise<PaymentEvent | null>;
  refund(req: RefundRequest): Promise<{ refundId: string }>;
}

export class PaymentConfigError extends Error {}
