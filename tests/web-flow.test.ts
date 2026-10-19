import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { signStandardWebhook } from "@lumen/payments";
import { getPreludeTexts, resolveCheckbox } from "@lumen/legal";
import { getLandingCopy, longDate } from "../apps/web/src/lib/landing-copy";

// Client components call useRouter(); there is no app router in a unit test. notFound/redirect keep throwing like Next does.
vi.mock("next/navigation", async (orig) => ({ ...(await orig<typeof import("next/navigation")>()), useRouter: () => ({ refresh() {}, push() {}, replace() {} }) }));

/**
 * End-to-end of the WEB flow in mock mode, calling the same route handlers and pages Next serves:
 * landing render -> form page -> checkout POST -> mock payment -> confirmation -> (webhook idempotency) -> events.
 * The call/delivery part is covered by tests/e2e-mock.test.ts.
 */
const env = process.env as Record<string, string | undefined>;
let M: Awaited<ReturnType<typeof load>>;

async function load() {
  const [landing, comprar, confirm, delivery, priv, checkout, track, mockPay, webhook, engineLib, runCall] = await Promise.all([
    import("../apps/web/src/app/(lang)/[lang]/page"),
    import("../apps/web/src/app/(lang)/[lang]/comprar/page"),
    import("../apps/web/src/app/(lang)/[lang]/confirmacion/[token]/page"),
    import("../apps/web/src/app/(lang)/[lang]/entrega/[token]/page"),
    import("../apps/web/src/app/(lang)/[lang]/privacidad/page"),
    import("../apps/web/src/app/api/checkout/route"),
    import("../apps/web/src/app/api/track/route"),
    import("../apps/web/src/app/api/mock-pay/route"),
    import("../apps/web/src/app/api/webhooks/[provider]/route"),
    import("../apps/web/src/lib/engine"),
    import("../apps/web/src/app/api/dev/run-call/route"),
  ]);
  return { landing, comprar, confirm, delivery, priv, checkout, track, mockPay, webhook, engineLib, runCall };
}

const html = async (el: Promise<unknown> | unknown) => renderToStaticMarkup((await el) as never);
const params = <T extends object>(p: T) => Promise.resolve(p);
const futureDate = () => new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
const ALL = ["C1", "C2", "C3", "C4", "C5", "C6"];

function post(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(`http://localhost:3000${url}`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}
const validBody = () => ({
  slug: "es", country: "MX", variant: "single", email: "Mama@Example.com", phone: "55 1234 5678", childName: "Sofía", childAge: "6",
  details: "Le encanta su perro Max", date: futureDate(), windowStartHour: 18, timezone: "America/Mexico_City", checkboxIds: ALL, creative: "ig-reaction-1",
});

beforeAll(async () => {
  Object.assign(env, {
    DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-web-")), "db.json"), STORAGE_PROVIDER: "memory",
    PAYMENT_PROVIDER: "mock", VOICE_PROVIDER: "mock", TELEPHONY_PROVIDER: "mock", EMAIL_PROVIDER: "mock",
    ENABLED_COUNTRIES: "MX,ES,GB", PHONE_HASH_SALT: "test-salt", PUBLIC_BASE_URL: "http://localhost:3000",
    LEGAL_HOLDER: "Test Holder", POLAR_ACCESS_TOKEN: "polar_test", POLAR_WEBHOOK_SECRET: "whs_test",
  });
  delete env.VERCEL_ENV;
  M = await load();
});

describe("landing pages", () => {
  it("renders the Jinglo v2 Spanish landing with promise, 3 steps, audio, local prices, countdown, AI notes and the FAQ", async () => {
    const out = await html(M.landing.default({ params: params({ lang: "es" }), searchParams: params({}) }));
    expect(out).toContain("Este año, el Polo Norte llama a casa.");
    expect(out).toContain("Cuéntanos de tu peque");
    expect(out).toContain("/audio/jinglo-santa-es.mp3");
    expect(out).toContain("MX$199"); // MXN single price from packages/config
    expect(out).toContain("MX$349");
    expect(out).toContain("Pago único. Sin app. Sin suscripción.");
    expect(out).toContain("/es/comprar?c=MX&amp;v=single");
    expect(out).toContain("Último día para reservar: 22 de diciembre");
    expect(out).toContain("Jinglo, un producto de Lumen Labs");
    expect(out).toContain("generada con inteligencia artificial"); // AI notice at the hero, under the audio, in the FAQ and in the footer
    expect(out.match(/<details/g)).toHaveLength(7);
    expect(out).toMatch(/id="familias" hidden/); // reviews block stays hidden until real reviews exist
    expect(out).toContain("/jinglo/hero.webp");
    expect(out).not.toContain("base64,"); // illustrations are served from /jinglo/*.webp
  });

  it("personalizes the headline and the checkout link with the name typed (?n=)", async () => {
    const out = await html(M.landing.default({ params: params({ lang: "es" }), searchParams: params({ n: "Sofía", cr: "ig-1" }) }));
    expect(out).toContain("Hay una llamada del Polo Norte para Sofía.");
    expect(out).toContain("Reservar la llamada de Sofía · MX$199");
    expect(out).toContain("/es/comprar?c=MX&amp;v=single&amp;cr=ig-1&amp;n=Sof%C3%ADa");
  });

  it("uses euros and Papá Noel in /es-es, pounds and Father Christmas in /en", async () => {
    const es = await html(M.landing.default({ params: params({ lang: "es-es" }), searchParams: params({}) }));
    expect(es).toContain("Papá Noel");
    expect(es).toContain("móvil");
    expect(es).toMatch(/12,99\s*€/);
    const en = await html(M.landing.default({ params: params({ lang: "en" }), searchParams: params({}) }));
    expect(en).toContain("£11.99");
    expect(en).toContain("Father Christmas");
    expect(en).not.toContain("Santa");
    expect(en).toContain("Last day to book: 22 December");
    expect(en).toContain("One payment. No app. No subscription.");
  });

  it("en-US copy says Santa and dates as month first", () => {
    const us = getLandingCopy("en", "US");
    expect(us.h1_0).toContain("North Pole");
    expect(us.santaAlt).toContain("Santa");
    expect(us.who[0]![0]).toBe("Moms and dads");
    expect(longDate("2026-12-22", "en-US")).toBe("December 22");
  });

  it("404s on an unknown language", async () => {
    await expect(M.landing.default({ params: params({ lang: "fr" }), searchParams: params({}) })).rejects.toThrow();
  });
});

describe("form page", () => {
  it("shows the COPPA notice and the six boxes with the exact legal text, and exactly 7 form fields", async () => {
    const out = await html(M.comprar.default({ params: params({ lang: "es" }), searchParams: params({ c: "MX", v: "single" }) }));
    expect(out).toContain("Aviso para madres, padres y tutores");
    expect(out.indexOf("Aviso para madres")).toBeLessThan(out.indexOf('name="C1"')); // notice before the boxes
    const c4 = resolveCheckbox("C4", "es-419", { MARCA: "Jinglo", EMAIL_SOPORTE: "soporte@lumen-labs.co" }).text;
    expect(out).toContain(c4.replace(/'/g, "&#x27;"));
    for (const id of ALL) expect(out).toContain(`name="${id}"`);
    for (const f of ["email", "phone", "childName", "childAge", "details", "date", "window"]) expect(out).toContain(`id="${f}"`);
    expect(out).toContain("+52");
    expect(out).not.toMatch(/\{\{/); // no unfilled legal placeholder
    expect(out).toContain("Ir al pago");
  });

  it("falls back to the single call while the bundle second call is not schedulable", async () => {
    const out = await html(M.comprar.default({ params: params({ lang: "es" }), searchParams: params({ v: "bundle" }) }));
    expect(out).toContain("Una llamada · MX$199");
  });
});

describe("checkout, mock payment and confirmation", () => {
  let token = "";
  let orderId = "";
  let checkoutId = "";

  it("rejects a form without all consent boxes", async () => {
    const res = await M.checkout.POST(post("/api/checkout", { ...validBody(), checkboxIds: ["C1", "C2"] }));
    expect(res.status).toBe(422);
    expect((await res.json()).errors.consent).toBeTruthy();
  });

  it("rejects personal data in the free text and a surname", async () => {
    const res = await M.checkout.POST(post("/api/checkout", { ...validBody(), details: "llámame al 55 1234 5678", childName: "Sofía Pérez López" }));
    expect(res.status).toBe(422);
    const j = await res.json();
    expect(j.errors.details).toBeTruthy();
    expect(j.errors.childName).toBeTruthy();
  });

  it("creates the order and returns the mock payment URL; consent is captured only after payment, with IP and exact text", async () => {
    const res = await M.checkout.POST(post("/api/checkout", validBody(), { "x-forwarded-for": "203.0.113.55, 10.0.0.1", "user-agent": "Mozilla/5.0 (iPhone) Instagram 300" }));
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.url).toContain("/api/mock-pay?order=");
    const u = new URL(j.url);
    orderId = u.searchParams.get("order")!;
    checkoutId = u.searchParams.get("checkout")!;
    const db = M.engineLib.getEngine().deps.db;
    const order = (await db.orders.get(orderId))!;
    expect(order).toMatchObject({ status: "created", phone_e164: "+525512345678", email: "mama@example.com", device: "mobile", creative: "ig-reaction-1", language: "es-419", amount_minor: 19900 });
    expect(await db.consents.find({ order_id: orderId })).toHaveLength(0); // nothing is on record before payment
    token = order.access_token;

    // The confirmation page before the payment lands says "confirming".
    const pending = await html(M.confirm.default({ params: params({ lang: "es", token }) }));
    expect(pending).toContain("Confirmando tu pago");
  });

  it("the mock URL leads to the test payment page; paying schedules the call and stores six consent records", async () => {
    const redirect = await M.mockPay.GET(new Request(`http://localhost:3000/api/mock-pay?order=${orderId}&checkout=${checkoutId}`));
    expect(redirect.status).toBe(303);
    expect(redirect.headers.get("location")).toContain("/pago-prueba?order=");

    const bad = await M.mockPay.POST(post("/api/mock-pay", { order: orderId, checkout: "wrong" }));
    expect(bad.status).toBe(404);

    const res = await M.mockPay.POST(post("/api/mock-pay", { order: orderId, checkout: checkoutId }));
    const j = await res.json();
    expect(j.redirect).toBe(`/es/confirmacion/${token}`);

    const db = M.engineLib.getEngine().deps.db;
    const order = (await db.orders.get(orderId))!;
    expect(order.status).toBe("scheduled");
    const consents = await db.consents.find({ order_id: orderId });
    expect(consents.map((c) => c.checkbox_id).sort()).toEqual(ALL);
    const c4 = consents.find((c) => c.checkbox_id === "C4")!;
    expect(c4.ip).toBe("203.0.113.55");
    expect(c4.text_version_id).toBe("02-C4-es-419-legal-v1.3");
    expect(c4.text_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(Date.now() - new Date(c4.accepted_at).getTime()).toBeLessThan(60_000);
  });

  it("renders the confirmation page with the call window and the test-mode note", async () => {
    const out = await html(M.confirm.default({ params: params({ lang: "es", token }) }));
    expect(out).toContain("Todo listo para Sofía");
    expect(out).toContain("Santa llamará entre");
    expect(out).toContain("Pedido de prueba");
    expect(out).toContain(`/es/reembolso/${token}`);
  });

  it("a signed Polar webhook for the same order is idempotent", async () => {
    const body = JSON.stringify({ type: "order.paid", data: { id: "ord_1", checkout_id: checkoutId, metadata: { order_id: orderId } } });
    const ts = String(Math.floor(Date.now() / 1000));
    const headers = { "webhook-id": "evt_1", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(Buffer.from("whs_test"), "evt_1", ts, body) };
    const ok = await M.webhook.POST(new Request("http://localhost:3000/api/webhooks/polar", { method: "POST", headers, body }), { params: params({ provider: "polar" }) });
    expect(ok.status).toBe(200);
    const bad = await M.webhook.POST(new Request("http://localhost:3000/api/webhooks/polar", { method: "POST", headers: { ...headers, "webhook-signature": "v1,AAAA" }, body }), { params: params({ provider: "polar" }) });
    expect(bad.status).toBe(400);
    const db = M.engineLib.getEngine().deps.db;
    expect(await db.consents.find({ order_id: orderId })).toHaveLength(6); // not duplicated
  });

  it("delivery page: pending before the call, then MP3, certificate, share and survey after the (mock) call", async () => {
    const before = await html(M.delivery.default({ params: params({ lang: "es", token }) }));
    expect(before).toContain("Tu recuerdo aún no está listo");

    const run = await M.runCall.POST(post("/api/dev/run-call", { token }));
    expect((await run.json()).outcome).toBe("placed");

    const after = await html(M.delivery.default({ params: params({ lang: "es", token }) }));
    expect(after).toContain("La llamada de Santa a Sofía");
    expect(after).toContain(`/api/entrega/${token}/mp3`);
    expect(after).toContain(`/api/entrega/${token}/pdf`);
    expect(after).toContain("https://wa.me/?text=");
    expect(after).not.toContain(token + "&"); // the private link is never put in the share text
    expect(after).toContain("¿Cómo les fue?");
  });

  it("funnel events were written at every step", async () => {
    await M.track.POST(post("/api/track", { event: "landing_view", slug: "es", country: "MX", creative: "ig-reaction-1" }, { "user-agent": "iPhone Mobile" }));
    await M.track.POST(post("/api/track", { event: "form_started", slug: "es", country: "MX", creative: "ig-reaction-1" }));
    const bad = await M.track.POST(post("/api/track", { event: "paid", slug: "es", country: "MX" }));
    expect(bad.status).toBe(400); // the browser cannot forge server-side events
    const events = await M.engineLib.getEngine().deps.db.events.find({});
    const names = new Set(events.map((e) => e.name));
    for (const n of ["landing_view", "form_started", "consent_given", "checkout_started", "paid", "call_scheduled", "call_started", "call_completed", "delivered"]) expect(names.has(n), n).toBe(true);
    // No personal data in any event.
    const dump = JSON.stringify(events);
    expect(dump).not.toMatch(/mama@example|5512345678|Sof/i);
  });
});

describe("privacy page", () => {
  it("renders the approved policy with the holder filled and without internal notes", async () => {
    const out = await html(M.priv.default({ params: params({ lang: "es" }) }));
    expect(out).toContain("Política de privacidad de Jinglo");
    expect(out).toContain("Test Holder");
    expect(out).not.toContain("no verificado");
  });
});

describe("prelude texts used by the pages are the legal ones", () => {
  it("GB buyers get the Santa prelude block", () => {
    expect(getPreludeTexts("santa", "en-US").firstLine).toContain("I'm Santa");
  });
});

describe("production guards", () => {
  it("mock payments, the mock webhook and the dev route are closed on the live deployment", async () => {
    env.VERCEL_ENV = "production";
    try {
      expect((await M.mockPay.POST(post("/api/mock-pay", { order: "x", checkout: "y" }))).status).toBe(404);
      expect((await M.mockPay.GET(new Request("http://localhost:3000/api/mock-pay?order=x"))).status).toBe(404);
      expect((await M.runCall.POST(post("/api/dev/run-call", { token: "x" }))).status).toBe(404);
      expect((await M.webhook.POST(new Request("http://localhost:3000/api/webhooks/mock", { method: "POST", body: "{}" }), { params: params({ provider: "mock" }) })).status).toBe(404);
      // Legal holder / address / date missing: the checkout stays closed.
      delete env.LEGAL_ADDRESS;
      expect((await M.checkout.POST(post("/api/checkout", validBody()))).status).toBe(503);
    } finally {
      delete env.VERCEL_ENV;
    }
  });

  it("the bundle is refused while its second call cannot be scheduled", async () => {
    const res = await M.checkout.POST(post("/api/checkout", { ...validBody(), variant: "bundle" }));
    expect(res.status).toBe(422);
  });
});
