import { describe, expect, it } from "vitest";
import { buildCapiEvent, hashEmail, isMetaEvent, metaConfig, sendCapi } from "./meta";

describe("meta pixel / CAPI", () => {
  it("is off without a valid pixel id", () => {
    expect(metaConfig({})).toBeNull();
    expect(metaConfig({ META_PIXEL_ID: "abc" })).toBeNull();
    expect(metaConfig({ META_PIXEL_ID: "1234567890" })!.capiToken).toBeNull();
  });
  it("builds a Purchase with the experiment, hashed email and no child data", () => {
    const e = buildCapiEvent({ name: "Purchase", eventId: "ord-1", url: "https://x/es", creative: "e1.cara-a", value: 199, currency: "mxn", email: " Mama@Test.com ", ip: "1.2.3.4", userAgent: "UA", fbp: "fb.1.2.3", country: "MX" });
    expect(e.custom_data).toMatchObject({ cr: "e1.cara-a", exp: "e1", value: 199, currency: "MXN" });
    expect((e.user_data as any).em).toEqual([hashEmail("mama@test.com")]);
    expect(JSON.stringify(e)).not.toMatch(/mama@test/i);
    const v = buildCapiEvent({ name: "ViewContent", eventId: "v1", url: "u", creative: "none", email: "a@b.co" });
    expect((v.user_data as any).em).toBeUndefined();
    expect(v.custom_data).not.toHaveProperty("exp");
  });
  it("relays only when a token exists and never throws", async () => {
    const cfg = { pixelId: "123456", capiToken: "t", testEventCode: "TEST1", apiVersion: "v23.0" };
    const calls: string[] = [];
    const ok = (async (u: string, init: RequestInit) => { calls.push(u + String(init.body)); return new Response("{}", { status: 200 }); }) as unknown as typeof fetch;
    expect(await sendCapi(cfg, { name: "PageView", eventId: "e", url: "u", creative: "none" }, ok)).toBe(true);
    expect(calls[0]).toContain("test_event_code");
    expect(await sendCapi({ ...cfg, capiToken: null }, { name: "PageView", eventId: "e", url: "u", creative: "none" }, ok)).toBe(false);
    const boom = (async () => { throw new Error("net"); }) as unknown as typeof fetch;
    expect(await sendCapi(cfg, { name: "PageView", eventId: "e", url: "u", creative: "none" }, boom)).toBe(false);
    expect(isMetaEvent("Purchase")).toBe(true);
    expect(isMetaEvent("Lead")).toBe(false);
  });
});
