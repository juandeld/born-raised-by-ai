import { InngestDispatcher, createEngine, type CallsEngine } from "@lumen/calls";

const KEY = Symbol.for("lumen.web.engine");

/**
 * One engine per server process (Next may load modules more than once in dev, so it hangs from globalThis).
 * Providers come from environment variables; everything defaults to the mock. Inngest is used as soon as it is configured.
 */
export function getEngine(): CallsEngine {
  const g = globalThis as unknown as Record<symbol, CallsEngine | undefined>;
  const cached = g[KEY];
  if (cached) return cached;
  const env = process.env;
  const useInngest = !!(env.INNGEST_EVENT_KEY || env.INNGEST_DEV);
  const engine = createEngine({ env, dispatcher: useInngest ? new InngestDispatcher() : undefined });
  g[KEY] = engine;
  return engine;
}

/** True where mock payments could let anyone "pay" for free: the live deployment. */
export function mockPaymentsAllowed(): boolean {
  return process.env.VERCEL_ENV !== "production" || process.env.ALLOW_MOCK_PAYMENTS === "1";
}

export function baseUrl(): string {
  return (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
