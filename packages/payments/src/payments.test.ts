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
    // Treating the secret as base64 after stripping the prefix (the generic Svix convention) must NOT verify.
    const wrong = { ...good, "webhook-signature": signStandardWebhook(Buffer.from("Zm9vYmFyYmF6cXV4", "base64"), "m9", ts, body) };
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

  it("Recurrente: charges USD only and verifies Svix signatures", async () => {
    const fetchFn = (async () => new Response(JSON.stringify({ id: "ch_1", checkout_url: "https://rec/pay" }), { status: 200 })) as unknown as typeof fetch;
    const secret = Buffer.from("topsecret").toString("base64");
    const rec = new RecurrentePaymentProvider({ publicKey: "pk", secretKey: "sk", webhookSecret: `whsec_${secret}` }, fetchFn);
    await expect(rec.createCheckout(checkout)).rejects.toThrow(/USD only/);
    expect((await rec.createCheckout({ ...checkout, currency: "USD", amountMinor: 1099 })).url).toBe("https://rec/pay");
    const body = JSON.stringify({ type: "payment_intent.succeeded", id: "pi_1", checkout: { id: "ch_1" }, metadata: { order_id: "o1" } });
    const ts = String(Math.floor(Date.now() / 1000));
    const sig = `v1,${createHmac("sha256", Buffer.from("topsecret")).update(`s1.${ts}.${body}`).digest("base64")}`;
    expect(await rec.parseWebhook(body, { "svix-id": "s1", "svix-timestamp": ts, "svix-signature": sig })).toMatchObject({ type: "payment_succeeded", paymentId: "pi_1", orderId: "o1" });
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
    expect(cat.map((c) => [c.key, c.required, c.amountMinor])).toEqual([["santa:MX:single", true, 19900], ["santa:MX:bundle", false, 34900], ["colorear:MX:single", true, 22900]]);
    expect(polarCatalog({ ...env, BUNDLE_ENABLED: "1" }).find((c) => c.key === "santa:MX:bundle")!.required).toBe(true);
    const u = "123e4567-e89b-12d3-a456-426614174000";
    expect(checkProductMap({ "santa:MX:single": u }, env).missing).toEqual(["colorear:MX:single"]);
    expect(checkProductMap({ "santa:MX:single": u, "colorear:MX:single": u }, env).ok).toBe(true);
    expect(checkProductMap({ "santa:MX:single": "x", "colorear:MX:single": u }, env).malformed).toEqual(["santa:MX:single"]);
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
