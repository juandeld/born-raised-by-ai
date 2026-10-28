import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { checkProductMap, polarCatalog, reconcile, webhookKeys, MockPaymentProvider, PolarPaymentProvider, RecurrentePaymentProvider, convertForProvider, createPaymentProvider, signStandardWebhook, verifyStandardWebhook } from "./index";

const checkout = { orderId: "o1", productSlug: "santa", variant: "single" as const, country: "MX" as const, productName: "Santa", amountMinor: 19900, currency: "MXN" as const, customerEmail: "a@b.co", successUrl: "https://x/ok", cancelUrl: "https://x/no", testMode: true };

describe("payment providers", () => {
  it("defaults to mock", () => {
    expect(createPaymentProvider({}).name).toBe("mock");
    // Without keys: mock outside production, hard error in production.
    expect(createPaymentProvider({ PAYMENT_PROVIDER: "polar" }).name).toBe("mock");
    expect(() => createPaymentProvider({ PAYMENT_PROVIDER: "polar", VERCEL_ENV: "production" })).toThrow(/POLAR_ACCESS_TOKEN/);
    expect(() => createPaymentProvider({ PAYMENT_PROVIDER: "recurrente", PAYMENT_STRICT: "1" })).toThrow(/RECURRENTE/);
    expect(createPaymentProvider({ PAYMENT_PROVIDER: "polar", POLAR_ACCESS_TOKEN: "t", POLAR_WEBHOOK_SECRET: "s" }).name).toBe("polar");
  });

  it("standard webhook signature: valid, tampered, expired", () => {
    const key = Buffer.from("secret");
    const sig = signStandardWebhook(key, "id1", "1700000000", "{}");
    const base = { key, id: "id1", timestamp: "1700000000", signatureHeader: sig, body: "{}", now: () => 1700000100_000 };
    expect(verifyStandardWebhook(base)).toBe(true);
    expect(verifyStandardWebhook({ ...base, body: "{ }" })).toBe(false);
    expect(verifyStandardWebhook({ ...base, now: () => 1700009999_000 })).toBe(false);
    expect(verifyStandardWebhook({ ...base, signatureHeader: undefined })).toBe(false);
  });

  it("Polar: creates a checkout from the product map, never sends child data, verifies webhooks", async () => {
    const calls: Array<{ url: string; body: any }> = [];
    const fetchFn = (async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return new Response(JSON.stringify({ id: "chk_1", url: "https://polar/pay" }), { status: 200 });
    }) as unknown as typeof fetch;
    const polar = new PolarPaymentProvider({ accessToken: "t", webhookSecret: "whs", productMap: { "santa:MX:single": "prod-uuid" }, server: "sandbox" }, fetchFn);
    const s = await polar.createCheckout(checkout);
    expect(s).toEqual({ provider: "polar", checkoutId: "chk_1", url: "https://polar/pay" });
    expect(calls[0]!.url).toContain("sandbox-api.polar.sh");
    expect(calls[0]!.body.products).toEqual(["prod-uuid"]);
    expect(calls[0]!.body.metadata).toEqual({ order_id: "o1" });
    expect(calls[0]!.body.currency).toBe(checkout.currency.toLowerCase());
    await polar.createCheckout({ ...checkout, currency: "GBP" });
    expect(calls[1]!.body.currency).toBe("gbp");
    await expect(polar.createCheckout({ ...checkout, country: "ES" })).rejects.toThrow(/POLAR_PRODUCT_MAP/);

    const body = JSON.stringify({ type: "order.paid", data: { id: "ord_9", checkout_id: "chk_1", metadata: { order_id: "o1" } } });
    const ts = String(Math.floor(Date.now() / 1000));
    const headers = { "webhook-id": "m1", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(Buffer.from("whs"), "m1", ts, body) };
    expect(await polar.parseWebhook(body, headers)).toEqual({ type: "payment_succeeded", orderId: "o1", checkoutId: "chk_1", paymentId: "ord_9" });
    await expect(polar.parseWebhook(body, { ...headers, "webhook-signature": "v1,AAAA" })).rejects.toThrow(/signature/);
  });

  it("Polar: verifies the signature the way Polar signs (utf-8 bytes of the whole secret, whsec_ prefix included)", async () => {
    const secret = "whsec_Zm9vYmFyYmF6cXV4";
    const polar = new PolarPaymentProvider({ accessToken: "t", webhookSecret: secret, productMap: {}, server: "sandbox" });
    const body = JSON.stringify({ type: "order.paid", data: { id: "ord_1", checkout_id: "chk_1", metadata: { order_id: "o1" } } });
    const ts = String(Math.floor(Date.now() / 1000));
    // Polar SDK: Buffer.from(secret, "utf-8").toString("base64") is handed to standardwebhooks, which base64-decodes it back to the utf-8 bytes.
    const sdkKey = Buffer.from(Buffer.from(secret, "utf-8").toString("base64"), "base64");
    const good = { "webhook-id": "m9", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(sdkKey, "m9", ts, body) };
    expect(await polar.parseWebhook(body, good)).toMatchObject({ type: "payment_succeeded", orderId: "o1" });
    // Secrets generated on or after 2026-09-08 are Standard Webhooks (docs: polar.sh/docs/integrate/webhooks/delivery): the library strips whsec_ and base64-decodes. Accepted too.
    const std = { ...good, "webhook-signature": signStandardWebhook(Buffer.from("Zm9vYmFyYmF6cXV4", "base64"), "m9", ts, body) };
    expect(await polar.parseWebhook(body, std)).toMatchObject({ type: "payment_succeeded", orderId: "o1" });
    // A signature made with any other key must still be rejected.
    const wrong = { ...good, "webhook-signature": signStandardWebhook(Buffer.from("another-key"), "m9", ts, body) };
    await expect(polar.parseWebhook(body, wrong)).rejects.toThrow(/signature/);
  });

  it("Polar: full refund reads the order amount first, partial refund sends the given amount", async () => {
    const calls: Array<{ url: string; method: string; body?: any }> = [];
    const fetchFn = (async (url: string, init: RequestInit = {}) => {
      calls.push({ url, method: init.method ?? "GET", body: init.body ? JSON.parse(String(init.body)) : undefined });
      if (url.includes("/v1/orders/")) return new Response(JSON.stringify({ net_amount: 1000, tax_amount: 80 }), { status: 200 });
      return new Response(JSON.stringify({ id: "ref_1" }), { status: 200 });
    }) as unknown as typeof fetch;
    const polar = new PolarPaymentProvider({ accessToken: "t", webhookSecret: "whs", productMap: {}, server: "production" }, fetchFn);
    expect(await polar.refund({ paymentId: "ord_9", currency: "USD", reason: "customer_request" })).toEqual({ refundId: "ref_1" });
    expect(calls[0]!.url).toBe("https://api.polar.sh/v1/orders/ord_9");
    expect(calls[1]!.body).toMatchObject({ order_id: "ord_9", amount: 1000, reason: "customer_request" });
    expect(calls[1]!.body).not.toHaveProperty("tax_amount");
    await polar.refund({ paymentId: "ord_9", currency: "USD", reason: "partial", amountMinor: 300 });
    expect(calls[2]!.body.amount).toBe(300);
    expect(calls).toHaveLength(3);
  });

  it("Polar: refunded webhook is normalized", async () => {
    const polar = new PolarPaymentProvider({ accessToken: "t", webhookSecret: "whs", productMap: {}, server: "sandbox" });
    const body = JSON.stringify({ type: "order.refunded", data: { id: "ord_9", checkout_id: "chk_1", metadata: { order_id: "o1" } } });
    const ts = String(Math.floor(Date.now() / 1000));
    const headers = { "webhook-id": "m2", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(Buffer.from("whs"), "m2", ts, body) };
    expect(await polar.parseWebhook(body, headers)).toEqual({ type: "refunded", orderId: "o1", checkoutId: "chk_1", paymentId: "ord_9" });
    const other = JSON.stringify({ type: "customer.created", data: { id: "c" } });
    expect(await polar.parseWebhook(other, { ...headers, "webhook-signature": signStandardWebhook(Buffer.from("whs"), "m2", ts, other) })).toBeNull();
  });

  it("Recurrente: charges USD only, builds a card-only checkout and verifies Svix signatures (unified and legacy events)", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const fetchFn = (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "ch_1", checkout_url: "https://rec/pay" }), { status: 200 });
    }) as unknown as typeof fetch;
    const secret = Buffer.from("topsecret").toString("base64");
    const rec = new RecurrentePaymentProvider({ publicKey: "pk", secretKey: "sk_live_x", webhookSecret: `whsec_${secret}` }, fetchFn, () => new Date("2026-10-28T12:00:00Z"));
    expect(rec.testKeys).toBe(false);
    await expect(rec.createCheckout(checkout)).rejects.toThrow(/USD only/);
    await expect(rec.createCheckout({ ...checkout, currency: "USD", amountMinor: 50 })).rejects.toThrow(/100 cents/);
    expect((await rec.createCheckout({ ...checkout, currency: "USD", amountMinor: 1299 })).url).toBe("https://rec/pay");
    const sent = JSON.parse(String(calls[0].init.body));
    expect(sent.items[0]).toMatchObject({ currency: "USD", amount_in_cents: 1299, quantity: 1, charge_type: "one_time", payment_method_types: ["card"] });
    expect(sent.metadata).toMatchObject({ order_id: "o1" });
    expect(sent.expires_at).toBe("2026-10-28T13:30:00.000Z");
    expect((calls[0].init.headers as Record<string, string>)["X-SECRET-KEY"]).toBe("sk_live_x");

    const ts = String(Math.floor(Date.now() / 1000));
    const sign = (id: string, body: string) => `v1,${createHmac("sha256", Buffer.from("topsecret")).update(`${id}.${ts}.${body}`).digest("base64")}`;
    // Unified format (accounts created after mid-2026): event_type + checkout.metadata, id is the intent "in_...".
    const unified = JSON.stringify({ type: "payment", event_type: "intent.succeeded", id: "in_1", legacy_id: "pa_1", status: "succeeded", checkout: { id: "ch_1", status: "paid", metadata: { order_id: "o1" } } });
    expect(await rec.parseWebhook(unified, { "svix-id": "s1", "svix-timestamp": ts, "svix-signature": sign("s1", unified) })).toEqual({ type: "payment_succeeded", paymentId: "in_1", orderId: "o1", checkoutId: "ch_1" });
    const failed = JSON.stringify({ type: "payment", event_type: "intent.failed", id: "in_2", checkout: { id: "ch_2" } });
    expect(await rec.parseWebhook(failed, { "svix-id": "s2", "svix-timestamp": ts, "svix-signature": sign("s2", failed) })).toEqual({ type: "payment_failed", orderId: null, checkoutId: "ch_2" });
    // Legacy per-method format: type only, top-level metadata.
    const legacy = JSON.stringify({ type: "payment_intent.succeeded", id: "pa_1", checkout: { id: "ch_1" }, metadata: { order_id: "o1" } });
    expect(await rec.parseWebhook(legacy, { "svix-id": "s3", "svix-timestamp": ts, "svix-signature": sign("s3", legacy) })).toMatchObject({ type: "payment_succeeded", paymentId: "pa_1", orderId: "o1" });
    const other = JSON.stringify({ type: "payment", event_type: "refund.create", id: "re_1" });
    expect(await rec.parseWebhook(other, { "svix-id": "s4", "svix-timestamp": ts, "svix-signature": sign("s4", other) })).toBeNull();
    await expect(rec.parseWebhook(unified, { "svix-id": "s1", "svix-timestamp": ts, "svix-signature": sign("s9", unified) })).rejects.toThrow(/signature/);

    // Refunds: intent_id for unified ids, payment_intent_id for legacy ones, amount only when partial, idempotent.
    calls.length = 0;
    const refFetch = (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "re_1", status: "succeeded" }), { status: 200 });
    }) as unknown as typeof fetch;
    const rec2 = new RecurrentePaymentProvider({ publicKey: "pk", secretKey: "sk_test_x", webhookSecret: `whsec_${secret}` }, refFetch);
    expect(rec2.testKeys).toBe(true);
    expect(await rec2.refund({ paymentId: "in_1", currency: "USD", reason: "x" })).toEqual({ refundId: "re_1" });
    expect(JSON.parse(String(calls[0].init.body))).toEqual({ intent_id: "in_1" });
    expect((calls[0].init.headers as Record<string, string>)["Idempotency-Key"]).toBe("refund:in_1:full");
    await rec2.refund({ paymentId: "pa_1", amountMinor: 833, currency: "USD", reason: "x" });
    expect(JSON.parse(String(calls[1].init.body))).toEqual({ payment_intent_id: "pa_1", amount_in_cents: 833 });
  });

  it("selects the provider per engine with PAYMENT_PROVIDER_GENERATE / PAYMENT_PROVIDER_CALLS", () => {
    const rec = { RECURRENTE_PUBLIC_KEY: "pk", RECURRENTE_SECRET_KEY: "sk", RECURRENTE_WEBHOOK_SECRET: "whsec_x" };
    expect(createPaymentProvider({ ...rec, PAYMENT_PROVIDER: "mock", PAYMENT_PROVIDER_GENERATE: "recurrente" }, "generate").name).toBe("recurrente");
    expect(createPaymentProvider({ ...rec, PAYMENT_PROVIDER: "mock", PAYMENT_PROVIDER_GENERATE: "recurrente" }, "calls").name).toBe("mock");
    expect(createPaymentProvider({ ...rec, PAYMENT_PROVIDER: "mock", PAYMENT_PROVIDER_GENERATE: "recurrente" }).name).toBe("mock");
    expect(createPaymentProvider({ ...rec, PAYMENT_PROVIDER: "recurrente", PAYMENT_PROVIDER_CALLS: "mock" }, "calls").name).toBe("mock");
    expect(createPaymentProvider({ ...rec, PAYMENT_PROVIDER: "recurrente", PAYMENT_PROVIDER_GENERATE: "" }, "generate").name).toBe("recurrente");
  });

  it("converts to USD when the provider cannot charge the local currency", () => {
    const rec = new RecurrentePaymentProvider({ publicKey: "a", secretKey: "b", webhookSecret: "c" });
    expect(convertForProvider(rec, 19900, "MXN", {})).toEqual({ amountMinor: 1095, currency: "USD", converted: true });
    expect(convertForProvider(rec, 1499, "USD", {})).toEqual({ amountMinor: 1499, currency: "USD", converted: false });
    expect(convertForProvider(new MockPaymentProvider(), 19900, "MXN", {}).converted).toBe(false);
  });

  it("Polar: accepts both secret formats (Standard Webhooks whsec_<base64> and legacy UTF-8 key)", async () => {
    const body = JSON.stringify({ type: "order.paid", data: { id: "ord_1", checkout_id: "c", metadata: { order_id: "o1" } } });
    const ts = String(Math.floor(Date.now() / 1000));
    const secret = `whsec_${Buffer.from("raw-key-bytes").toString("base64")}`;
    const polar = new PolarPaymentProvider({ accessToken: "t", webhookSecret: secret, productMap: {}, server: "production" });
    const std = { "webhook-id": "m", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(Buffer.from("raw-key-bytes"), "m", ts, body) };
    const legacy = { "webhook-id": "m", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(Buffer.from(secret, "utf8"), "m", ts, body) };
    expect((await polar.parseWebhook(body, std))?.type).toBe("payment_succeeded");
    expect((await polar.parseWebhook(body, legacy))?.type).toBe("payment_succeeded");
    await expect(polar.parseWebhook(body, { ...std, "webhook-signature": signStandardWebhook(Buffer.from("other"), "m", ts, body) })).rejects.toThrow(/signature/);
    expect(webhookKeys("plain")).toHaveLength(1);
  });

  it("Polar: an already refunded order is success (idempotent), not an error", async () => {
    const fetchFn = (async (url: string) => (url.includes("/v1/orders/") ? new Response(JSON.stringify({ net_amount: 1000 }), { status: 200 }) : new Response('{"error":"RefundedAlready"}', { status: 403 }))) as unknown as typeof fetch;
    const polar = new PolarPaymentProvider({ accessToken: "t", webhookSecret: "x", productMap: {}, server: "production" }, fetchFn);
    expect(await polar.refund({ paymentId: "o", currency: "MXN", reason: "r" })).toEqual({ refundId: "already_refunded" });
  });

  it("catalog: Jinglo MX single is required, the package only when BUNDLE_ENABLED=1; Colorear shares the same map", () => {
    const env = { ENABLED_COUNTRIES: "MX", COLOREAR_COUNTRIES: "MX" };
    const cat = polarCatalog(env);
    expect(cat.map((c) => [c.key, c.required, c.amountMinor])).toEqual([["santa:MX:single", true, 19900], ["santa:MX:bundle", false, 34900], ["colorear:MX:single", true, 22900], ["colorear:MX:bundle3", true, 42900], ["colorear:MX:add1", true, 16900]]);
    expect(polarCatalog({ ...env, BUNDLE_ENABLED: "1" }).find((c) => c.key === "santa:MX:bundle")!.required).toBe(true);
    const u = "123e4567-e89b-12d3-a456-426614174000";
    const col = { "colorear:MX:single": u, "colorear:MX:bundle3": u, "colorear:MX:add1": u };
    expect(checkProductMap({ "santa:MX:single": u }, env).missing).toEqual(Object.keys(col));
    expect(checkProductMap({ "santa:MX:single": u, ...col }, env).ok).toBe(true);
    expect(checkProductMap({ "santa:MX:single": "x", ...col }, env).malformed).toEqual(["santa:MX:single"]);
  });

  it("reconcile: finds paid/refunded mismatches both ways and ignores test orders", () => {
    const db = (o: Partial<import("./reconcile").DbOrderLite>) => ({ id: "a", status: "scheduled", paymentId: null, checkoutId: "c1", amountMinor: 19900, currency: "MXN", testMode: false, ...o });
    const ok = reconcile([{ id: "p1", status: "paid", netAmount: 17000, currency: "MXN", checkoutId: "c1", orderId: "a" }], [db({})]);
    expect(ok.mismatches).toEqual([]);
    expect(ok.polarPaid).toBe(1);
    const bad = reconcile(
      [{ id: "p1", status: "paid", netAmount: 17000, currency: "MXN", checkoutId: "c1", orderId: "a" }, { id: "p2", status: "refunded", netAmount: 17000, currency: "MXN", checkoutId: "c2", orderId: "b" }, { id: "p3", status: "paid", netAmount: 1, currency: "MXN", checkoutId: null, orderId: null }],
      [db({ status: "created" }), db({ id: "b", checkoutId: "c2", status: "scheduled" }), db({ id: "z", checkoutId: "c9", status: "scheduled" }), db({ id: "t", testMode: true, status: "scheduled", checkoutId: "ct" })],
    );
    expect(bad.mismatches.map((m) => m.kind).sort()).toEqual(["orphan_polar_order", "paid_in_db_not_in_polar", "paid_in_polar_not_in_db", "refunded_in_polar_not_in_db"]);
  });
});
