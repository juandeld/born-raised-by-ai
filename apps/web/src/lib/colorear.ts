import { createColorearEngine, signLink, verifyLink, type ColorearEngine } from "@lumen/generate";
import { COLOREAR, colorearCountriesFor, isColorearLang, type ColorearLang, type CountryCode } from "@lumen/config";
import { baseUrl } from "./engine";

const KEY = Symbol.for("lumen.web.colorear");

/** Kind of the signed internal call that starts or continues a run in a fresh invocation. */
const RUN_KIND = "colorear-run";

/** One colorear engine per server process. Providers come from environment variables and default to the mock. */
export function getColorear(): ColorearEngine {
  const g = globalThis as unknown as Record<symbol, ColorearEngine | undefined>;
  const cached = g[KEY];
  if (cached) return cached;
  const env = process.env;
  const engine = createColorearEngine({
    env,
    overrides: {
      // When a run reaches its time budget it asks for a new invocation of /api/colorear/run (answers 202 at once).
      continueRun: async (orderId) => {
        const sig = signLink(env, RUN_KIND, orderId, 120);
        await fetch(`${baseUrl()}/api/colorear/run`, { method: "POST", headers: { "content-type": "application/json", "x-colorear-sig": sig }, body: JSON.stringify({ orderId }), signal: AbortSignal.timeout(15_000) });
      },
    },
  });
  g[KEY] = engine;
  return engine;
}

export function verifyRunSignature(orderId: string, sig: string | null): boolean {
  return verifyLink(process.env, RUN_KIND, orderId, sig);
}

export function langOf(raw: string | undefined): ColorearLang | null {
  return isColorearLang(raw) ? raw : null;
}

/** Countries open for this page language, with the first one as default. */
export function countriesOf(lang: ColorearLang): CountryCode[] {
  return colorearCountriesFor(lang);
}

/** Does the payment event belong to a colorear order? (Santa orders keep going to the calls engine.) */
export async function isColorearOrder(orderId: string | null | undefined, checkoutId: string | null | undefined): Promise<boolean> {
  const db = getColorear().d.db;
  if (orderId) {
    const o = await db.orders.get(orderId);
    if (o) return o.product === COLOREAR.slug;
  }
  if (checkoutId) {
    const o = (await db.orders.find({ checkout_id: checkoutId }, { limit: 1 }))[0];
    if (o) return o.product === COLOREAR.slug;
  }
  return false;
}

/** Asks for a (new) generation run in its own function invocation. Returns at once: the run answers 202 and works after the response. */
export async function kickRun(orderId: string): Promise<void> {
  const c = getColorear();
  if (c.d.continueRun) await c.d.continueRun(orderId);
}

/** Payment event of a colorear order (mock page or provider webhook): marks it paid, then starts the book. */
export async function handleColorearPayment(event: Parameters<ColorearEngine["handlePaymentEvent"]>[0]): Promise<void> {
  const c = getColorear();
  const order = await c.handlePaymentEvent(event);
  if (order && order.status === "paid") await kickRun(order.id).catch((e) => console.error("[colorear] kick failed", e instanceof Error ? e.message : e));
}
