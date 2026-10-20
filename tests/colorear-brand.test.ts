import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COLOREAR_LANGS, colorearLegalLocale } from "@lumen/config";
import { COLOREAR_TERMS } from "@/lib/colorear-legal-pages";
import { COLOREAR_COPY } from "@/lib/colorear-copy";
import { colorearDocumentVars, colorearLegalVars } from "@/lib/legal-vars";
import { renderColorearAviso, resolveAllColorearCheckboxes } from "@lumen/legal";
import { composeColorearMessage } from "@lumen/generate";

// Colorear is Pintoria: the Santa brand (BRAND_NAME, default "Jinglo") must never leak into a colorear text.
describe("colorear brand", () => {
  const vars = colorearDocumentVars("");
  it("uses Pintoria as {{MARCA}} even though BRAND_NAME defaults to Jinglo", () => {
    expect(colorearLegalVars().MARCA).toBe("Pintoria");
    expect(vars.MARCA).toBe("Pintoria");
    expect(colorearLegalVars({ COLOREAR_BRAND_NAME: "Otra" }).MARCA).toBe("Otra");
  });
  it("no rendered colorear text contains Jinglo", () => {
    const texts: string[] = [];
    for (const country of ["MX", "ES", "US", "GB"] as const) {
      const loc = colorearLegalLocale(country);
      for (const k of resolveAllColorearCheckboxes(loc, vars)) texts.push(k.text);
      const a = renderColorearAviso(loc, vars, { gb: country === "GB" });
      texts.push(a.title, a.intro, a.privacyLink, ...a.sections.flatMap((s) => [s.heading, s.body]));
    }
    for (const lang of COLOREAR_LANGS) {
      for (const s of COLOREAR_TERMS[lang].sections) texts.push(s.h, s.p.replace(/\{(\w+)\}/g, (m, key: string) => vars[key] ?? m));
      texts.push(JSON.stringify(COLOREAR_COPY[lang].faq), COLOREAR_COPY[lang].siteTitle, COLOREAR_COPY[lang].siteDescription);
      for (const kind of ["receipt", "receipt_add", "delivery", "refund", "reminder"] as const) {
        const m = composeColorearMessage(kind, lang, "a@b.co", { names: "Ana", price: "$1", statusLink: "s", deliveryLink: "d", refundLink: "r", deleteDate: "2026-11-30", holder: "T", privacyEmail: "p@x", supportEmail: "s@x", brand: vars.MARCA!, address: "Calle 1", stopLink: "x", landingLink: "l", commercialOk: true, offerPrice: "$9", offerUntil: "u", offerLink: "o", creditsLeft: 0 });
        texts.push(m.subject, m.text);
      }
    }
    for (const t of texts) expect(t, t.slice(0, 80)).not.toMatch(/jinglo/i);
    expect(texts.join(" ")).toContain("Pintoria");
  });
  it("colorear source files do not hardcode the Santa brand", () => {
    for (const f of ["apps/web/src/lib/colorear-copy.ts", "apps/web/src/lib/colorear-legal-pages.ts", "packages/legal/src/colorear.ts", "engines/generate/src/emails.ts", "engines/generate/src/pdf.ts"]) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/jinglo/i);
    }
  });
});
