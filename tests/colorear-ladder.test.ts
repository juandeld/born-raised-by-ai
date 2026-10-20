import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { COLOREAR, COLOREAR_PRICES, brandConfig, colorearPrice } from "@lumen/config";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { createMemoryDb } from "@lumen/db";
import { COLOREAR_LEGAL_RULES } from "@lumen/legal";
import { MockPaymentProvider } from "@lumen/payments";
import { ColorearEngine, MockImageProvider, TemplateStoryProvider, mentionsBrand, type ColorearCheckoutInput, type ImageProvider, type ImageRequest } from "@lumen/generate";

const photo = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 200, g: 150, b: 120 } } }).jpeg().toBuffer().then((b) => new Uint8Array(b));

class Spy implements ImageProvider {
  readonly name = "mock" as const;
  readonly model = "spy";
  prompts: string[] = [];
  refs: number[] = [];
  inner = new MockImageProvider();
  async render(req: ImageRequest) {
    this.prompts.push(req.prompt);
    this.refs.push(req.refs.length);
    return this.inner.render(req);
  }
}

function harness() {
  const db = createMemoryDb();
  const storage = new MemoryStorage();
  const uploads = new MemoryStorage();
  const delivery = new MockDeliveryProvider();
  const sink = new MemorySink();
  const image = new Spy();
  const payments = new MockPaymentProvider("http://localhost:3000");
  const clock = { now: new Date("2026-11-20T15:00:00Z") };
  const env = { COLOREAR_COUNTRIES: "MX,ES,GB,US", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", LEGAL_ADDRESS: "Calle 1, Guatemala" };
  const engine = new ColorearEngine({
    db, storage, uploads, delivery, image, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => clock.now),
    payments, env, now: () => clock.now, brand: { ...brandConfig(env), brand: "Pintoria" },
  });
  return { engine, db, storage, uploads, delivery, sink, image, payments, clock };
}
type H = ReturnType<typeof harness>;

async function input(over: Partial<ColorearCheckoutInput> = {}): Promise<ColorearCheckoutInput> {
  return {
    lang: "es", country: "MX", email: "mama@example.com",
    persons: [{ name: "Manuela", role: "niña, 6 años" }, { name: "Toby", role: "perro" }],
    photos: [await photo(), await photo()], theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: "203.0.113.7", creative: "x", device: "mobile", ...over,
  };
}
const urls = { successUrl: (o: { access_token: string }) => `http://x/colorear/confirmacion/${o.access_token}`, cancelUrl: "http://x/" };

async function buy(h: H, variant: "single" | "bundle3" = "single", over: Partial<ColorearCheckoutInput> = {}) {
  const { order } = await h.engine.createCheckout(await input({ variant, ...over }), urls);
  return (await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: `pay_${order.id.slice(0, 6)}` }))!;
}
const HOUR = 3_600_000;
const advance = (h: H, ms: number) => { h.clock.now = new Date(h.clock.now.getTime() + ms); };
const charFiles = (h: H, id: string) => [...h.storage.files.keys()].filter((k) => k.startsWith(`colorear/${id}/char-`));

describe("prices and variants", () => {
  it("has the three approved prices in the four currencies, and the Trio is below the price of two", () => {
    expect(COLOREAR_PRICES.US).toEqual({ single: { amountMinor: 1299, currency: "USD" }, bundle3: { amountMinor: 2499, currency: "USD" }, add1: { amountMinor: 949, currency: "USD" } });
    expect(colorearPrice("GB", "bundle3")).toEqual({ amountMinor: 1899, currency: "GBP" });
    expect(colorearPrice("ES", "add1")).toEqual({ amountMinor: 849, currency: "EUR" });
    expect(colorearPrice("MX", "bundle3")).toEqual({ amountMinor: 42900, currency: "MXN" });
    for (const c of ["US", "GB", "ES", "MX"] as const) expect(COLOREAR_PRICES[c].bundle3.amountMinor).toBeLessThan(2 * COLOREAR_PRICES[c].single.amountMinor);
    expect(Object.keys(COLOREAR_PRICES.MX)).not.toContain("bundle5");
  });
  it("keeps the code constants in step with the legal rules", () => {
    expect(COLOREAR.upsellHours).toBe(COLOREAR_LEGAL_RULES.charactersOfferHours);
    expect(COLOREAR.creditDays).toBe(COLOREAR_LEGAL_RULES.creditsValidDays);
    expect(COLOREAR.photoMaxHours).toBe(COLOREAR_LEGAL_RULES.photosMaxHours);
    expect(COLOREAR.retentionDays).toBe(COLOREAR_LEGAL_RULES.bookAndOrderDays);
    expect(COLOREAR.refundWindowDays).toBe(COLOREAR_LEGAL_RULES.refundDays);
    expect(COLOREAR.reminderDaysBefore).toBe(COLOREAR_LEGAL_RULES.bookAndOrderDays - COLOREAR_LEGAL_RULES.reminderDay);
  });
  it("charges the Trio price, opens checkout with the bundle3 variant and rejects unknown options", async () => {
    const h = harness();
    const { order } = await h.engine.createCheckout(await input({ variant: "bundle3" }), urls);
    expect(order).toMatchObject({ variant: "bundle3", amount_minor: 42900, currency: "MXN" });
    expect(h.sink.events.find((e) => e.name === "checkout_started")!.props).toMatchObject({ variant: "bundle3" });
    await expect(h.engine.createCheckout(await input({ variant: "bundle5" as never }), urls)).rejects.toThrow();
  });
});

describe("Trio: 2 extra adventures with 1 click, no photos", () => {
  it("creates each book from the stored characters, never asks for photos, and erases the drawings after the last one", async () => {
    const h = harness();
    const paid = await buy(h, "bundle3");
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    let st = (await h.engine.getStatus(token))!;
    expect(st.credits).toMatchObject({ left: 2, total: 2 });
    expect(st.legal.characters).toMatch(/30|hasta que use/i);
    expect(charFiles(h, paid.id).length).toBe(2);
    expect(h.delivery.sent.find((m) => m.kind === "delivery")!.text).toContain("Le quedan 2 aventuras");

    const callsBefore = h.image.prompts.length;
    const c1 = await h.engine.useCredit(token, { theme: "dinosaurios", themeId: "dinosaurs" });
    expect(c1).toMatchObject({ ok: true, creditsLeft: 1 });
    if (!c1.ok) throw new Error();
    expect(h.uploads.files.size).toBe(0); // no photo anywhere
    expect((await h.engine.runGeneration(c1.orderId)).status).toBe("done");
    // 22 scenes + cover only: the characters were NOT drawn again
    expect(h.image.prompts.length - callsBefore).toBe(COLOREAR.scenes + 1);
    for (const p of h.image.prompts) { expect(p).not.toMatch(/Manuela|Toby/); expect(mentionsBrand(p)).toBe(false); }
    const kid = (await h.db.orders.get(c1.orderId))!;
    expect(kid).toMatchObject({ variant: "credit", amount_minor: 0, status: "delivered", parent_order_id: paid.id });
    expect(charFiles(h, kid.id).length).toBe(0);
    expect((await h.engine.readPdf(kid.access_token))).not.toBeNull();

    st = (await h.engine.getStatus(token))!;
    expect(st.credits?.left).toBe(1);
    expect(st.books).toHaveLength(1);
    const kidStatus = (await h.engine.getStatus(kid.access_token))!;
    expect(kidStatus).toMatchObject({ kind: "credit", phase: "ready", parentToken: token });

    const c2 = await h.engine.useCredit(token, { theme: "" });
    expect(c2).toMatchObject({ ok: true, creditsLeft: 0 });
    // last adventure requested: the parent's drawings are erased at once
    expect(charFiles(h, paid.id).length).toBe(0);
    expect(h.sink.events.some((e) => e.name === "characters_deleted" && (e.props as { reason: string }).reason === "credits_used")).toBe(true);
    expect(await h.engine.useCredit(token, { theme: "" })).toMatchObject({ ok: false });
    expect(h.sink.events.filter((e) => e.name === "credit_used")).toHaveLength(2);
    expect(h.sink.events.filter((e) => e.name === "paid")).toHaveLength(1); // credits are not sales
  });

  it("two simultaneous clicks cannot take more than the credits that are left", async () => {
    const h = harness();
    const paid = await buy(h, "bundle3");
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    const res = await Promise.all([1, 2, 3, 4].map(() => h.engine.useCredit(token, { theme: "" })));
    expect(res.filter((r) => r.ok)).toHaveLength(2);
  });

  it("rejects a brand theme, and a book that cannot be finished gives the credit back", async () => {
    const h = harness();
    const paid = await buy(h, "bundle3");
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    expect(await h.engine.useCredit(token, { theme: "Frozen y Elsa" })).toMatchObject({ ok: false, reason: "invalid_theme" });
    const c = await h.engine.useCredit(token, { theme: "" });
    if (!c.ok) throw new Error();
    const kid = (await h.db.orders.get(c.orderId))!;
    await h.engine.markRefunded(kid, "technical_failure", true);
    expect((await h.db.orders.get(kid.id))!.status).toBe("cancelled");
    expect((await h.engine.getStatus(token))!.credits?.left).toBe(2);
  });

  it("credits and the drawings expire with the 30 days", async () => {
    const h = harness();
    const paid = await buy(h, "bundle3");
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    advance(h, 30 * 24 * HOUR + 1000);
    expect(await h.engine.useCredit(token, { theme: "" })).toMatchObject({ ok: false, reason: "expired" });
    await h.engine.sweep();
    expect(charFiles(h, paid.id)).toHaveLength(0);
    expect((await h.engine.getStatus(token))!.phase).toBe("gone");
  });
});

describe("another adventure (add1), 48 hours, real checkout", () => {
  it("is offered with a signed link, needs payment, reuses the characters and expires", async () => {
    const h = harness();
    const paid = await buy(h);
    await h.engine.runGeneration(paid.id);
    const parent = (await h.db.orders.get(paid.id))!;
    const st = (await h.engine.getStatus(parent.access_token))!;
    expect(st.offer).toMatchObject({ price: "MX$169" });
    expect(st.offer!.payNotice).toMatch(/términos|terminos/i);
    expect(st.legal.characters).toMatch(/dibujos/);
    expect(st.legal.offerTerms).toMatch(/Oferta válida hasta/);
    expect(st.legal.deleteButton).toBe("Borrar mis personajes");
    const mail = h.delivery.sent.find((m) => m.kind === "delivery")!;
    expect(mail.text).toContain("MX$169");
    expect(mail.text).toContain("/api/colorear/baja?t=");
    expect(mail.text).toContain("Calle 1, Guatemala");
    expect(mail.text).not.toMatch(/mismas fotos/i);
    await h.engine.trackUpsellViewed(parent.access_token);
    await h.engine.trackUpsellViewed(parent.access_token);
    expect(h.sink.events.filter((e) => e.name === "upsell_viewed")).toHaveLength(1);

    // wrong or missing signature: no checkout, nothing created
    const before = (await h.db.orders.find()).length;
    expect(await h.engine.createUpsellCheckout(parent.access_token, "1.bad", { theme: "", ip: null }, urls)).toMatchObject({ ok: false });
    expect(await h.engine.createUpsellCheckout(parent.access_token, null, { theme: "", ip: null }, urls)).toMatchObject({ ok: false });
    expect((await h.db.orders.find()).length).toBe(before);

    const res = await h.engine.createUpsellCheckout(parent.access_token, st.offer!.sig, { theme: "piratas", themeId: "pirates", ip: "203.0.113.7" }, urls);
    if (!res.ok) throw new Error(res.reason);
    expect(res.order).toMatchObject({ variant: "add1", amount_minor: 16900, currency: "MXN", status: "created", parent_order_id: paid.id });
    expect(res.checkoutUrl).toContain("/api/mock-pay");
    // not paid yet: nothing is generated and no book exists
    expect((await h.engine.runGeneration(res.order.id)).status).toBe("skipped");
    const kid = (await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: res.order.id, checkoutId: res.order.checkout_id, paymentId: "pay_add" }))!;
    expect(kid.status).toBe("paid");
    // K2 evidence is stored for the new payment
    expect((await h.db.consents.find({ order_id: kid.id })).map((c) => c.checkbox_id)).toEqual(["K2"]);
    expect((await h.engine.runGeneration(kid.id)).status).toBe("done");
    expect(h.uploads.files.size).toBe(0);
    expect(h.delivery.sent.filter((m) => m.kind === "receipt").at(-1)!.text).toContain("MX$169");
    expect(h.sink.events.some((e) => e.name === "upsell_purchased")).toBe(true);
    // the parent's drawings are gone once the adventure is bought (the kid had its own copy), and the offer is closed
    expect(charFiles(h, paid.id)).toHaveLength(0);
    expect((await h.engine.getStatus(parent.access_token))!.offer).toBeNull();
    expect((await h.engine.getStatus(parent.access_token))!.books).toHaveLength(1);
    // its own 7-day refund
    expect(await h.engine.refundByLink(kid.access_token)).toMatchObject({ refunded: true });
    expect(h.payments.refunds.at(-1)!.paymentId).toBe("pay_add");
  });

  it("the 48-hour countdown is real: after it the link is dead and the drawings are erased", async () => {
    const h = harness();
    const paid = await buy(h);
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    const sig = (await h.engine.getStatus(token))!.offer!.sig;
    advance(h, 47 * HOUR);
    expect((await h.engine.getStatus(token))!.offer).not.toBeNull();
    advance(h, 2 * HOUR);
    expect((await h.engine.getStatus(token))!.offer).toBeNull();
    expect(await h.engine.createUpsellCheckout(token, sig, { theme: "", ip: null }, urls)).toMatchObject({ ok: false, reason: "expired" });
    expect(charFiles(h, paid.id).length).toBe(2); // not erased until the sweeper runs
    const out = await h.engine.sweep();
    expect(out.charsErased).toBe(1);
    expect(charFiles(h, paid.id)).toHaveLength(0);
    expect(h.sink.events.filter((e) => e.name === "characters_deleted")).toHaveLength(1);
    // the book stays until day 30
    expect((await h.engine.getStatus(token))!.phase).toBe("ready");
  });

  it("photos stay gone within 24 h and the Trio buyer gets no 48 h offer", async () => {
    const h = harness();
    const paid = await buy(h, "bundle3");
    expect(h.uploads.files.size).toBe(2);
    await h.engine.runGeneration(paid.id);
    expect(h.uploads.files.size).toBe(0);
    expect((await h.engine.getStatus((await h.db.orders.get(paid.id))!.access_token))!.offer).toBeNull();
  });

  it("the delete button erases the drawings at once and ends the offer", async () => {
    const h = harness();
    const paid = await buy(h);
    await h.engine.runGeneration(paid.id);
    const token = (await h.db.orders.get(paid.id))!.access_token;
    const r = await h.engine.deleteMyCharacters(token);
    expect(r.ok).toBe(true);
    expect(r.message).toMatch(/borramos/i);
    expect(charFiles(h, paid.id)).toHaveLength(0);
    const st = (await h.engine.getStatus(token))!;
    expect(st.offer).toBeNull();
    expect(st.legal.deleteButton).toBeNull();
    expect(h.sink.events.some((e) => e.name === "characters_deleted" && (e.props as { reason: string }).reason === "button")).toBe(true);
  });
});

describe("day-25 reminder", () => {
  it("goes out 5 days before the deletion, once, with the delivery link and without provider names", async () => {
    const h = harness();
    const paid = await buy(h);
    await h.engine.runGeneration(paid.id);
    const o = (await h.db.orders.get(paid.id))!;
    advance(h, 24 * 24 * HOUR);
    expect((await h.engine.sweep()).reminded).toBe(0);
    advance(h, 2 * 24 * HOUR); // day 26
    expect((await h.engine.sweep()).reminded).toBe(1);
    expect((await h.engine.sweep()).reminded).toBe(0);
    const mail = h.delivery.sent.filter((m) => m.kind === "reminder");
    expect(mail).toHaveLength(1);
    expect(mail[0]!.subject).toMatch(/se borra el 20\d\d-/);
    expect(mail[0]!.subject).not.toContain("Manuela");
    expect(mail[0]!.text).toContain(`https://www.pintoria.app/colorear/entrega/${o.access_token}`);
    expect(mail[0]!.text).not.toMatch(/openai|anthropic|google|resend|supabase|vercel|polar/i);
    expect(mail[0]!.text).not.toMatch(/mismas fotos/i);
    expect(h.sink.events.filter((e) => e.name === "expiry_reminder_sent")).toHaveLength(1);
  });

  it("reminds unused Trio adventures as a transactional line (no sale) and an unsubscribed buyer gets no offer", async () => {
    const h = harness();
    const trio = await buy(h, "bundle3");
    await h.engine.runGeneration(trio.id);
    const single = await buy(h, "single", { email: "otra@example.com" });
    await h.engine.runGeneration(single.id);
    const sOrder = (await h.db.orders.get(single.id))!;
    const sig = (await import("@lumen/generate")).signLink({ COLOREAR_LINK_SECRET: undefined, PHONE_HASH_SALT: undefined }, "baja", sOrder.access_token, 3600, h.clock.now.getTime());
    expect(await h.engine.unsubscribeOffers(sOrder.access_token, sig)).toBe(true);
    expect(await h.engine.unsubscribeOffers(sOrder.access_token, "1.bad")).toBe(false);
    advance(h, 26 * 24 * HOUR);
    await h.engine.sweep();
    const mails = h.delivery.sent.filter((m) => m.kind === "reminder");
    const tm = mails.find((m) => m.to === "mama@example.com")!;
    expect(tm.text).toMatch(/Le quedan 2 aventuras del Trío/);
    expect(tm.text).not.toMatch(/fotos nuevas aquí/);
    const sm = mails.find((m) => m.to === "otra@example.com")!;
    expect(sm.text).not.toMatch(/ofertas/);
  });
});

describe("Trio refund (D26)", () => {
  it("full refund if only the first adventure was used; unused thirds if more were ordered; none after 7 days", async () => {
    const a = harness();
    const p1 = await buy(a, "bundle3");
    await a.engine.runGeneration(p1.id);
    const t1 = (await a.db.orders.get(p1.id))!.access_token;
    expect(await a.engine.refundByLink(t1)).toMatchObject({ refunded: true });
    expect(a.payments.refunds.at(-1)!.amountMinor).toBeUndefined(); // whole payment
    expect((await a.db.orders.get(p1.id))!.status).toBe("refunded");

    const b = harness();
    const p2 = await buy(b, "bundle3");
    await b.engine.runGeneration(p2.id);
    const t2 = (await b.db.orders.get(p2.id))!.access_token;
    const c = await b.engine.useCredit(t2, { theme: "" });
    if (!c.ok) throw new Error();
    await b.engine.runGeneration(c.orderId);
    expect(await b.engine.refundByLink(t2)).toMatchObject({ refunded: true, reason: "partial" });
    expect(b.payments.refunds.at(-1)!.amountMinor).toBe(Math.ceil(42900 / 3)); // one unused adventure
    const after = (await b.db.orders.get(p2.id))!;
    expect(after.status).toBe("delivered"); // the books already made stay
    expect((await b.engine.getStatus(t2))!.credits).toBeNull();
    expect(await b.engine.useCredit(t2, { theme: "" })).toMatchObject({ ok: false });
    expect(charFiles(b, p2.id)).toHaveLength(0);
    // the provider's refund webhook for that partial refund is not read as a full refund
    await b.engine.handlePaymentEvent({ type: "refunded", orderId: p2.id, checkoutId: null, paymentId: "x" });
    expect((await b.db.orders.get(p2.id))!.status).toBe("delivered");

    const d = harness();
    const p3 = await buy(d, "bundle3");
    await d.engine.runGeneration(p3.id);
    advance(d, 8 * 24 * HOUR);
    expect(await d.engine.refundByLink((await d.db.orders.get(p3.id))!.access_token)).toMatchObject({ refunded: false, reason: "outside_window" });
  });

  it("refunding the Trio cancels its unused adventures and erases everything", async () => {
    const h = harness();
    const p = await buy(h, "bundle3");
    await h.engine.runGeneration(p.id);
    await h.engine.refundByLink((await h.db.orders.get(p.id))!.access_token);
    expect(charFiles(h, p.id)).toHaveLength(0);
    expect([...h.storage.files.keys()].filter((k) => k.includes(p.id) && !k.endsWith("state.json"))).toHaveLength(0);
  });
});
