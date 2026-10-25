import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COLOREAR_LANGS, colorearResendFrom } from "@lumen/config";
import { createDelivery } from "@lumen/calls";
import { composeColorearMessage, createColorearEngine, type ColorearCheckoutInput } from "@lumen/generate";

/**
 * Pintoria emails never come from "Jinglo" (Santa's display name in the shared RESEND_FROM): the sender is the brand name with the same
 * address as RESEND_FROM (no new DNS), or COLOREAR_RESEND_FROM once pintoria.app is verified; replies go to the support address of the
 * legal texts. Santa keeps RESEND_FROM and sends no reply-to.
 */
interface Sent { url: string; body: Record<string, unknown> }
const sent: Sent[] = [];
function stubResend() {
  sent.length = 0;
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (String(url).includes("api.resend.com")) {
      sent.push({ url: String(url), body: JSON.parse(String(init?.body)) as Record<string, unknown> });
      return new Response(JSON.stringify({ id: `re_${sent.length}` }), { status: 200 });
    }
    return new Response("{}", { status: 202 }); // the engine asks for another run: not needed here
  }));
}
afterEach(() => vi.unstubAllGlobals());

describe("colorearResendFrom", () => {
  it("uses the brand name with the address of RESEND_FROM, never its display name", () => {
    expect(colorearResendFrom({})).toBe("Pintoria <hola@lumen-labs.co>");
    expect(colorearResendFrom({ RESEND_FROM: "Jinglo <hola@lumen-labs.co>" })).toBe("Pintoria <hola@lumen-labs.co>");
    expect(colorearResendFrom({ RESEND_FROM: "Lumen Labs <ayuda@ejemplo.co>" })).toBe("Pintoria <ayuda@ejemplo.co>");
    expect(colorearResendFrom({ RESEND_FROM: "hola@lumen-labs.co" })).toBe("Pintoria <hola@lumen-labs.co>");
    expect(colorearResendFrom({ RESEND_FROM: "nonsense" })).toBe("Pintoria <hola@lumen-labs.co>");
    expect(colorearResendFrom({ COLOREAR_BRAND_NAME: "Otra", RESEND_FROM: "Jinglo <hola@lumen-labs.co>" })).toBe("Otra <hola@lumen-labs.co>");
    expect(colorearResendFrom({ COLOREAR_BRAND_NAME: 'Bad "<x>"', RESEND_FROM: "J <a@b.co>" })).toBe("Bad x <a@b.co>");
  });

  it("COLOREAR_RESEND_FROM wins when it holds an address, and is ignored when it does not", () => {
    expect(colorearResendFrom({ COLOREAR_RESEND_FROM: "Pintoria <hola@pintoria.app>", RESEND_FROM: "Jinglo <hola@lumen-labs.co>" })).toBe("Pintoria <hola@pintoria.app>");
    expect(colorearResendFrom({ COLOREAR_RESEND_FROM: "   ", RESEND_FROM: "Jinglo <hola@lumen-labs.co>" })).toBe("Pintoria <hola@lumen-labs.co>");
    expect(colorearResendFrom({ COLOREAR_RESEND_FROM: "Pintoria", RESEND_FROM: "Jinglo <hola@lumen-labs.co>" })).toBe("Pintoria <hola@lumen-labs.co>");
  });
});

describe("delivery provider", () => {
  const msg = { kind: "receipt" as const, to: "a@b.co", subject: "s", text: "t" };
  it("Santa is unchanged: the shared RESEND_FROM and no reply-to", async () => {
    stubResend();
    await createDelivery({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "k", RESEND_FROM: "Jinglo <hola@lumen-labs.co>" }).send(msg);
    await createDelivery({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "k" }).send(msg);
    expect(sent.map((s) => s.body.from)).toEqual(["Jinglo <hola@lumen-labs.co>", "Jinglo <hola@lumen-labs.co>"]);
    expect(sent.every((s) => !("reply_to" in s.body))).toBe(true);
  });

  it("a product can pass its own sender and reply-to", async () => {
    stubResend();
    await createDelivery({ EMAIL_PROVIDER: "resend", RESEND_API_KEY: "k", RESEND_FROM: "Jinglo <hola@lumen-labs.co>" }, { from: "Pintoria <hola@lumen-labs.co>", replyTo: "soporte@lumen-labs.co" }).send(msg);
    expect(sent[0]!.body).toMatchObject({ from: "Pintoria <hola@lumen-labs.co>", reply_to: "soporte@lumen-labs.co", to: ["a@b.co"] });
  });
});

describe("every colorear email", () => {
  const photo = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));
  const input = async (): Promise<ColorearCheckoutInput> => ({
    lang: "es", country: "MX", email: "mama@example.com", persons: [{ name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }],
    photos: [await photo(), await photo()], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile",
  });
  const baseEnv = () => ({
    DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-mail-")), "db.json"), STORAGE_PROVIDER: "memory", PAYMENT_PROVIDER: "mock",
    IMAGE_PROVIDER: "mock", EMAIL_PROVIDER: "resend", RESEND_API_KEY: "re_test", RESEND_FROM: "Jinglo <hola@lumen-labs.co>", COLOREAR_COUNTRIES: "MX,ES,GB,US",
    PUBLIC_BASE_URL: "http://localhost:3000", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", PHONE_HASH_SALT: "test-salt",
  }) as Record<string, string | undefined>;

  async function lifecycle(env: Record<string, string | undefined>) {
    const engine = createColorearEngine({ env });
    const { order } = await engine.createCheckout(await input(), { successUrl: (o) => `https://www.pintoria.app/colorear/confirmacion/${o.access_token}`, cancelUrl: "https://www.pintoria.app/" });
    await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "pay_1" });
    expect((await engine.runGeneration(order.id)).status).toBe("done");
    const done = (await engine.d.db.orders.get(order.id))!;
    expect((await engine.refundByLink(done.access_token)).refunded).toBe(true);
  }

  it("comes from Pintoria on the address of RESEND_FROM, replies to support, and never says Jinglo (receipt, delivery, refund)", async () => {
    stubResend();
    await lifecycle(baseEnv());
    expect(sent.length).toBeGreaterThanOrEqual(3); // receipt, delivery and refund
    for (const s of sent) {
      expect(s.body.from).toBe("Pintoria <hola@lumen-labs.co>");
      expect(s.body.reply_to).toBe("soporte@lumen-labs.co");
      expect(JSON.stringify(s.body)).not.toMatch(/jinglo/i); // from, reply_to, subject, text and html
    }
    expect(sent.map((s) => String(s.body.subject)).join(" | ")).toMatch(/Pintoria/);
  });

  it("follows COLOREAR_RESEND_FROM and SUPPORT_EMAIL when they are set", async () => {
    stubResend();
    await lifecycle({ ...baseEnv(), COLOREAR_RESEND_FROM: "Pintoria <hola@pintoria.app>", SUPPORT_EMAIL: "ayuda@pintoria.app" });
    expect(sent.length).toBeGreaterThanOrEqual(3);
    for (const s of sent) expect(s.body).toMatchObject({ from: "Pintoria <hola@pintoria.app>", reply_to: "ayuda@pintoria.app" });
  });

  it("no composed message of any kind, language or variant mentions Jinglo (subject, text or html)", () => {
    const kinds = ["receipt", "receipt_add", "delivery", "refund", "reminder"] as const;
    const vars = { names: "Ana", price: "$1", statusLink: "s", deliveryLink: "d", refundLink: "r", deleteDate: "2026-11-30", holder: "T", privacyEmail: "p@x", supportEmail: "s@x", brand: "Pintoria", address: "Calle 1", stopLink: "x", landingLink: "l", commercialOk: true, offerPrice: "$9", offerUntil: "u", offerLink: "o", creditsLeft: 2, creditsUntil: "u", parentLink: "p", daysLeft: 5 };
    let n = 0;
    for (const lang of COLOREAR_LANGS) for (const kind of kinds) for (const extra of [{}, { testOrder: true }, { kind: "credit" as const }, { kind: "add" as const }, { legalLang: "es-ES" as const }]) {
      const m = composeColorearMessage(kind, lang, "a@b.co", { ...vars, ...extra });
      expect(JSON.stringify(m), `${lang} ${kind} ${JSON.stringify(extra)}`).not.toMatch(/jinglo/i);
      n++;
    }
    expect(n).toBe(COLOREAR_LANGS.length * kinds.length * 5);
  });
});
