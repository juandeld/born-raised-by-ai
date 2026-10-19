import { toUsdCents, type Currency } from "@lumen/config";
import { MockPaymentProvider } from "./mock";
import { PolarPaymentProvider } from "./polar";
import { RecurrentePaymentProvider } from "./recurrente";
import type { PaymentProvider } from "./types";

export * from "./types";
export * from "./standard-webhooks";
export { MockPaymentProvider } from "./mock";
export { PolarPaymentProvider } from "./polar";
export { RecurrentePaymentProvider } from "./recurrente";

/** PAYMENT_PROVIDER=polar | recurrente | mock (default mock: nothing is ever charged without an explicit switch). */
export function createPaymentProvider(env: Record<string, string | undefined> = process.env): PaymentProvider {
  switch (env.PAYMENT_PROVIDER ?? "mock") {
    case "polar":
      return PolarPaymentProvider.fromEnv(env);
    case "recurrente":
      return RecurrentePaymentProvider.fromEnv(env);
    default:
      return new MockPaymentProvider(env.PUBLIC_BASE_URL ?? "http://localhost:3000");
  }
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
