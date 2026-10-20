import { toUsdCents, type Currency } from "@lumen/config";
import { MockPaymentProvider } from "./mock";
import { PolarPaymentProvider } from "./polar";
import { RecurrentePaymentProvider } from "./recurrente";
import { PaymentConfigError, type PaymentProvider } from "./types";

export * from "./types";
export * from "./standard-webhooks";
export * from "./catalog";
export * from "./reconcile";
export { MockPaymentProvider } from "./mock";
export { PolarPaymentProvider } from "./polar";
export { RecurrentePaymentProvider } from "./recurrente";

/**
 * True when the deployment is the live one. In production a missing key is a hard error: a silent fallback to the mock
 * would let orders "pay" without charging.
 */
export function isProduction(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_ENV === "production" || env.PAYMENT_STRICT === "1";
}

/**
 * PAYMENT_PROVIDER=polar | recurrente | mock (default mock: nothing is ever charged without an explicit switch).
 * Outside production, polar/recurrente without keys fall back to the mock with a warning, so `npm run dev` always works.
 */
export function createPaymentProvider(env: Record<string, string | undefined> = process.env): PaymentProvider {
  const wanted = env.PAYMENT_PROVIDER ?? "mock";
  try {
    if (wanted === "polar") return PolarPaymentProvider.fromEnv(env);
    if (wanted === "recurrente") return RecurrentePaymentProvider.fromEnv(env);
  } catch (err) {
    if (isProduction(env) || !(err instanceof PaymentConfigError)) throw err;
    console.warn(`[payments] ${wanted} is not configured (${err.message}); using the mock provider. Nothing will be charged.`);
  }
  return new MockPaymentProvider(env.PUBLIC_BASE_URL ?? "http://localhost:3000");
}

/** Provider by name, for webhook routes (each provider has its own endpoint and secret). */
export function paymentProviderByName(name: string, env: Record<string, string | undefined> = process.env): PaymentProvider {
  switch (name) {
    case "polar":
      return PolarPaymentProvider.fromEnv(env);
    case "recurrente":
      return RecurrentePaymentProvider.fromEnv(env);
    case "mock":
      return new MockPaymentProvider(env.PUBLIC_BASE_URL ?? "http://localhost:3000");
    default:
      throw new Error(`Unknown payment provider ${name}`);
  }
}

/**
 * If the provider cannot charge the local currency (Recurrente: USD/GTQ only), charge the USD equivalent.
 * Returns what will actually be charged.
 */
export function convertForProvider(
  provider: PaymentProvider,
  amountMinor: number,
  currency: Currency,
  env: Record<string, string | undefined> = process.env,
): { amountMinor: number; currency: Currency; converted: boolean } {
  if (provider.supportedCurrencies === "any" || provider.supportedCurrencies.includes(currency)) {
    return { amountMinor, currency, converted: false };
  }
  return { amountMinor: toUsdCents(amountMinor, currency, env), currency: "USD", converted: true };
}
