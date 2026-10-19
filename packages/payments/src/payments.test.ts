import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { MockPaymentProvider, PolarPaymentProvider, RecurrentePaymentProvider, convertForProvider, createPaymentProvider, signStandardWebhook, verifyStandardWebhook } from "./index";

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
    await expect(polar.createCheckout({ ...checkout, country: "ES" })).rejects.toThrow(/POLAR_PRODUCT_MAP/);

    const body = JSON.stringify({ type: "order.paid", data: { id: "ord_9", checkout_id: "chk_1", metadata: { order_id: "o1" } } });
    const ts = String(Math.floor(Date.now() / 1000));
    const headers = { "webhook-id": "m1", "webhook-timestamp": ts, "webhook-signature": signStandardWebhook(Buffer.from("whs"), "m1", ts, body) };
    expect(await polar.parseWebhook(body, headers)).toEqual({ type: "payment_succeeded", orderId: "o1", checkoutId: "chk_1", paymentId: "ord_9" });
    await expect(polar.parseWebhook(body, { ...headers, "webhook-signature": "v1,AAAA" })).rejects.toThrow(/signature/);
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
    expect(calls[1]!.body).toMatchObject({ order_id: "ord_9", amount: 1000, tax_amount: 80, reason: "customer_request" });
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
});
