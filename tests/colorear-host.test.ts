import { describe, expect, it } from "vitest";
import { colorearRewrite, isColorearHost } from "@/lib/colorear-host";

describe("pintoria host routing", () => {
  it("recognizes only the pintoria hosts", () => {
    expect(isColorearHost("www.pintoria.app")).toBe(true);
    expect(isColorearHost("PINTORIA.app:443")).toBe(true);
    expect(isColorearHost("born-raised-by-ai-4ta9.vercel.app")).toBe(false);
    expect(isColorearHost("lumen-labs.co")).toBe(false);
  });
  it("maps the root and the colorear pages, and hides Santa", () => {
    expect(colorearRewrite("/")).toBe("/colorear/es");
    expect(colorearRewrite("/en")).toBe("/colorear/en");
    expect(colorearRewrite("/en/")).toBe("/colorear/en");
    expect(colorearRewrite("/en/privacidad")).toBe("/colorear/en/privacidad");
    expect(colorearRewrite("/terminos")).toBe("/colorear/es/terminos");
    expect(colorearRewrite(`/entrega/${"a".repeat(32)}`)).toBe(`/colorear/entrega/${"a".repeat(32)}`);
    expect(colorearRewrite("/colorear/en")).toBe("/colorear/en");
    expect(colorearRewrite("/api/colorear/estado")).toBe("/api/colorear/estado");
    expect(colorearRewrite("/pintoria/logo-a.svg")).toBe("/pintoria/logo-a.svg");
    for (const santa of ["/es-es", "/es/comprar", "/en/comprar", "/llamada/x", "/api/calls/twilio/voice", "/api/checkout", "/es-es/privacidad"]) {
      expect(colorearRewrite(santa)).toBe("/colorear/not-found");
    }
  });
});
