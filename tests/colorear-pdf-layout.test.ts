import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { COLOREAR, COLOREAR_THEMES, type ColorearLang } from "@lumen/config";
import { PRINT_MARGIN, TEXT_STRIP, TemplateStoryProvider, THEME_PACKS, assembleBook, fillNames, type Box, type PageLayout } from "@lumen/generate";
import { PDFDocument } from "pdf-lib";

/**
 * Pintoria PDF (25-oct, seen by Juan in production): the caption crossed the lines of the drawing. Every page now reserves a strip of its own
 * for the text; the drawing is cropped to its real ink and scaled into the area above it. These tests draw ink to every edge of the image
 * (the worst case) and measure the boxes that were really placed.
 */
type Raster = { w: number; h: number; px: Uint8Array };
const blank = (w: number, h: number): Raster => ({ w, h, px: new Uint8Array(w * h).fill(255) });
const rect = (r: Raster, x0: number, y0: number, x1: number, y1: number) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) r.px[y * r.w + x] = 0; };
const png = (r: Raster) => sharp(Buffer.from(r.px), { raw: { width: r.w, height: r.h, channels: 1 } }).png().toBuffer().then((b) => ({ format: "png" as const, bytes: new Uint8Array(b), costUsdCents: 0, costSource: "free" as const }));

/** Ink to the bottom edge, both sides and the top: a frame plus a thick line along the last rows (like feet or grass on the edge of the canvas). */
async function edgeInk(kind: number) {
  const r = blank(1024, 1536);
  if (kind % 4 === 0) { rect(r, 0, 0, 1024, 6); rect(r, 0, 1530, 1024, 1536); rect(r, 0, 0, 6, 1536); rect(r, 1018, 0, 1024, 1536); }
  else if (kind % 4 === 1) { rect(r, 300, 500, 700, 1536); } // a tower that touches the bottom edge only
  else if (kind % 4 === 2) { rect(r, 100, 100, 900, 130); rect(r, 100, 1400, 900, 1536); rect(r, 100, 100, 130, 1536); } // lots of white on the right
  else { rect(r, 0, 1400, 1024, 1536); rect(r, 480, 200, 540, 1400); } // grass along the whole bottom
  return png(r);
}

const SHORT = "Una mañana soleada, Prueba se despierta con muchas ganas de jugar.";
const LONG = "Desde lo más alto ven el espacio con todos sus colores: ¡es todavía mejor de lo que imaginaban, y además tienen muchísimas ganas de seguir jugando con sus nuevos amigos, juntos!";
const VERY_LONG = `${LONG} ${LONG.slice(0, 30)}`;
const texts = [SHORT, LONG, VERY_LONG, "¡Hola!", ""];

const inter = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe.each([["letter", 612, 792], ["a4", 595.28, 841.89]] as const)("PDF layout on %s", (paper, W, H) => {
  for (const lang of ["es", "en"] as ColorearLang[]) {
    it(`${lang}: on all 24 pages the text never touches the drawing, both stay inside the print margin and the caption has at most 2 lines`, async () => {
      const layouts: PageLayout[] = [];
      const bytes = await assembleBook({
        lang, namesLine: lang === "es" ? "Manuela, Juan de Dios, Toby, Abuela Rosa y Pedro Luis" : "Manuela, Juan de Dios, Toby, Grandma Rose and Peter Louis", paper,
        cover: await edgeInk(0), scenes: await Promise.all(Array.from({ length: COLOREAR.scenes }, async (_, i) => ({ image: await edgeInk(i), text: texts[i % texts.length]! }))),
        brand: "Pintoria", title: "Prueba", onLayout: (l) => layouts.push(l),
      });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(COLOREAR.pagesTotal);
      expect(layouts).toHaveLength(1 + COLOREAR.scenes);
      const inside = (b: Box) => b.x >= PRINT_MARGIN - 0.01 && b.y >= PRINT_MARGIN - 0.01 && b.x + b.w <= W - PRINT_MARGIN + 0.01 && b.y + b.h <= H - PRINT_MARGIN + 0.01;
      for (const l of layouts) {
        const name = `${paper} ${lang} page ${l.page} (${l.kind})`;
        expect(l.drawing, name).not.toBeNull();
        expect(inside(l.drawing!), `${name}: drawing inside margins ${JSON.stringify(l.drawing)}`).toBe(true);
        for (const t of l.texts) {
          expect(inside(t), `${name}: text inside margins ${JSON.stringify(t)}`).toBe(true);
          expect(inter(t, l.drawing!), `${name}: text ${JSON.stringify(t)} crosses the drawing ${JSON.stringify(l.drawing)}`).toBe(false);
        }
        if (l.kind === "scene") {
          expect(l.texts.length, name).toBeLessThanOrEqual(2);
          expect(l.drawing!.y, `${name}: the drawing stays above the caption strip`).toBeGreaterThanOrEqual(PRINT_MARGIN + TEXT_STRIP - 0.01);
          if (texts[(l.page - 2) % texts.length]) expect(l.fontSize, name).toBeGreaterThanOrEqual(9);
        }
      }
      // the longest captions shrink instead of growing a third line
      const sizes = layouts.filter((l) => l.kind === "scene").map((l) => l.fontSize);
      expect(Math.min(...sizes.filter(Boolean))).toBeLessThan(17);
      expect(Math.max(...sizes)).toBe(17);
    });
  }

  it("a drawing with a wide white margin is cropped to its ink and so it uses the room above the strip", async () => {
    const r = blank(1024, 1536);
    rect(r, 400, 600, 624, 900); // small drawing in the middle of a big white canvas
    const layouts: PageLayout[] = [];
    await assembleBook({ lang: "es", namesLine: "Ana", paper, cover: await png(r), scenes: [{ image: await png(r), text: SHORT }], brand: "Pintoria", title: "t", onLayout: (l) => layouts.push(l) });
    const scene = layouts[1]!;
    const area = { w: W - 2 * PRINT_MARGIN, h: H - PRINT_MARGIN - (PRINT_MARGIN + TEXT_STRIP) };
    expect(scene.drawing!.w === area.w || scene.drawing!.h === area.h).toBe(true); // scaled to fill the area, not the 1024 x 1536 canvas
    expect(scene.drawing!.w).toBeGreaterThan(300);
  });
});

describe("the story follows the theme and never uses its label as a place", () => {
  const catalog = COLOREAR_THEMES.map((t) => t.id);
  it("every catalog theme has a pack", () => {
    expect(Object.keys(THEME_PACKS).sort()).toEqual([...catalog].sort());
  });
  for (const lang of ["es", "en"] as ColorearLang[]) {
    it(`${lang}: no scene of any adventure contains the theme label, and most scenes are about the theme`, async () => {
      for (const th of COLOREAR_THEMES) {
        const label = th[lang];
        const story = await new TemplateStoryProvider().write({ roles: ["niña", "niño"], lang, band: "5-6" as never, theme: label, themeId: th.id });
        expect(story.scenes).toHaveLength(COLOREAR.scenes);
        const pack = THEME_PACKS[th.id]!;
        let themed = 0;
        for (const s of story.scenes) {
          const text = fillNames(s.text, ["Ana", "Luis"], lang);
          // the label must never be the object of a preposition / verb of place ("ven por fin Espacio", "arrive at Christmas"); as an adjective inside a longer phrase it is fine
          expect(text, `${th.id} ${lang} scene ${s.n}: label used as a place`).not.toMatch(new RegExp(`(?:\\b(?:en|a|de|desde|por fin|at|in|to|from|see|reach|visit)\\s+)${label}(?:\\s*[.!?:]|\\s*$)`, "u"));
          expect(text.startsWith(label), `${th.id} ${lang} scene ${s.n}: starts with the raw label`).toBe(false);
          expect(text).not.toMatch(/ven por fin|they finally see/);
          const words = lang === "es" ? [pack.es.place, pack.es.at, pack.es.sights, pack.es.friend, pack.es.ride] : [pack.en.place, pack.en.at, pack.en.sights, pack.en.friend, pack.en.ride];
          if (words.some((w) => text.includes(w)) || [pack.v.place, pack.v.sights, pack.v.friend, pack.v.ride].some((w) => s.visual.includes(w))) themed++;
        }
        expect(themed, `${th.id} ${lang}: scenes about the theme`).toBeGreaterThanOrEqual(11);
      }
    });
  }
  it("a free-text theme (or none) never lands in the sentence either, and 'Espacio' is no longer a place on the summit", async () => {
    for (const lang of ["es", "en"] as const) {
      const story = await new TemplateStoryProvider().write({ roles: ["niña"], lang, band: "5-6" as never, theme: "Mi gato Pelusa", themeId: "custom" });
      for (const s of story.scenes) expect(s.text).not.toContain("Pelusa");
      expect(story.scenes.some((s) => s.visual.includes("Mi gato Pelusa"))).toBe(true);
    }
    const space = await new TemplateStoryProvider().write({ roles: ["niña"], lang: "es", band: "5-6" as never, theme: "Espacio", themeId: "space" });
    expect(space.scenes[9]!.text).toBe("Desde lo más alto ven el espacio con todos sus colores: ¡es todavía mejor de lo que imaginaban!");
    expect(space.scenes.map((s) => s.text).join(" ")).not.toMatch(/llover|arroyo|lago|río/);
  });
});
