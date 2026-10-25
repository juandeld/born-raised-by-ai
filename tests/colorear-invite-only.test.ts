import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Children, cloneElement, createElement, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { colorearInviteOnly, colorearMockPayAllowed } from "@lumen/config";
import { pixelBomb } from "./png-bomb";

/**
 * QA round of 25-oct, F1 (and F5, F7, F8, F9, F10 at the web layer): production runs on the mock payment provider, which would let anyone "pay"
 * for free and get a real book. Colorear has its own switch, COLOREAR_ALLOW_MOCK_PAY: closed on the live deployment, so only a valid test code opens
 * an order. Santa keeps following ALLOW_MOCK_PAYMENTS.
 */
const env = process.env as Record<string, string | undefined>;
type Mod<T extends string> = T extends "checkout" ? typeof import("../apps/web/src/server/api/colorear-checkout") : never;
let checkout: Mod<"checkout">;
let mockPay: typeof import("../apps/web/src/server/api/mock-pay");
let webhook: typeof import("../apps/web/src/server/api/webhooks-provider");
let health: typeof import("../apps/web/src/server/api/health");
let lib: typeof import("../apps/web/src/lib/colorear");
const kicked: string[] = [];
const CODE = "k7Qp-2xWm-9RtZ";

const jpeg = () => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 120, g: 160, b: 200 } } }).jpeg().toBuffer();
async function form(over: Record<string, string> = {}, photos: "ok" | "garbage" | "bomb" = "ok") {
  const fd = new FormData();
  const base: Record<string, string> = { lang: "es", country: "MX", variant: "single", email: "esposa@example.com", age: "5", theme: "el espacio", themeId: "space", creative: "wa", checkboxIds: JSON.stringify(["K1", "K2"]), name1: "Manuela", roleId1: "protagonist_girl", name2: "Toby", roleId2: "dog", ...over };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  const bytes = async (i: number) => (photos === "garbage" ? new TextEncoder().encode("this is not an image at all") : photos === "bomb" && i === 2 ? pixelBomb() : new Uint8Array(await jpeg()));
  fd.set("photo1", new File([new Uint8Array(await bytes(1))], "p1.jpg", { type: "image/jpeg" }));
  fd.set("photo2", new File([new Uint8Array(await bytes(2))], "p2.jpg", { type: "image/jpeg" }));
  return fd;
}
let n = 0;
const send = (fd: FormData) => checkout.POST(new Request("http://localhost:3000/api/colorear/checkout", { method: "POST", body: fd, headers: { "x-forwarded-for": `198.51.100.${++n}` } }));
const orders = () => lib.getColorear().d.db.orders.find({ product: "colorear" });
const uploads = () => (lib.getColorear().d.uploads as unknown as { files: Map<string, unknown> }).files;

/** Server components CHeader and CFooter are async; React's static renderer cannot wait for them, so they are resolved first. */
async function resolve(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolve));
  if (!isValidElement(node)) return node;
  const el = node as { type: unknown; props: Record<string, unknown> };
  if (typeof el.type === "function" && /^C(Header|Footer)$/.test((el.type as { name: string }).name)) return resolve(await (el.type as (p: unknown) => Promise<ReactNode>)(el.props));
  if (el.props.children === undefined) return node;
  const kids = await Promise.all(Children.toArray(el.props.children as ReactNode).map(resolve));
  return cloneElement(node, undefined, ...kids);
}
const render = async (node: ReactNode) => renderToStaticMarkup((await resolve(node)) as never);

const live = () => { env.VERCEL_ENV = "production"; delete env.COLOREAR_ALLOW_MOCK_PAY; delete env.ALLOW_MOCK_PAYMENTS; };
const dev = () => { delete env.VERCEL_ENV; delete env.COLOREAR_ALLOW_MOCK_PAY; delete env.ALLOW_MOCK_PAYMENTS; };

beforeAll(async () => {
  Object.assign(env, {
    DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-invite-")), "db.json"), STORAGE_PROVIDER: "memory",
    PAYMENT_PROVIDER: "mock", EMAIL_PROVIDER: "mock", IMAGE_PROVIDER: "mock", COLOREAR_COUNTRIES: "MX,ES,GB,US", PHONE_HASH_SALT: "a-long-random-salt-for-tests-0123456789",
    PUBLIC_BASE_URL: "http://localhost:3000", COLOREAR_PUBLIC_URL: "https://www.pintoria.app", COLOREAR_TEST_CODES: CODE,
    COLOREAR_TEST_CODE_MAX_USES: "50", COLOREAR_TEST_CODE_DAILY_CAP: "50", LEGAL_HOLDER: "Titular de Prueba", LEGAL_ADDRESS: "Calle 1, Guatemala", LEGAL_EFFECTIVE_DATE: "2026-10-25",
    CRON_SECRET: "cron-secret-for-tests-0123456789",
  });
  dev();
  vi.doMock("next/headers", () => ({ headers: async () => new Headers({ "x-pintoria": "1" }) }));
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (String(url).endsWith("/api/colorear/run")) kicked.push(JSON.parse(String(init?.body)).orderId);
    return new Response("{}", { status: 202 });
  }));
  checkout = await import("../apps/web/src/server/api/colorear-checkout");
  mockPay = await import("../apps/web/src/server/api/mock-pay");
  webhook = await import("../apps/web/src/server/api/webhooks-provider");
  health = await import("../apps/web/src/server/api/health");
  lib = await import("../apps/web/src/lib/colorear");
});
afterAll(() => {
  vi.unstubAllGlobals();
  vi.doUnmock("next/headers");
  dev();
});
afterEach(() => vi.restoreAllMocks());

describe("the switch", () => {
  it("colorearMockPayAllowed: open outside production, closed on the live deployment, opened or closed explicitly", () => {
    expect(colorearMockPayAllowed({})).toBe(true);
    expect(colorearMockPayAllowed({ VERCEL_ENV: "preview" })).toBe(true);
    expect(colorearMockPayAllowed({ VERCEL_ENV: "production" })).toBe(false);
    expect(colorearMockPayAllowed({ VERCEL_ENV: "production", ALLOW_MOCK_PAYMENTS: "1" })).toBe(false); // Santa's switch does not open colorear
    expect(colorearMockPayAllowed({ VERCEL_ENV: "production", COLOREAR_ALLOW_MOCK_PAY: "1" })).toBe(true);
    expect(colorearMockPayAllowed({ VERCEL_ENV: "production", COLOREAR_ALLOW_MOCK_PAY: "true" })).toBe(true);
    expect(colorearMockPayAllowed({ COLOREAR_ALLOW_MOCK_PAY: "0" })).toBe(false);
    expect(colorearMockPayAllowed({ COLOREAR_ALLOW_MOCK_PAY: "false" })).toBe(false);
    expect(colorearMockPayAllowed({ VERCEL_ENV: "production", COLOREAR_ALLOW_MOCK_PAY: "yes" })).toBe(false); // anything else keeps the default
  });
  it("colorearInviteOnly: only the mock provider with mock payments closed", () => {
    expect(colorearInviteOnly({ VERCEL_ENV: "production" })).toBe(true);
    expect(colorearInviteOnly({ VERCEL_ENV: "production", PAYMENT_PROVIDER: "mock" })).toBe(true);
    expect(colorearInviteOnly({ VERCEL_ENV: "production", PAYMENT_PROVIDER: "polar" })).toBe(false);
    expect(colorearInviteOnly({ VERCEL_ENV: "production", COLOREAR_ALLOW_MOCK_PAY: "1" })).toBe(false);
    expect(colorearInviteOnly({})).toBe(false);
  });
});

describe("live deployment on the mock provider (COLOREAR_ALLOW_MOCK_PAY unset)", () => {
  let orderId = "";
  let checkoutId = "";
  let token = "";

  it("outside production an ordinary order (no code) still goes to the test payment page", async () => {
    dev();
    const res = await send(await form());
    expect(res.status).toBe(200);
    const url = new URL(((await res.json()) as { url: string }).url);
    expect(url.pathname).toBe("/api/mock-pay");
    orderId = url.searchParams.get("order")!;
    checkoutId = url.searchParams.get("checkout")!;
    const o = (await lib.getColorear().d.db.orders.get(orderId))!;
    token = o.access_token;
    expect(o).toMatchObject({ status: "created", payment_provider: "mock", test_mode: true });
  });

  it("a request without a code is refused at once: 403 code=required, before any photo is read, re-encoded or stored", async () => {
    live();
    const spy = vi.spyOn(Blob.prototype, "arrayBuffer");
    const ordersBefore = (await orders()).length;
    const filesBefore = uploads().size;
    // the photos are not even images: had they been looked at first, the answer would be "photos", not "code"
    const res = await send(await form({}, "garbage"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ ok: false, errors: { code: "required" } });
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
    expect(await orders()).toHaveLength(ordersBefore);
    expect(uploads().size).toBe(filesBefore);
    expect(kicked).toHaveLength(0);
    // a blank or spaces-only code is no code
    expect((await send(await form({ code: "   " }))).status).toBe(403);
    // the same request with a good code does read the photos
    expect((await send(await form({ code: CODE }))).status).toBe(200);
    expect(spy).toHaveBeenCalled();
  });

  it("the engine itself refuses first too (any caller, not only the route)", async () => {
    live();
    const err = await lib.getColorear().createCheckout(
      { lang: "es", country: "MX", email: "a@b.co", persons: [], photos: [new Uint8Array([1, 2, 3])], theme: "", age: 5, checkboxIds: [], ip: null },
      { successUrl: () => "x", cancelUrl: "y" },
    ).catch((e) => e);
    expect((err as { errors: unknown }).errors).toEqual({ code: "required" });
  });

  it("a wrong code is 'invalid', a good one (any case, spaces) opens the order with no payment and starts the book", async () => {
    live();
    const bad = await send(await form({ code: "nope" }));
    expect(bad.status).toBe(422);
    expect(await bad.json()).toEqual({ ok: false, errors: { code: "invalid" } });
    const before = (await orders()).length;
    const ok = await send(await form({ code: ` ${CODE.toLowerCase()} ` }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toMatchObject({ ok: true, testCode: true });
    expect(await orders()).toHaveLength(before + 1);
    const created = (await orders()).filter((o) => o.payment_provider === "test_code");
    expect(created.length).toBeGreaterThan(0);
    for (const o of created) {
      expect(o).toMatchObject({ status: "paid", amount_minor: 0, test_mode: true });
      expect(kicked).toContain(o.id); // the run was started
    }
  });

  it("/api/mock-pay answers 404 to a colorear order (GET and POST) and the order stays unpaid", async () => {
    live();
    const get = await mockPay.GET(new Request(`http://localhost:3000/api/mock-pay?order=${orderId}&checkout=${checkoutId}`));
    expect(get.status).toBe(404);
    const post = await mockPay.POST(new Request("http://localhost:3000/api/mock-pay", { method: "POST", body: JSON.stringify({ order: orderId, checkout: checkoutId, outcome: "success" }) }));
    expect(post.status).toBe(404);
    expect((await lib.getColorear().d.db.orders.get(orderId))!.status).toBe("created");
  });

  it("Santa's ALLOW_MOCK_PAYMENTS=1 does not open it: mock-pay and the mock webhook still refuse a colorear order, while Santa's own path stays open", async () => {
    live();
    env.ALLOW_MOCK_PAYMENTS = "1";
    const get = await mockPay.GET(new Request(`http://localhost:3000/api/mock-pay?order=${orderId}&checkout=${checkoutId}`));
    expect(get.status).toBe(404);
    const post = await mockPay.POST(new Request("http://localhost:3000/api/mock-pay", { method: "POST", body: JSON.stringify({ order: orderId, checkout: checkoutId }) }));
    expect(post.status).toBe(404);
    const hook = await webhook.POST(
      new Request("http://localhost:3000/api/webhooks/mock", { method: "POST", body: JSON.stringify({ type: "payment_succeeded", orderId, checkoutId }) }),
      { params: Promise.resolve({ provider: "mock" }) },
    );
    expect(hook.status).toBe(404);
    expect((await lib.getColorear().d.db.orders.get(orderId))!.status).toBe("created");
    // Santa: an order that is not colorear's goes through the same gate as before
    const santa = await mockPay.GET(new Request("http://localhost:3000/api/mock-pay?order=santa-order&checkout=c"));
    expect(santa.status).toBe(303);
    expect(santa.headers.get("location")).toBe("http://localhost:3000/pago-prueba?order=santa-order&checkout=c");
    const santaHook = await webhook.POST(
      new Request("http://localhost:3000/api/webhooks/mock", { method: "POST", body: JSON.stringify({ type: "payment_succeeded", orderId: "santa-order", checkoutId: "c" }) }),
      { params: Promise.resolve({ provider: "mock" }) },
    );
    expect(santaHook.status).toBe(200);
  });

  it("the mock webhook is closed with both switches closed", async () => {
    live();
    const hook = await webhook.POST(
      new Request("http://localhost:3000/api/webhooks/mock", { method: "POST", body: JSON.stringify({ type: "payment_succeeded", orderId, checkoutId }) }),
      { params: Promise.resolve({ provider: "mock" }) },
    );
    expect(hook.status).toBe(404);
    expect((await lib.getColorear().d.db.orders.get(orderId))!.status).toBe("created");
  });

  it("defense in depth: even a payment event that reaches the engine does not pay an order opened through the mock provider", async () => {
    live();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const out = await lib.getColorear().handlePaymentEvent({ type: "payment_succeeded", orderId, checkoutId, paymentId: "forged" });
    expect(out!.status).toBe("created");
    expect((await lib.getColorear().d.db.orders.get(orderId))!.status).toBe("created");
    expect(await lib.getColorear().d.db.consents.find({ order_id: orderId })).toHaveLength(0);
  });

  it("COLOREAR_ALLOW_MOCK_PAY=1 reopens it for colorear: the test payment page is Pintoria's, on COLOREAR_PUBLIC_URL, and paying works", async () => {
    live();
    env.COLOREAR_ALLOW_MOCK_PAY = "1";
    const get = await mockPay.GET(new Request(`http://localhost:3000/api/mock-pay?order=${orderId}&checkout=${checkoutId}`));
    expect(get.status).toBe(303);
    expect(get.headers.get("location")).toBe(`https://www.pintoria.app/colorear/pago-prueba?order=${orderId}&checkout=${checkoutId}`);
    // and a no-code order is accepted again, going to the test payment
    const res = await send(await form());
    expect(res.status).toBe(200);
    expect(((await res.json()) as { url: string }).url).toContain("/api/mock-pay");
    const post = await mockPay.POST(new Request("http://localhost:3000/api/mock-pay", { method: "POST", body: JSON.stringify({ order: orderId, checkout: checkoutId, outcome: "success" }) }));
    expect(post.status).toBe(200);
    expect(await post.json()).toEqual({ ok: true, redirect: `/colorear/confirmacion/${token}` });
    expect((await lib.getColorear().d.db.orders.get(orderId))!.status).toBe("paid");
  });

  it("COLOREAR_ALLOW_MOCK_PAY=0 closes it outside production too", async () => {
    dev();
    env.COLOREAR_ALLOW_MOCK_PAY = "0";
    const res = await send(await form());
    expect(res.status).toBe(403);
    dev();
  });
});

describe("pages", () => {
  const isNotFound = (e: unknown) => /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/.test(String((e as { digest?: string }).digest ?? e));

  it("/colorear/pago-prueba is Pintoria's page (no Jinglo anywhere), 404 on the live deployment", async () => {
    const Page = (await import("../apps/web/src/app/(colorear)/colorear/pago-prueba/page")).default;
    dev();
    const html = await render(await Page({ searchParams: Promise.resolve({ order: "o1", checkout: "c1" }) }));
    expect(html).toContain("Pago de prueba");
    expect(html).toContain("Pintoria");
    expect(html).not.toMatch(/jinglo/i);
    live();
    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toSatisfy(isNotFound);
    env.COLOREAR_ALLOW_MOCK_PAY = "1";
    await expect(Page({ searchParams: Promise.resolve({}) })).resolves.toBeTruthy();
    dev();
  });

  it("Santa's /pago-prueba never serves a colorear order (it would show the Jinglo brand)", async () => {
    dev();
    const Santa = (await import("../apps/web/src/app/(misc)/pago-prueba/page")).default;
    const res = await send(await form());
    const url = new URL(((await res.json()) as { url: string }).url);
    await expect(Santa({ searchParams: Promise.resolve({ order: url.searchParams.get("order")!, checkout: url.searchParams.get("checkout")! }) })).rejects.toSatisfy(isNotFound);
    await expect(Santa({ searchParams: Promise.resolve({ order: "santa-1" }) })).resolves.toBeTruthy();
  });

  it("on a Pintoria host /pago-prueba is not served (it is Santa's), and the colorear one is", async () => {
    const { colorearRewrite } = await import("../apps/web/src/lib/colorear-host");
    expect(colorearRewrite("/pago-prueba")).toBe("/colorear/not-found");
    expect(colorearRewrite("/colorear/pago-prueba")).toBe("/colorear/pago-prueba");
    expect(colorearRewrite("/api/mock-pay")).toBe("/api/mock-pay");
  });

  it("the live landing in invitation-only mode opens the code box with the invitation message, in both languages, and shows no price button", async () => {
    live();
    const Landing = (await import("../apps/web/src/app/(colorear)/colorear/[lang]/page")).default;
    for (const [lang, invite, button, pay] of [
      ["es", "Por ahora Pintoria solo está abierta con código de invitación", "Usar mi código y crear el libro", "Pagar MX$"],
      ["en", "For now Pintoria is open by invitation code only", "Use my code and create the book", "Pay MX$"],
    ] as const) {
      const html = await render(await Landing({ params: Promise.resolve({ lang }), searchParams: Promise.resolve({}) }));
      expect(html, lang).toContain(invite);
      expect(html, lang).toMatch(/<details[^>]*open/);
      expect(html, lang).toContain(button);
      expect(html, lang).not.toContain(pay);
      expect(html, lang).not.toMatch(/jinglo/i);
    }
    dev();
    const open = await render(await Landing({ params: Promise.resolve({ lang: "es" }), searchParams: Promise.resolve({}) }));
    expect(open).not.toContain("solo está abierta con código de invitación");
  }, 30_000);

  it("the form in invitation-only mode: code field open, message, 'code' wording of the notice, no refund line (es and en)", async () => {
    const { ColorearForm } = await import("../apps/web/src/components/colorear/ColorearForm");
    const legal = { country: "MX", label: "México", prices: { single: "MX$229", bundle3: "MX$429", threeSingles: "MX$687" }, trioLine: "t", trioRefundLine: "REEMBOLSO-TRIO", emailLine: "e", checkboxes: [{ id: "K1", text: "k1" }, { id: "K2", text: "Al pagar, acepto" }], aviso: { title: "a", intro: "i", sections: [], privacyLink: "p: x" }, refundLine: "REEMBOLSO", code: { payNotice: "Al usar el código, acepto", aviso: { title: "a", intro: "intro código", sections: [], privacyLink: "p: x" } } };
    const html = renderToStaticMarkup(createElement(ColorearForm, { lang: "es", countries: { MX: legal }, defaultCountry: "MX", themes: [], creative: "x", codeEnabled: true, inviteOnly: true }));
    expect(html).toMatch(/<details[^>]*open/);
    expect(html).toContain("Por ahora Pintoria solo está abierta con código de invitación");
    expect(html).toContain("Al usar el código, acepto");
    expect(html).not.toContain("Al pagar, acepto");
    expect(html).not.toContain("REEMBOLSO");
    expect(html).toContain("Usar mi código y crear el libro");
    const en = renderToStaticMarkup(createElement(ColorearForm, { lang: "en", countries: { MX: legal }, defaultCountry: "MX", themes: [], creative: "x", codeEnabled: false, inviteOnly: true }));
    expect(en).toContain("For now Pintoria is open by invitation code only");
    expect(en).toContain("Use my code and create the book");
  });
});

describe("F7: /api/health", () => {
  it("is just {ok:true} for the public: no provider, no model, no hint of the payment mode", async () => {
    const res = await health.GET(new Request("http://localhost:3000/api/health"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const wrong = await health.GET(new Request("http://localhost:3000/api/health", { headers: { authorization: "Bearer nope" } }));
    expect(await wrong.json()).toEqual({ ok: true });
  });
  it("with the CRON_SECRET (Authorization: Bearer, or x-cron-secret) it lists the active providers, for the deploy checklist", async () => {
    for (const headers of [{ authorization: `Bearer ${env.CRON_SECRET}` }, { "x-cron-secret": env.CRON_SECRET! }] as Array<Record<string, string>>) {
      const body = (await (await health.GET(new Request("http://localhost:3000/api/health", { headers }))).json()) as { providers?: { payments: string }; colorear?: { image: string } };
      expect(body.providers?.payments).toBe("mock");
      expect(body.colorear?.image).toBeTruthy();
    }
  });
});

describe("F5 and F10 at the checkout route", () => {
  it("a pixel bomb among the photos answers 422 'Unreadable photo' quickly and stores nothing", async () => {
    dev();
    const before = (await orders()).length;
    const filesBefore = uploads().size;
    const t0 = Date.now();
    const res = await send(await form({}, "bomb"));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, errors: { photos: "Unreadable photo" } });
    expect(Date.now() - t0).toBeLessThan(3000);
    expect(await orders()).toHaveLength(before);
    expect(uploads().size).toBe(filesBefore);
  });

  it("recognizes a validation error by its shape too: another copy of the class (next dev) is a 422, not a 500", async () => {
    dev();
    vi.spyOn(lib.getColorear(), "createCheckout").mockRejectedValue(Object.assign(new Error("Invalid colorear checkout: code"), { errors: { code: "invalid" } }));
    const res = await send(await form({ code: "x" }));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, errors: { code: "invalid" } });
    vi.restoreAllMocks();
    vi.spyOn(lib.getColorear(), "createCheckout").mockRejectedValue(new Error("db down"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect((await send(await form())).status).toBe(500); // a real failure is still a 500
  });
});

describe("F9: an order that was never charged is cancelled, not refunded", () => {
  async function renderRefund(tokenValue: string) {
    const Page = (await import("../apps/web/src/app/(colorear)/colorear/reembolso/[token]/page")).default;
    return render(await Page({ params: Promise.resolve({ token: tokenValue }) }));
  }

  it("refund page and delivery link of a test-code order say 'Cancelar y borrar mi pedido' (es) / 'Cancel and delete my order' (en); a paid order keeps the refund wording", async () => {
    dev();
    const engine = lib.getColorear();
    for (const [lang, testWords, notWords, paidWords] of [
      ["es", "Cancelar y borrar mi pedido", /Devolvemos todo el pago|Reembols/, "Devolvemos todo el pago"],
      ["en", "Cancel and delete my order", /We return the whole payment|Refund/, "We return the whole payment"],
    ] as const) {
      const res = await send(await form({ lang, country: lang === "en" ? "US" : "MX", code: CODE }));
      expect(res.status).toBe(200);
      const code = (await orders()).filter((o) => o.payment_provider === "test_code").at(-1)!;
      expect((await engine.runGeneration(code.id)).status).toBe("done");
      const refundPage = await renderRefund(code.access_token);
      expect(refundPage, `${lang} test refund page`).toContain(testWords);
      expect(refundPage, `${lang} test refund page`).not.toMatch(notWords);
      expect(refundPage).not.toMatch(/jinglo/i);

      // the delivery screen (client component fed with the real status)
      const { StatusView } = await import("../apps/web/src/components/colorear/StatusView");
      const st = (await engine.getStatus(code.access_token))!;
      expect(st.testMode).toBe(true);
      const delivery = renderToStaticMarkup(createElement(StatusView, { token: code.access_token, initial: st as never }));
      expect(delivery, `${lang} delivery`).toContain(testWords);
      expect(delivery, `${lang} delivery`).not.toMatch(lang === "es" ? /Pedir reembolso/ : /Request a refund/);

      // the same order as a real, paid one (not test mode): the refund wording stays
      await engine.d.db.orders.update(code.id, { test_mode: false });
      const paidPage = await renderRefund(code.access_token);
      expect(paidPage, `${lang} paid refund page`).toContain(paidWords);
      expect(paidPage).not.toContain(testWords);
      const paidDelivery = renderToStaticMarkup(createElement(StatusView, { token: code.access_token, initial: (await engine.getStatus(code.access_token))! as never }));
      expect(paidDelivery).toContain(lang === "es" ? "Pedir reembolso" : "Request a refund");
    }
  }, 60_000);

  it("a cancelled test order says 'Pedido cancelado' and that nothing was charged", async () => {
    const { COLOREAR_COPY } = await import("../apps/web/src/lib/colorear-copy");
    for (const lang of ["es", "en"] as const) {
      const nc = COLOREAR_COPY[lang].noCharge;
      const words: string[] = [];
      JSON.stringify(nc, (_k, v) => { if (typeof v === "string") words.push(v); return v; });
      expect(words.length).toBeGreaterThan(8);
      for (const w of words) expect(w).not.toMatch(/devolv|reembols|refund|returned the payment|return the whole/i);
      expect(nc.refunded.title).toMatch(/cancel/i);
      expect(nc.refunded.text).toMatch(/cobr|charged/i);
    }
  });
});
