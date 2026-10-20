import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { lockedPrefixLength } from "./prelude";
import { AVISO, EN_GB_RIGHTS_SUFFIX, PRELUDES, RAW_CHECKBOXES, RAW_COLOREAR_CHECKBOXES, COLOREAR_CHECKBOX_ORDER, COLOREAR_IMPLICIT_IDS, renderColorearAviso, renderColorearReminder, colorearTrioRefund, colorearDefectRefund, COLOREAR_LEGAL_RULES, COLOREAR_LEGAL_VERSION, COLOREAR_REMINDER, COLOREAR_DELIVERY_LEGAL, COLOREAR_TRIO_LINE, COLOREAR_TRIO_REFUND_LINE, COLOREAR_EMAIL_LINE, fill, hasUnfilledPlaceholders, renderAviso, renderPrelude, resolveAllCheckboxes } from "./index";

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
          expect(RAW_COLOREAR_CHECKBOXES[id][lang].id).toMatch(/colorear-v4$/);
        }
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text.length).toBeLessThanOrEqual(140);
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/IA|AI/);
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/24 h/);
        // D26: the one checkbox now discloses the retention of the character drawings.
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/48 h/);
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/30/);
        expect(RAW_COLOREAR_CHECKBOXES.K1[lang].text).toMatch(/Tr[ií]o/);
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

describe("colorear D26: characters retention, Trio credits, reminder", () => {
  const langs = ["es-419", "es-ES", "en"] as const;
  const vars = { MARCA: "Pintoria", TITULAR: "Titular", EMAIL_PRIVACIDAD: "p@x.co", EMAIL_SOPORTE: "s@x.co", DOMINIO: "x.co", DOMICILIO: "Calle 1", FECHA_BORRADO: "2026-11-20", ENLACE: "https://x.co/e", ENLACE_OFERTA: "https://x.co/o", ENLACE_BAJA: "https://x.co/b", FECHA_PERSONAJES: "2026-10-22", FECHA_OFERTA: "2026-10-22", FECHA_CREDITOS: "2026-11-20" };
  const brands = /openai|anthropic|claude|resend|supabase|vercel|polar|recurrente|gpt|google|gemini|nano ?banana/i;

  it("version and numbers are in step with the texts", () => {
    expect(COLOREAR_LEGAL_VERSION).toBe("colorear-legal-v4");
    expect(COLOREAR_LEGAL_RULES).toMatchObject({ photosMaxHours: 24, charactersOfferHours: 48, charactersTrioDays: 30, trioAdventures: 3, creditsValidDays: 30, bookAndOrderDays: 30, reminderDay: 25, refundDays: 7, maxCommercialEmails: 3 });
    for (const lang of langs) {
      const aviso = JSON.stringify(renderColorearAviso(lang, vars));
      expect(aviso).toMatch(/48 (horas|hours)/);
      expect(aviso).toMatch(/30 (días|days)/);
      expect(aviso).toMatch(/24 (horas|hours)/);
      expect(aviso).toMatch(/Tr[ií]o/);
      expect(aviso).toMatch(/inter[eé]s leg[ií]timo|legitimate interest/);
      expect(aviso).toMatch(/(tres|three) (de esos |of those )?(correos|emails)/);
      expect(aviso).toMatch(/Borrar mis personajes|Delete my characters/);
      expect(aviso).toMatch(/oponerse|object/);
      expect(aviso).not.toMatch(/se borran en 24 h y los personajes se borran al terminar/);
    }
  });

  it("the old promise that characters are deleted when the book is finished is gone", () => {
    for (const lang of langs) {
      const text = JSON.stringify(renderColorearAviso(lang, vars));
      expect(text).not.toMatch(/los personajes y las páginas intermedias|the characters and intermediate pages/);
    }
  });

  it("Trio refund rule: full if only the first adventure was used, unused thirds if more, nothing after 7 days", () => {
    const paid = 2499;
    expect(colorearTrioRefund({ paidMinor: paid, credits: 3, used: 0, daysSinceFirstDelivery: 0 })).toEqual({ refundMinor: 2499, rule: "full" });
    expect(colorearTrioRefund({ paidMinor: paid, credits: 3, used: 1, daysSinceFirstDelivery: 7 })).toEqual({ refundMinor: 2499, rule: "full" });
    expect(colorearTrioRefund({ paidMinor: paid, credits: 3, used: 2, daysSinceFirstDelivery: 3 })).toEqual({ refundMinor: 833, rule: "unused" });
    expect(colorearTrioRefund({ paidMinor: paid, credits: 3, used: 3, daysSinceFirstDelivery: 3 })).toEqual({ refundMinor: 0, rule: "none" });
    expect(colorearTrioRefund({ paidMinor: paid, credits: 3, used: 1, daysSinceFirstDelivery: 8 })).toEqual({ refundMinor: 0, rule: "none" });
    expect(colorearTrioRefund({ paidMinor: 42900, credits: 3, used: 2, daysSinceFirstDelivery: 1 }).refundMinor).toBe(14300);
    // never refunds more than what is left after a defect refund
    const d = colorearDefectRefund(paid, 3);
    expect(d).toBe(833);
    expect(colorearTrioRefund({ paidMinor: paid, credits: 3, used: 1, daysSinceFirstDelivery: 2, alreadyRefundedMinor: d }).refundMinor).toBe(paid - d);
    expect(colorearDefectRefund(1299, 1)).toBe(1299);
  });

  it("the reminder is transactional first, has no vendor names and never promises the same photos", () => {
    for (const lang of langs) {
      const plain = renderColorearReminder(lang, vars, { credits: 0, commercial: false });
      expect(plain.subject).toContain("2026-11-20");
      expect(plain.text).not.toContain("https://x.co/o");
      expect(plain.text).not.toContain("https://x.co/b");
      const withOffer = renderColorearReminder(lang, vars, { credits: 0, commercial: true });
      expect(withOffer.text.indexOf("https://x.co/e")).toBeLessThan(withOffer.text.indexOf("https://x.co/o"));
      expect(withOffer.text).toContain("https://x.co/b");
      expect(withOffer.text).toContain("Calle 1");
      expect(withOffer.text).toContain("Titular");
      const credits = renderColorearReminder(lang, vars, { credits: 2, commercial: true });
      expect(credits.text).toContain("2");
      expect(credits.text).not.toContain("https://x.co/o");
      for (const r of [plain, withOffer, credits]) {
        expect(JSON.stringify(r)).not.toMatch(brands);
        expect(hasUnfilledPlaceholders(JSON.stringify(r))).toBe(false);
        expect(r.subject).not.toMatch(/Sofía|\{\{/);
      }
      expect(JSON.stringify(COLOREAR_REMINDER[lang])).not.toMatch(/same photos|mismas fotos/i);
    }
  });

  it("checkout, delivery-page and Trio lines are neutral and complete", () => {
    for (const lang of langs) {
      const all = JSON.stringify([COLOREAR_TRIO_LINE[lang], COLOREAR_TRIO_REFUND_LINE[lang], COLOREAR_EMAIL_LINE[lang], COLOREAR_DELIVERY_LEGAL[lang]]);
      expect(all).not.toMatch(brands);
      expect(COLOREAR_TRIO_LINE[lang]).toMatch(/30/);
      expect(COLOREAR_TRIO_LINE[lang]).toMatch(/caducan|expire/);
      expect(COLOREAR_EMAIL_LINE[lang]).toMatch(/(tres|three)/);
      expect(COLOREAR_DELIVERY_LEGAL[lang].deleteButton).toMatch(/Borrar mis personajes|Delete my characters/);
    }
  });
});
