import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { lockedPrefixLength } from "./prelude";
import { AVISO, EN_GB_RIGHTS_SUFFIX, PRELUDES, RAW_CHECKBOXES, RAW_COLOREAR_CHECKBOXES, COLOREAR_CHECKBOX_ORDER, COLOREAR_IMPLICIT_IDS, renderColorearAviso, fill, hasUnfilledPlaceholders, renderAviso, renderPrelude, resolveAllCheckboxes } from "./index";

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

describe("D14 + D20 (non-interruptible notice, short prelude)", () => {
  it("every locale locks who calls / AI voice / recording and leaves only the key instructions interruptible", () => {
    for (const [locale, t] of Object.entries(PRELUDES.santa!)) {
      const cut = lockedPrefixLength(t.main, t.mainOpenFrom);
      const locked = t.main.slice(0, cut);
      const open = t.main.slice(cut);
      expect(locked, locale).toMatch(/Jinglo/);
      expect(locked, locale).toMatch(/automatizada|automática|automated/);
      expect(locked, locale).toMatch(/voz artificial|artificial voice/);
      expect(locked, locale).toMatch(/Polo Norte|North Pole/);
      expect(locked, locale).toMatch(/grab|record/);
      expect(open, locale).toMatch(/1/);
      expect(open, locale).toMatch(/2/);
      expect(open, locale).not.toMatch(/artificial|automat|grab|record|Jinglo/);
      // the repeat is exactly the interruptible part, so one clip serves both
      expect(open.trim(), locale).toBe(t.repeat);
    }
  });
  it("D20: child-friendly wording (no IA / robot / computer words a child knows), fully interruptible hand-off", () => {
    for (const [locale, t] of Object.entries(PRELUDES.santa!)) {
      for (const text of [t.main, t.repeat, t.handoff, t.handoffRepeat]) {
        expect(text, locale).not.toMatch(/\bIA\b|\bAI\b|robot|computadora|ordenador|computer|inteligencia/i);
      }
      expect(t.main.split(/\s+/).length, locale).toBeLessThanOrEqual(45);
      expect(t.main, locale).toContain("{{NOMBRE_NIÑO}}");
      expect(t.handoffOpenFrom, locale).toBeNull();
      expect(t.id, locale).toMatch(/legal-v1\.3$/);
    }
  });
  it("D20: removed content stays out of the call (it lives in checkout C3-C5 and the email)", () => {
    for (const [locale, t] of Object.entries(PRELUDES.santa!)) {
      expect(t.handoff, locale).not.toMatch(/datos|vend|escuchar|information|sell|listen/i);
    }
  });
  it("pre-recorded clips exist for every locale", () => {
    for (const [locale, t] of Object.entries(PRELUDES.santa!)) {
      for (const path of [...t.audio!.mainLocked, t.audio!.mainOpen, ...t.audio!.handoff].filter((x) => x.startsWith("/"))) {
        expect(existsSync(join(__dirname, "../../../apps/web/public", path)), `${locale} ${path}`).toBe(true);
      }
    }
  });
  it("throws if the marker is missing or ambiguous", () => {
    expect(() => lockedPrefixLength("uno dos", "tres")).toThrow();
    expect(() => lockedPrefixLength("uno dos uno", "uno")).toThrow();
    expect(() => lockedPrefixLength("tres cuatro", "tres")).toThrow();
  });
});

describe("D13 (legal-v1.2, kept in v1.3)", () => {
  it("no child-facing first line mentions computer or AI; main notice names the brand and the artificial voice", () => {
    for (const [locale, t] of Object.entries(PRELUDES.santa!)) {
      expect(t.firstLine, locale).not.toMatch(/computadora|ordenador|computer|inteligencia|artificial/i);
      expect(t.main, locale).toMatch(/Jinglo/);
      expect(t.main, locale).toMatch(/voz artificial|artificial voice/);
    }
    expect(PRELUDES.santa!["es-419"].firstLine).toBe("¡Jo, jo, jo! Hola, {{NOMBRE_NIÑO}}. Soy Santa, ¡y te llamo desde el Polo Norte! ¿Cómo estás?");
  });
  it("C3 names Jinglo, a Lumen Labs product, and the in-character notice", () => {
    for (const lang of ["es-419", "es-ES", "en"] as const) {
      expect(RAW_CHECKBOXES.C3[lang].id).toMatch(/legal-v1\.3$/);
      expect(RAW_CHECKBOXES.C3[lang].text).toMatch(/Jinglo, (un producto de|a) Lumen Labs( product)?/);
    }
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
    expect(r.firstLine).toContain("Sofía");
    expect(r.main).toContain("Jinglo");
    expect(r.main).toContain("Sofía");
    expect(r.audio!.mainLocked).toContain("Sofía");
    expect(r.audio!.handoff).toContain("Sofía");
    expect(hasUnfilledPlaceholders(JSON.stringify(r))).toBe(false);
    expect(fill("{{X}}", {})).toBe("{{X}}");
  });

  describe("colorear consent (D22/D23: one checkbox, vendor-neutral)", () => {
    const langs = ["es-419", "es-ES", "en"] as const;
    const brands = /openai|anthropic|resend|supabase|vercel|polar|recurrente|chatgpt|gpt|dall|google|gemini/i;

    it("has one checkbox plus the pay-time acceptance, both recorded", () => {
      expect(COLOREAR_CHECKBOX_ORDER).toEqual(["K1", "K2"]);
      expect(COLOREAR_IMPLICIT_IDS).toEqual(["K2"]);
    });

    it("keeps the checkbox short and free of brand names", () => {
      for (const lang of langs) {
        for (const id of COLOREAR_CHECKBOX_ORDER) {
          const t = RAW_COLOREAR_CHECKBOXES[id][lang].text;
          expect(t).not.toMatch(brands);
          expect(RAW_COLOREAR_CHECKBOXES[id][lang].id).toMatch(/colorear-v3$/);
        }
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text.length).toBeLessThanOrEqual(140);
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/IA|AI/);
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/24 h/);
      }
    });

    it("the notice and the privacy page share one neutral text: categories only, sub-processor list on request (D23)", () => {
      for (const lang of langs) {
        const text = JSON.stringify(renderColorearAviso(lang, vars));
        expect(text).not.toMatch(brands);
        expect(text).not.toMatch(/openai|anthropic|claude|resend|supabase|vercel|polar|recurrente|nano ?banana|midjourney/i);
        expect(text).not.toMatch(/proveedor(es)? de (IA|generaci)|AI provider|image-generation|text-generation/i);
        expect(text).toContain("p@x.co");
        expect(text).toMatch(/subencargados|sub-processors/);
        expect(text).toMatch(/inteligencia artificial|artificial intelligence/);
        expect(hasUnfilledPlaceholders(text)).toBe(false);
      }
    });
  });
});
