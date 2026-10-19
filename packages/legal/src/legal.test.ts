import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { AVISO, EN_GB_RIGHTS_SUFFIX, PRELUDES, RAW_CHECKBOXES, fill, hasUnfilledPlaceholders, renderAviso, renderPrelude, resolveAllCheckboxes } from "./index";

const dir = resolve(__dirname, "../../../docs/legal/textos");
const read = (f: string) => readFileSync(resolve(dir, f), "utf8").replace(/\s*`\[no verificado[^\]]*\]`/g, "");
const f01 = read("01-aviso-coppa-y-consentimiento-padre.md");
const f02 = read("02-consentimiento-tcpa-grabacion.md");
const f03 = read("03-preludio-llamada-adulto.md");

describe("legal texts match docs/legal/textos exactly", () => {
  it("checkboxes C1-C5 are verbatim", () => {
    for (const id of ["C1", "C2", "C3", "C4", "C5"] as const) {
      const md = id === "C1" || id === "C2" ? f01 : f02;
      for (const lang of ["es-419", "es-ES", "en"] as const) {
        const { id: vid, text } = RAW_CHECKBOXES[id][lang];
        expect(md, `${vid}`).toContain(`[ ] ${text}`);
        expect(md, `${vid} id`).toContain(vid);
      }
    }
  });

  it("aviso sections are verbatim", () => {
    for (const lang of ["es-419", "es-ES", "en"] as const) {
      const a = AVISO[lang];
      expect(f01).toContain(a.id);
      expect(f01).toContain(a.intro);
      for (const s of a.sections) expect(f01, s.heading).toContain(`**${s.heading}** ${s.body}`);
    }
    expect(EN_GB_RIGHTS_SUFFIX.trim()).toBe("You may also complain to the Information Commissioner's Office.");
  });

  it("prelude texts are verbatim (Santa)", () => {
    for (const [locale, t] of Object.entries(PRELUDES.santa!)) {
      expect(f03, `${locale} id`).toContain(t.id);
      expect(f03, `${locale} main`).toContain(t.main);
      expect(f03, `${locale} repeat`).toContain(t.repeat);
      expect(f03, `${locale} handoff`).toContain(t.handoff);
      expect(f03, `${locale} handoff reminder (step 7)`).toContain(t.handoffRepeat);
      expect(f03, `${locale} optout`).toContain(t.optout);
      expect(f03, `${locale} noResponse`).toContain(t.noResponse);
      expect(f03, `${locale} firstLine`).toContain(t.firstLine);
    }
    expect(f03).toContain(PRELUDES.santa!["es-419"].pressOne);
    expect(f03).toContain(PRELUDES.santa!["es-419"].closing);
  });
});

describe("placeholders", () => {
  const vars = { MARCA: "Lumen Labs", TITULAR: "Titular SA", EMAIL_PRIVACIDAD: "p@x.co", EMAIL_SOPORTE: "s@x.co", DOMINIO: "https://x.co" };

  it("every checkbox resolves with no placeholder left and a stable hash", () => {
    for (const loc of ["es-419", "es-ES", "en-US", "en-GB"] as const) {
      const a = resolveAllCheckboxes(loc, vars);
      const b = resolveAllCheckboxes(loc, vars);
      expect(a).toHaveLength(6);
      for (const c of a) {
        expect(hasUnfilledPlaceholders(c.text)).toBe(false);
        expect(c.sha256).toMatch(/^[0-9a-f]{64}$/);
      }
      expect(a.map((c) => c.sha256)).toEqual(b.map((c) => c.sha256));
    }
  });

  it("aviso renders without placeholders", () => {
    for (const lang of ["es-419", "es-ES", "en"] as const) {
      const a = renderAviso(lang, vars, { gb: lang === "en" });
      expect(hasUnfilledPlaceholders(JSON.stringify(a))).toBe(false);
    }
  });

  it("prelude renders with child name and brand", () => {
    const r = renderPrelude(PRELUDES.santa!["es-419"], { brand: "Lumen Labs", childName: "Sofía" });
    expect(r.main).toContain("Sofía");
    expect(r.main).toContain("Lumen Labs");
    expect(hasUnfilledPlaceholders(JSON.stringify(r))).toBe(false);
    expect(fill("{{X}}", {})).toBe("{{X}}");
  });
});
