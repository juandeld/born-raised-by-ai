import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { brandConfig, colorearTestCodeLimits, colorearTestCodes, colorearTestCodesEnabled, normalizeTestCode } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider, type DeliveryProvider, type OutboundMessage, type SendResult } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { sha256 } from "@lumen/legal";
import { MockPaymentProvider } from "@lumen/payments";
import {
  ColorearEngine, ColorearValidationError, MockImageProvider, TEST_CODE_PROVIDER, TemplateStoryProvider, composeColorearMessage, matchTestCode, testCodeHash,
  type ColorearCheckoutInput, type ImageProvider, type ImageRequest,
} from "@lumen/generate";

/**
 * Test codes (Juan's request of 25-oct): an order made with COLOREAR_TEST_CODES skips the payment, is marked paid through the same internal path as a
 * real payment, generates the REAL book (never the sample drawings) and is capped by two limits counted in the database.
 */
const photo = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));

/** Stands in for the paid image provider: same drawings as the mock, but it reports itself as a real one so the engine's choice is visible. */
class FakeReal implements ImageProvider {
  readonly name = "openai" as const;
  readonly model = "fake-real";
  calls = 0;
  private inner = new MockImageProvider();
  async render(req: ImageRequest) {
    this.calls++;
    return this.inner.render(req);
  }
}

class FailingDelivery implements DeliveryProvider {
  readonly name = "resend";
  sent: OutboundMessage[] = [];
  async send(msg: OutboundMessage): Promise<SendResult> {
    this.sent.push(msg);
    return { channel: "email", status: "failed", provider: "resend", providerId: null, error: "403 You can only send testing emails to your own email address" };
  }
}

function harness(extraEnv: Record<string, string> = {}, delivery: DeliveryProvider = new MockDeliveryProvider()) {
  const db = createMemoryDb();
  const storage = new MemoryStorage();
  const uploads = new MemoryStorage();
  const sink = new MemorySink();
  const real = new FakeReal();
  const payments = new MockPaymentProvider("http://localhost:3000");
  const clock = { now: new Date("2026-11-20T15:00:00Z") };
  const env = {
    COLOREAR_COUNTRIES: "MX,ES,GB,US", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala", PHONE_HASH_SALT: "test-salt",
    COLOREAR_TEST_CODES: "PROMO2026", COLOREAR_MOCK_REAL_DAILY_CAP: "0", ...extraEnv,
  };
  const engine = new ColorearEngine({
    db, storage, uploads, delivery, image: real, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => clock.now),
    payments, env, now: () => clock.now, brand: { ...brandConfig(env), brand: "Pintoria" },
  });
  return { engine, db, storage, uploads, delivery, sink, real, payments, clock, env };
}
type H = ReturnType<typeof harness>;

async function input(over: Partial<ColorearCheckoutInput> = {}): Promise<ColorearCheckoutInput> {
  return {
    lang: "es", country: "MX", email: "amigo@example.com",
    persons: [{ name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }],
    photos: [await photo(), await photo()], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile", ...over,
  };
}
const urls = { successUrl: (o: { access_token: string }) => `https://www.pintoria.app/colorear/confirmacion/${o.access_token}`, cancelUrl: "http://x/" };
const HOUR = 3_600_000;
const advance = (h: H, ms: number) => { h.clock.now = new Date(h.clock.now.getTime() + ms); };
const charFiles = (h: H, id: string) => [...h.storage.files.keys()].filter((k) => k.startsWith(`colorear/${id}/char-`));
const ev = (h: H, name: string) => h.sink.events.filter((e) => e.name === name);

/** What the web layer does after a valid code: the internal payment event, the same call a provider webhook ends in. */
async function redeem(h: H, over: Partial<ColorearCheckoutInput> = {}) {
  const { order, checkoutUrl } = await h.engine.createCheckout(await input({ testCode: "PROMO2026", ...over }), urls);
  const paid = await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: order.checkout_id! });
  return { order, paid: paid!, checkoutUrl };
}

describe("configuration", () => {
  it("is off by default, normalizes codes and defaults the caps to 50 in total and 10 per day", () => {
    expect(colorearTestCodesEnabled({})).toBe(false);
    expect(colorearTestCodes({ COLOREAR_TEST_CODES: " promo 2026 , AMIGOS,,promo2026" })).toEqual(["PROMO2026", "AMIGOS"]);
    expect(normalizeTestCode(" pro mo-2026\n")).toBe("PROMO-2026");
    expect(colorearTestCodeLimits({})).toEqual({ maxUses: 50, dailyCap: 10 });
    expect(colorearTestCodeLimits({ COLOREAR_TEST_CODE_MAX_USES: "20", COLOREAR_TEST_CODE_DAILY_CAP: "3" })).toEqual({ maxUses: 20, dailyCap: 3 });
    expect(colorearTestCodeLimits({ COLOREAR_TEST_CODE_MAX_USES: "x", COLOREAR_TEST_CODE_DAILY_CAP: "-1" })).toEqual({ maxUses: 50, dailyCap: 10 });
    expect(colorearTestCodeLimits({ COLOREAR_TEST_CODE_MAX_USES: "0" }).maxUses).toBe(0);
  });
  it("matches ignoring case and spaces, rejects everything else, and hashes without exposing the code", () => {
    const env = { COLOREAR_TEST_CODES: "PROMO2026", PHONE_HASH_SALT: "s" };
    expect(matchTestCode(env, "promo2026")).toBe("PROMO2026");
    expect(matchTestCode(env, "  Promo 2026 ")).toBe("PROMO2026");
    expect(matchTestCode(env, "PROMO2027")).toBeNull();
    expect(matchTestCode(env, "")).toBeNull();
    expect(matchTestCode(env, "x".repeat(500))).toBeNull();
    expect(matchTestCode({ PHONE_HASH_SALT: "s" }, "PROMO2026")).toBeNull();
    const hash = testCodeHash(env, "PROMO2026");
    expect(hash).toMatch(/^[0-9a-f]{10}$/);
    expect(hash).toBe(testCodeHash(env, "promo2026"));
    expect(hash).not.toBe(testCodeHash({ ...env, PHONE_HASH_SALT: "other" }, "PROMO2026"));
  });
});

describe("redeeming a code", () => {
  it("rejects any code while the feature is off, storing nothing", async () => {
    const h = harness({ COLOREAR_TEST_CODES: "" });
    const err = await h.engine.createCheckout(await input({ testCode: "PROMO2026" }), urls).catch((e) => e);
    expect(err).toBeInstanceOf(ColorearValidationError);
    expect((err as ColorearValidationError).errors).toEqual({ code: "invalid" });
    expect(await h.db.orders.find()).toHaveLength(0);
    expect(h.uploads.files.size).toBe(0);
  });

  it("rejects a wrong code without creating the order or keeping the photos", async () => {
    const h = harness();
    const err = await h.engine.createCheckout(await input({ testCode: "PROMO9999" }), urls).catch((e) => e);
    expect((err as ColorearValidationError).errors).toEqual({ code: "invalid" });
    expect(await h.db.orders.find()).toHaveLength(0);
    expect(h.uploads.files.size).toBe(0);
  });

  it("creates a free test order for 1 adventure: no payment provider call, amount 0 in the country's currency, straight to the status page", async () => {
    const h = harness();
    const spy = vi.spyOn(h.payments, "createCheckout");
    const { order, checkoutUrl } = await h.engine.createCheckout(await input({ testCode: " promo2026 " }), urls);
    expect(spy).not.toHaveBeenCalled();
    expect(order).toMatchObject({ variant: "single", payment_provider: TEST_CODE_PROVIDER, test_mode: true, amount_minor: 0, amount_usd_cents: 0, currency: "MXN", status: "created", email: "amigo@example.com" });
    expect(order.checkout_id).toBe(`testcode:${testCodeHash(h.env, "PROMO2026")}:${order.id}`);
    expect(checkoutUrl).toBe(`https://www.pintoria.app/colorear/confirmacion/${order.access_token}`);
    expect(h.uploads.files.size).toBe(2);
  });

  it("marks it paid with the internal event: consent K1 and K2 recorded, receipt says 'Pedido de prueba sin costo', no charge shown", async () => {
    const h = harness();
    const { paid } = await redeem(h);
    expect(paid.status).toBe("paid");
    const consents = await h.db.consents.find({ order_id: paid.id });
    expect(consents.map((c) => c.checkbox_id).sort()).toEqual(["K1", "K2"]);
    expect(consents.every((c) => c.text_sha256.length === 64 && c.ip === "203.0.113.7")).toBe(true);
    const mail = (h.delivery as MockDeliveryProvider).sent.find((m) => m.kind === "receipt")!;
    expect(mail.subject).toMatch(/Pedido de prueba sin costo/);
    expect(mail.text).toMatch(/^Pedido de prueba sin costo\./);
    expect(mail.text).not.toMatch(/cobro de|MX\$/);
    expect(mail.text).not.toMatch(/Para pedir reembolso|reembolsamos/); // no refund promise for something that was never charged
    expect(mail.text).toMatch(/borran en cuanto los personajes están listos|se borran en cuanto/); // the photo notice stays
  });

  it("works for the Trio and for English, and the English receipt says 'Test order, no charge'", async () => {
    const h = harness();
    const { paid } = await redeem(h, { variant: "bundle3", lang: "en", country: "US" });
    expect(paid).toMatchObject({ variant: "bundle3", amount_minor: 0, currency: "USD", payment_provider: TEST_CODE_PROVIDER });
    const mail = (h.delivery as MockDeliveryProvider).sent.find((m) => m.kind === "receipt")!;
    expect(mail.subject).toMatch(/Test order, no charge/);
    expect(mail.text).toMatch(/^Test order, no charge\./);
    expect(mail.text).not.toMatch(/charge of|\$/);
  });

  it("still needs K1 and K2: a valid code does not skip the consent", async () => {
    const h = harness();
    for (const checkboxIds of [[], ["K2"], ["K1"]]) {
      const err = await h.engine.createCheckout(await input({ testCode: "PROMO2026", checkboxIds }), urls).catch((e) => e);
      expect((err as ColorearValidationError).errors.consent).toBeTruthy();
    }
    expect(await h.db.orders.find()).toHaveLength(0);
  });

  it("tracks test_code_redeemed with a short hash, never the code, and the paid event shows amount 0", async () => {
    const h = harness();
    const { paid } = await redeem(h);
    const [redeemed] = ev(h, "test_code_redeemed");
    expect(redeemed!.props).toMatchObject({ code_hash: testCodeHash(h.env, "PROMO2026"), variant: "single", uses_total: 1, uses_24h: 1, max_uses: 50, daily_cap: 10, test_mode: true, order_id: paid.id, product: "colorear" });
    const paidEvent = ev(h, "paid")[0]!;
    expect(paidEvent.props).toMatchObject({ amount_usd_cents: 0, payment_provider: TEST_CODE_PROVIDER, test_mode: true });
    expect(ev(h, "checkout_started")[0]!.props).toMatchObject({ payment_provider: TEST_CODE_PROVIDER, amount_usd_cents: 0 });
    // nothing personal and nothing that reveals the code, in analytics or in the events table
    const dump = JSON.stringify([h.sink.events, await h.db.events.find()]);
    expect(dump).not.toMatch(/promo ?2026|amigo@example|Manuela|Toby|203\.0\.113/i);
  });
});

describe("real generation", () => {
  it("always uses the real image provider for code orders, while ordinary mock-payment orders past the daily cap get the sample drawings", async () => {
    const h = harness(); // COLOREAR_MOCK_REAL_DAILY_CAP=0: no ordinary mock-payment order gets the real provider
    const ordinary = await h.engine.createCheckout(await input({ testCode: "" }), urls);
    await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: ordinary.order.id, checkoutId: ordinary.order.checkout_id, paymentId: "pay_x" });
    await h.engine.runGeneration(ordinary.order.id);
    expect(h.real.calls).toBe(0);
    expect(ev(h, "generation_started")[0]!.props).toMatchObject({ provider: "mock" });

    const { paid } = await redeem(h);
    expect((await h.engine.runGeneration(paid.id)).status).toBe("done");
    expect(h.real.calls).toBeGreaterThan(20);
    expect(ev(h, "generation_started")[1]!.props).toMatchObject({ provider: "openai", test_mode: true });
    expect((await h.db.orders.get(paid.id))!.status).toBe("delivered");
  });

  it("Trio: the 2 extra adventures are real too, and they behave like any Trio credit", async () => {
    const h = harness();
    const { paid } = await redeem(h, { variant: "bundle3" });
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    const st = (await h.engine.getStatus(token))!;
    expect(st.credits).toMatchObject({ left: 2, total: 2 });
    expect(st.offer).toBeNull();
    const before = h.real.calls;
    const c1 = await h.engine.useCredit(token, { theme: "dinosaurios", themeId: "dinosaurs" });
    if (!c1.ok) throw new Error(c1.reason);
    expect(c1.creditsLeft).toBe(1);
    expect((await h.engine.runGeneration(c1.orderId)).status).toBe("done");
    expect(h.real.calls - before).toBe(23); // cover + 22 scenes, characters reused
    const kid = (await h.db.orders.get(c1.orderId))!;
    expect(kid).toMatchObject({ variant: "credit", amount_minor: 0, test_mode: true, status: "delivered" });
    expect(ev(h, "generation_started").at(-1)!.props).toMatchObject({ provider: "openai", variant: "credit" });
    const c2 = await h.engine.useCredit(token, { theme: "" });
    if (!c2.ok) throw new Error(c2.reason);
    await h.engine.runGeneration(c2.orderId);
    expect(ev(h, "generation_started").at(-1)!.props).toMatchObject({ provider: "openai" });
    expect(charFiles(h, paid.id)).toHaveLength(0);
    // credits are not redemptions: the code was used once
    expect(ev(h, "test_code_redeemed")).toHaveLength(1);
  });

  it("hides the paid 'otra aventura' offer on a test order and keeps no drawings for it", async () => {
    const h = harness();
    const { paid } = await redeem(h);
    await h.engine.runGeneration(paid.id);
    const parent = (await h.db.orders.get(paid.id))!;
    const st = (await h.engine.getStatus(parent.access_token))!;
    expect(st).toMatchObject({ phase: "ready", testMode: true, offer: null });
    expect(st.legal).toEqual({ characters: null, offerTerms: null, deleteButton: null });
    expect(charFiles(h, paid.id)).toHaveLength(0);
    const mail = (h.delivery as MockDeliveryProvider).sent.find((m) => m.kind === "delivery")!;
    expect(mail.text).toMatch(/Pedido de prueba sin costo/);
    expect(mail.text).not.toMatch(/MX\$|48 horas|reembolso completo/);
    expect(await h.engine.createUpsellCheckout(parent.access_token, h.engine.signUpsell(parent.access_token, new Date(h.clock.now.getTime() + 40 * HOUR).toISOString()), { theme: "", ip: null }, urls)).toMatchObject({ ok: false });
  });
});

/** Evidence of consent (P4 of docs/legal/aprobaciones/colorear-codigo-prueba-3-fotos.md): nothing is charged, so the text recorded must not say "Al pagar". */
describe("consent text of a test-code order (colorear-legal-v5-code)", () => {
  const byBox = async (h: H, orderId: string) => Object.fromEntries((await h.db.consents.find({ order_id: orderId })).map((c) => [c.checkbox_id, c]));

  it("records K1 as in any order and the code variant of K2, with the ids, texts and hashes of the variant, in every language", async () => {
    const cases = [
      { over: {}, k1: "08-K1-es-419-colorear-v5", k2: "08-K2-es-419-colorear-v5-code", text: "Al usar el código, acepto los términos de servicio y la política de privacidad." },
      { over: { country: "ES" as const }, k1: "08-K1-es-ES-colorear-v5", k2: "08-K2-es-ES-colorear-v5-code", text: "Al usar el código, acepto los términos de servicio y la política de privacidad." },
      { over: { lang: "en" as const, country: "US" as const }, k1: "08-K1-en-colorear-v5", k2: "08-K2-en-colorear-v5-code", text: "By using the code, I accept the terms of service and the privacy policy." },
    ];
    for (const c of cases) {
      const h = harness();
      const { paid } = await redeem(h, c.over);
      const boxes = await byBox(h, paid.id);
      expect(boxes.K1!.text_version_id).toBe(c.k1);
      expect(boxes.K2!.text_version_id).toBe(c.k2);
      expect(boxes.K2!.text_sha256).toBe(sha256(c.text));
      expect(boxes.K2!.text_sha256).not.toBe(sha256("Al pagar, acepto los términos de servicio y la política de privacidad."));
      // the analytics event carries the same ids as the evidence
      expect(ev(h, "consent_given")[0]!.props).toMatchObject({ checkbox_ids: ["K1", "K2"], text_version_ids: [c.k1, c.k2] });
    }
  });

  it("an ordinary order keeps the K2 of a payment (\"Al pagar\"), recorded with the -v5 id", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input({ testCode: "" }), urls);
    await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "pay_ord" });
    const boxes = await byBox(h, order.id);
    expect(boxes.K1!.text_version_id).toBe("08-K1-es-419-colorear-v5");
    expect(boxes.K2!.text_version_id).toBe("08-K2-es-419-colorear-v5");
    expect(boxes.K2!.text_sha256).toBe(sha256("Al pagar, acepto los términos de servicio y la política de privacidad."));
    expect(ev(h, "consent_given")[0]!.props).toMatchObject({ text_version_ids: ["08-K1-es-419-colorear-v5", "08-K2-es-419-colorear-v5"] });
  });
});

/** P5: nobody bought anything with a test code, so no commercial email (PECR reg. 22, LSSI art. 21.2), and it would count against the three allowed. */
describe("no commercial email for an order made with a test code", () => {
  const OFFER = /Otra aventura con los mismos personajes|fotos nuevas aquí|ofertas|Para no recibir más/;
  const priv = (h: H) => h.engine as unknown as { commercialAllowed(o: unknown): Promise<boolean> };
  const commercialCount = async (h: H, id: string) => (JSON.parse((await h.db.orders.get(id))!.details ?? "{}") as { commercialEmails?: number }).commercialEmails ?? 0;
  const pay = async (h: H, over: Partial<ColorearCheckoutInput>) => {
    const { order } = await h.engine.createCheckout(await input({ testCode: "", ...over }), urls);
    await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: `pay_${order.id}` });
    return order;
  };

  it("commercialAllowed is false for a test-code order and true for an ordinary one", async () => {
    const h = harness();
    const { paid } = await redeem(h, { email: "prueba@example.com" });
    const ordinary = await pay(h, { email: "compra@example.com" });
    expect(await priv(h).commercialAllowed((await h.db.orders.get(paid.id))!)).toBe(false);
    expect(await priv(h).commercialAllowed((await h.db.orders.get(ordinary.id))!)).toBe(true);
  });

  it("the delivery email and the day-25 reminder of a test-code order carry no offer and count no commercial email; an ordinary order still gets both", async () => {
    const h = harness();
    const { paid } = await redeem(h, { email: "prueba@example.com" });
    await h.engine.runGeneration(paid.id);
    const ordinary = await pay(h, { email: "compra@example.com" });
    await h.engine.runGeneration(ordinary.id);
    const sentMail = (h.delivery as MockDeliveryProvider).sent;
    const deliveryOf = (to: string) => sentMail.find((m) => m.kind === "delivery" && m.to === to)!;
    expect(deliveryOf("prueba@example.com").text).not.toMatch(OFFER);
    expect(deliveryOf("compra@example.com").text).toMatch(/Otra aventura con los mismos personajes/);

    advance(h, 26 * 24 * HOUR);
    expect((await h.engine.sweep()).reminded).toBe(2);
    const reminderOf = (to: string) => sentMail.find((m) => m.kind === "reminder" && m.to === to)!;
    expect(reminderOf("prueba@example.com").text).not.toMatch(OFFER);
    expect(reminderOf("prueba@example.com").text).toMatch(/Descárguelo aquí/); // the transactional part is still there
    expect(reminderOf("compra@example.com").text).toMatch(/fotos nuevas aquí/);
    expect(reminderOf("compra@example.com").text).toMatch(/ofertas/);
    expect(await commercialCount(h, paid.id)).toBe(0);
    expect(await commercialCount(h, ordinary.id)).toBe(2);
  });

  it("the Trio of a test code and its free adventures never get a commercial block either, even once every adventure is used", async () => {
    const h = harness();
    const { paid } = await redeem(h, { variant: "bundle3", email: "trio@example.com" });
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    const kids: string[] = [];
    for (const theme of ["dinosaurios", "el espacio"]) {
      const c = await h.engine.useCredit(token, { theme });
      if (!c.ok) throw new Error(c.reason);
      await h.engine.runGeneration(c.orderId);
      kids.push(c.orderId);
    }
    for (const id of [paid.id, ...kids]) expect(await priv(h).commercialAllowed((await h.db.orders.get(id))!), id).toBe(false);
    advance(h, 26 * 24 * HOUR);
    await h.engine.sweep();
    const reminders = (h.delivery as MockDeliveryProvider).sent.filter((m) => m.kind === "reminder");
    expect(reminders.length).toBeGreaterThanOrEqual(1);
    for (const m of reminders) expect(m.text).not.toMatch(OFFER);
    for (const id of [paid.id, ...kids]) expect(await commercialCount(h, id)).toBe(0);
  });
});

describe("caps", () => {
  it("closes the code after COLOREAR_TEST_CODE_MAX_USES orders in total, answering 'exhausted'", async () => {
    const h = harness({ COLOREAR_TEST_CODE_MAX_USES: "3", COLOREAR_TEST_CODE_DAILY_CAP: "99" });
    for (let i = 0; i < 3; i++) { await redeem(h); advance(h, 2 * HOUR); }
    const err = await h.engine.createCheckout(await input({ testCode: "promo2026" }), urls).catch((e) => e);
    expect(err).toBeInstanceOf(ColorearValidationError);
    expect((err as ColorearValidationError).errors).toEqual({ code: "exhausted" });
    expect(await h.db.orders.find()).toHaveLength(3);
    advance(h, 40 * 24 * HOUR); // time does not reopen the total
    expect(((await h.engine.createCheckout(await input({ testCode: "promo2026" }), urls).catch((e) => e)) as ColorearValidationError).errors.code).toBe("exhausted");
  });

  it("closes the code after COLOREAR_TEST_CODE_DAILY_CAP orders in any 24 hours, and reopens afterwards", async () => {
    const h = harness({ COLOREAR_TEST_CODE_MAX_USES: "50", COLOREAR_TEST_CODE_DAILY_CAP: "2" });
    await redeem(h);
    advance(h, 10 * HOUR);
    await redeem(h);
    advance(h, 10 * HOUR); // 20 h after the first: still inside the window
    expect(((await h.engine.createCheckout(await input({ testCode: "PROMO2026" }), urls).catch((e) => e)) as ColorearValidationError).errors).toEqual({ code: "exhausted" });
    advance(h, 5 * HOUR); // 25 h after the first: it left the window
    await expect(redeem(h)).resolves.toBeTruthy();
    expect(ev(h, "test_code_redeemed").map((e) => (e.props as { uses_24h: number }).uses_24h)).toEqual([1, 2, 2]);
  });

  it("counts each code apart, and an order cancelled by a cap does not count", async () => {
    const h = harness({ COLOREAR_TEST_CODES: "PROMO2026,AMIGOS", COLOREAR_TEST_CODE_MAX_USES: "1", COLOREAR_TEST_CODE_DAILY_CAP: "9" });
    await redeem(h);
    await expect(h.engine.createCheckout(await input({ testCode: "PROMO2026" }), urls)).rejects.toBeInstanceOf(ColorearValidationError);
    await expect(redeem(h, { testCode: "amigos" })).resolves.toBeTruthy(); // another code, its own count
    const [one] = await h.db.orders.find({ payment_provider: TEST_CODE_PROVIDER });
    await h.db.orders.update(one!.id, { status: "cancelled" });
    await expect(redeem(h)).resolves.toBeTruthy(); // the cancelled one freed its place
  });

  it("holds the cap under simultaneous requests: never more than the cap gets through, the rest are cancelled and their photos erased", async () => {
    const h = harness({ COLOREAR_TEST_CODE_DAILY_CAP: "2", COLOREAR_TEST_CODE_MAX_USES: "50" });
    const inputs = await Promise.all([1, 2, 3, 4, 5, 6].map(() => input({ testCode: "PROMO2026" })));
    const res = await Promise.allSettled(inputs.map((i) => h.engine.createCheckout(i, urls)));
    const ok = res.filter((r) => r.status === "fulfilled").length;
    expect(ok).toBeLessThanOrEqual(2);
    for (const r of res) if (r.status === "rejected") expect((r.reason as ColorearValidationError).errors).toEqual({ code: "exhausted" });
    const rows = await h.db.orders.find({ payment_provider: TEST_CODE_PROVIDER });
    expect(rows.filter((o) => o.status === "created")).toHaveLength(ok);
    expect(rows.filter((o) => o.status === "cancelled")).toHaveLength(6 - ok);
    expect(h.uploads.files.size).toBe(2 * ok); // only accepted orders keep their 2 photos
    // after the burst the code still works up to its cap
    const more = await h.engine.createCheckout(await input({ testCode: "PROMO2026" }), urls).then(() => 1, () => 0);
    expect(ok + more).toBeLessThanOrEqual(2);
  });
});

describe("refunds, cleanup and email delivery", () => {
  it("'refund' of a test order cancels and erases it without calling the payment provider, and the email says nothing was charged", async () => {
    const h = harness();
    const { paid } = await redeem(h, { variant: "bundle3" });
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    const c = await h.engine.useCredit(token, { theme: "" });
    if (!c.ok) throw new Error(c.reason);
    const res = await h.engine.refundByLink(token);
    expect(res).toEqual({ refunded: true });
    expect(h.payments.refunds).toHaveLength(0);
    expect((await h.db.orders.get(paid.id))!).toMatchObject({ status: "refunded", refund_amount_minor: 0 });
    expect((await h.db.orders.get(c.orderId))!.status).toBe("cancelled");
    const mail = (h.delivery as MockDeliveryProvider).sent.find((m) => m.kind === "refund")!;
    expect(mail.subject).toBe("Su pedido de prueba fue cancelado");
    expect(mail.text).toMatch(/Pedido de prueba sin costo: no hubo ningún cobro/);
    expect(ev(h, "refunded")[0]!.props).toMatchObject({ amount_usd_cents: 0, test_mode: true });
  });

  it("a failed test book is cancelled by the sweeper path without any provider refund", async () => {
    const h = harness();
    const { paid } = await redeem(h);
    await h.engine.markRefunded((await h.db.orders.get(paid.id))!, "technical_failure", true);
    expect(h.payments.refunds).toHaveLength(0);
    expect((await h.db.orders.get(paid.id))!.status).toBe("refunded");
  });

  it("when the delivery email is refused (Resend in test mode only sends to its owner) the book is still ready and downloadable from the status page", async () => {
    const failing = new FailingDelivery();
    const h = harness({}, failing);
    const { paid } = await redeem(h, { email: "esposa@example.com" });
    expect((await h.engine.runGeneration(paid.id)).status).toBe("done");
    expect(failing.sent.map((m) => m.kind)).toEqual(["receipt", "delivery"]);
    const row = (await h.db.orders.get(paid.id))!;
    expect(row.status).toBe("delivered");
    expect((await h.db.deliveries.find({ order_id: paid.id, kind: "delivery" }))[0]).toMatchObject({ status: "failed", provider: "resend" });
    expect(ev(h, "delivered")[0]!.props).toMatchObject({ channel: "web" }); // the funnel records that it only reached the web
    const st = (await h.engine.getStatus(row.access_token))!;
    expect(st).toMatchObject({ phase: "ready", hasPdf: true });
    const pdf = await h.engine.readPdf(row.access_token);
    expect(pdf).not.toBeNull();
    expect(Buffer.from(pdf!.bytes.slice(0, 5)).toString()).toBe("%PDF-");
    expect(h.engine.verifyDownload(row.access_token, h.engine.signDownload(row.access_token))).toBe(true);
  });
});

describe("emails of a test order (all kinds, both languages)", () => {
  const vars = { names: "A", price: "MX$0.00", statusLink: "s", deliveryLink: "d", refundLink: "r", deleteDate: "2026-01-01", holder: "H", privacyEmail: "p@x.co", supportEmail: "s@x.co", brand: "Pintoria", testOrder: true };
  it("says 'Pedido de prueba sin costo' / 'Test order, no charge' and never shows a price or a refund", () => {
    for (const [lang, phrase] of [["es", "Pedido de prueba sin costo"], ["en", "Test order, no charge"]] as const) {
      for (const kind of ["receipt", "delivery", "refund"] as const) {
        const m = composeColorearMessage(kind, lang, "a@b.co", vars);
        expect(m.subject + m.text).toContain(phrase.split(",")[0]!);
        expect(m.text).not.toContain("MX$0.00");
        expect(m.text).not.toMatch(/Su reembolso de|Your refund of|cobro de|charge of/);
      }
    }
  });
  it("keeps the ordinary emails exactly as they were", () => {
    const m = composeColorearMessage("receipt", "es", "a@b.co", { ...vars, testOrder: false, price: "MX$229" });
    expect(m.text).toMatch(/^Gracias por su compra\. Este correo confirma el cobro de MX\$229 y repite lo que usted autorizó\./);
    expect(m.text).toContain("Para pedir reembolso (hasta 7 días después de la entrega): r");
    expect(composeColorearMessage("refund", "en", "a@b.co", { ...vars, testOrder: false, price: "$12.99" }).subject).toBe("Your refund of $12.99");
  });
});
