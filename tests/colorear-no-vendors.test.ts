import { describe, expect, it } from "vitest";
import { COLOREAR_COPY } from "../apps/web/src/lib/colorear-copy";
import { COLOREAR_TERMS } from "../apps/web/src/lib/colorear-legal-pages";
import { composeColorearMessage } from "../engines/generate/src/emails";

/** D23: nothing the customer sees may name an AI provider/model or reveal the recipe. */
const BANNED = /openai|chatgpt|\bgpt\b|dall[-·. ]?e|claude|anthropic|gemini|google|nano ?banana|midjourney|stable diffusion|resend|supabase|vercel|inngest|proveedor(es)? de (ia|generaci)|ai provider|image-generation|text-generation|modelo de imagen|image model|no se env[ií]an a la ia|not sent to the ai/i;

describe("D23 customer-facing copy has no vendor or model names", () => {
  it("landing, form, status and FAQ copy", () => {
    for (const lang of ["es", "en"] as const) expect(JSON.stringify(COLOREAR_COPY[lang], (_, v) => (typeof v === "function" ? String(v("x")) : v))).not.toMatch(BANNED);
  });
  it("terms", () => {
    expect(JSON.stringify(COLOREAR_TERMS)).not.toMatch(BANNED);
  });
  it("emails", () => {
    const vars = { names: "A", price: "$1", statusLink: "s", deliveryLink: "d", refundLink: "r", deleteDate: "2026-01-01", holder: "H", privacyEmail: "p@x.co", supportEmail: "s@x.co", brand: "B" };
    for (const testOrder of [false, true]) for (const kind of ["receipt", "delivery", "refund"] as const) for (const lang of ["es", "en"] as const) expect(JSON.stringify(composeColorearMessage(kind, lang, "a@b.co", { ...vars, testOrder }))).not.toMatch(BANNED);
  });
});
