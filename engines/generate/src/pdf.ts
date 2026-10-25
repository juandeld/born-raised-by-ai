import { PDFDocument, PDFFont, PDFPage, StandardFonts, TextRenderingMode, rgb, setLineWidth, setStrokingColor, setTextRenderingMode } from "pdf-lib";
import type { ColorearLang } from "@lumen/config";
import { Art, drawPrims, parseArtSvg } from "./mock-art/kit";
import type { GeneratedImage } from "./types";

export interface BookPage {
  image: GeneratedImage;
  /** Text under the drawing ("" for none). */
  text: string;
}

export interface BookInput {
  lang: ColorearLang;
  /** "Manuela, Juan de Dios y Toby" */
  namesLine: string;
  paper: "letter" | "a4";
  cover: GeneratedImage;
  scenes: BookPage[];
  brand: string;
  title: string;
  /** Test hook: receives the real boxes (PDF points, origin bottom-left) of the drawing and of the text of every page. */
  onLayout?: (page: PageLayout) => void;
}

export interface Box { x: number; y: number; w: number; h: number }
export interface PageLayout {
  /** 1 = cover, 2..n = scenes, last = "draw your family". */
  page: number;
  kind: "cover" | "scene" | "last";
  /** Area of the page the drawing was placed in (its ink, cropped), or null when the page has no drawing. */
  drawing: Box | null;
  /** Rectangles of the text drawn on the page (one per line). */
  texts: Box[];
  fontSize: number;
}

/** Print margin on every side: 0.5 in, safe for letter and A4 on any home printer. */
export const PRINT_MARGIN = 36;
/** Height of the strip reserved for the caption under every scene drawing, above the bottom margin. Never used by the drawing. */
export const TEXT_STRIP = 62;
const CAPTION_MAX = 17;
const CAPTION_MIN = 9;
const CAPTION_LINES = 2;

const SIZES = { letter: [612, 792], a4: [595.28, 841.89] } as const;
const INK = rgb(0.07, 0.07, 0.07);

const L = {
  es: { coverTop: "La aventura de", last: "Ahora te toca a ti", lastSub: "Dibuja a tu familia en este marco y coloréala.", ai: "Ilustraciones e historia creadas con nuestro proceso propio de ilustración asistido por inteligencia artificial; pueden tener imperfecciones.", thanks: "Gracias por colorear. ¡Hasta la próxima aventura!" },
  en: { coverTop: "The adventure of", last: "Now it is your turn", lastSub: "Draw your family inside this frame and color them in.", ai: "Illustrations and story created with our own illustration process assisted by artificial intelligence; they may have imperfections.", thanks: "Thanks for coloring. See you on the next adventure!" },
};

/** Keeps only characters the standard font can encode (WinAnsi). */
export function winAnsiSafe(text: string, font: PDFFont): string {
  let out = "";
  for (const ch of text.normalize("NFC")) {
    try {
      font.encodeText(ch);
      out += ch;
    } catch {
      out += ch === "’" ? "'" : "";
    }
  }
  return out;
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(t, size) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

type Sharp = (typeof import("sharp"))["default"];
let sharpLoad: Promise<Sharp | null> | undefined;
function loadSharp(): Promise<Sharp | null> {
  sharpLoad ??= import("sharp").then((m) => { const mod = m as unknown as { default?: Sharp }; return mod.default ?? (mod as unknown as Sharp); }, () => null);
  return sharpLoad;
}

/** The drawing cropped to its real ink (white margins removed, 6 px of air kept), or null when it cannot be measured (no sharp, blank page). */
export async function cropToInk(bytes: Uint8Array): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  const sharp = await loadSharp();
  if (!sharp) return null;
  try {
    const flat = await sharp(Buffer.from(bytes)).flatten({ background: "#ffffff" }).greyscale().png().toBuffer();
    const full = await sharp(flat).metadata();
    const { info } = await sharp(flat).trim({ background: "#ffffff", threshold: 30 }).toBuffer({ resolveWithObject: true });
    const air = 6;
    const left = Math.max(0, -(info.trimOffsetLeft ?? 0) - air);
    const top = Math.max(0, -(info.trimOffsetTop ?? 0) - air);
    const width = Math.min(full.width! - left, info.width + 2 * air);
    const height = Math.min(full.height! - top, info.height + 2 * air);
    if (width < 8 || height < 8) return null;
    const out = await sharp(flat).extract({ left, top, width, height }).png({ compressionLevel: 9 }).toBuffer();
    return { bytes: new Uint8Array(out), width, height };
  } catch {
    return null;
  }
}

/** Draws the image scaled to fit `box` and centered, and returns the rectangle it really covers. Art is measured by its ink, never by its canvas. */
async function drawImage(doc: PDFDocument, page: PDFPage, img: GeneratedImage, box: Box): Promise<Box> {
  if (img.format === "svg") {
    const art = parseArtSvg(new TextDecoder().decode(img.bytes));
    if (!art) throw new Error("unreadable mock art");
    // inset by 2 pt so a stroke on the canvas edge cannot cross the box
    const inner = { x: box.x + 2, y: box.y + 2, w: box.w - 4, h: box.h - 4 };
    drawPrims(page, art, inner);
    const sc = Math.min(inner.w / art.width, inner.h / art.height);
    return { x: inner.x + (inner.w - art.width * sc) / 2, y: inner.y + (inner.h - art.height * sc) / 2, w: art.width * sc, h: art.height * sc };
  }
  const ink = await cropToInk(img.bytes);
  const png = await doc.embedPng(ink ? ink.bytes : img.bytes);
  const s = Math.min(box.w / png.width, box.h / png.height);
  const placed = { x: box.x + (box.w - png.width * s) / 2, y: box.y + (box.h - png.height * s) / 2, w: png.width * s, h: png.height * s };
  page.drawImage(png, { x: placed.x, y: placed.y, width: placed.w, height: placed.h });
  return placed;
}

/** Largest size (CAPTION_MAX down to CAPTION_MIN) at which the caption fits in 2 lines; at the minimum it is cut after 2 lines with an ellipsis. */
export function fitCaption(text: string, font: PDFFont, maxW: number): { lines: string[]; size: number } {
  for (let size = CAPTION_MAX; size >= CAPTION_MIN; size -= 0.5) {
    const lines = wrap(text, font, size, maxW);
    if (lines.length <= CAPTION_LINES) return { lines, size };
  }
  const lines = wrap(text, font, CAPTION_MIN, maxW).slice(0, CAPTION_LINES);
  const last = lines[CAPTION_LINES - 1]!;
  lines[CAPTION_LINES - 1] = `${last.replace(/[\s,;:.]+$/, "")}...`;
  return { lines, size: CAPTION_MIN };
}

/** Cover + scenes + final "draw your family" page. 24 pages in production. */
export async function assembleBook(input: BookInput): Promise<Uint8Array> {
  const [W, H] = SIZES[input.paper];
  const t = L[input.lang];
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  doc.setTitle(winAnsiSafe(input.title, bold) || "Coloring book");
  doc.setAuthor(input.brand);
  doc.setProducer(input.brand);
  doc.setCreator(input.brand);

  // ---- cover: the title block on top, the drawing below it (never behind it)
  {
    const page = doc.addPage([W, H]);
    const names = winAnsiSafe(input.namesLine, bold);
    const texts: Box[] = [];
    const put = (txt: string, x: number, y: number, size: number) => texts.push({ x, y: y - size * 0.22, w: bold.widthOfTextAtSize(txt, size), h: size * 1.1 });
    const top = H - PRINT_MARGIN;
    const kickerSize = 20;
    const kickerY = top - kickerSize;
    page.drawText(winAnsiSafe(t.coverTop, bold), { x: (W - bold.widthOfTextAtSize(t.coverTop, kickerSize)) / 2, y: kickerY, size: kickerSize, font: bold, color: INK });
    put(t.coverTop, (W - bold.widthOfTextAtSize(t.coverTop, kickerSize)) / 2, kickerY, kickerSize);
    // names in hollow letters: the child can color them
    let size = 54;
    let lines = [names];
    while (bold.widthOfTextAtSize(names, size) > W - 2 * PRINT_MARGIN - 20 && size > 30) size -= 2;
    if (bold.widthOfTextAtSize(names, size) > W - 2 * PRINT_MARGIN - 20) {
      lines = wrap(names, bold, 38, W - 2 * PRINT_MARGIN - 20);
      size = 38;
    }
    lines = lines.slice(0, 3);
    page.pushOperators(setTextRenderingMode(TextRenderingMode.Outline), setLineWidth(1.6), setStrokingColor(INK));
    let lastBaseline = kickerY;
    lines.forEach((ln, i) => {
      const x = (W - bold.widthOfTextAtSize(ln, size)) / 2;
      const y = kickerY - 14 - size - i * (size + 8);
      page.drawText(ln, { x, y, size, font: bold, color: rgb(1, 1, 1) });
      put(ln, x, y, size);
      lastBaseline = y;
    });
    page.pushOperators(setTextRenderingMode(TextRenderingMode.Fill));
    const titleBottom = lastBaseline - size * 0.25 - 14;
    const placed = await drawImage(doc, page, input.cover, { x: PRINT_MARGIN, y: PRINT_MARGIN, w: W - 2 * PRINT_MARGIN, h: titleBottom - PRINT_MARGIN });
    input.onLayout?.({ page: 1, kind: "cover", drawing: placed, texts, fontSize: size });
  }

  // ---- scenes: the drawing above, a strip below that belongs to the caption alone
  let pageNo = 1;
  for (const s of input.scenes) {
    pageNo++;
    const page = doc.addPage([W, H]);
    const areaBottom = PRINT_MARGIN + TEXT_STRIP;
    const placed = await drawImage(doc, page, s.image, { x: PRINT_MARGIN, y: areaBottom, w: W - 2 * PRINT_MARGIN, h: H - PRINT_MARGIN - areaBottom });
    const text = winAnsiSafe(s.text, regular);
    const texts: Box[] = [];
    let fontSize = 0;
    if (text) {
      const fit = fitCaption(text, regular, W - 2 * PRINT_MARGIN - 8);
      fontSize = fit.size;
      const lead = fit.size * 1.25;
      const block = (fit.lines.length - 1) * lead + fit.size;
      // vertically centered in the strip, which sits between the bottom margin and the drawing area
      const first = PRINT_MARGIN + (TEXT_STRIP - block) / 2 + block - fit.size + 0; // baseline of the first line
      fit.lines.forEach((ln, i) => {
        const w = regular.widthOfTextAtSize(ln, fit.size);
        const x = (W - w) / 2;
        const y = first - i * lead;
        page.drawText(ln, { x, y, size: fit.size, font: regular, color: INK });
        texts.push({ x, y: y - fit.size * 0.22, w, h: fit.size * 1.1 });
      });
    }
    input.onLayout?.({ page: pageNo, kind: "scene", drawing: placed, texts, fontSize });
  }

  // ---- last page: draw your family
  {
    const page = doc.addPage([W, H]);
    page.drawText(t.last, { x: (W - bold.widthOfTextAtSize(t.last, 30)) / 2, y: H - 80, size: 30, font: bold, color: INK });
    const sub = wrap(t.lastSub, regular, 15, W - 120);
    sub.forEach((ln, i) => page.drawText(ln, { x: (W - regular.widthOfTextAtSize(ln, 15)) / 2, y: H - 112 - i * 20, size: 15, font: regular, color: INK }));
    page.drawRectangle({ x: 50, y: 140, width: W - 100, height: H - 300, borderColor: INK, borderWidth: 5 });
    page.drawText(t.thanks, { x: (W - regular.widthOfTextAtSize(t.thanks, 12)) / 2, y: 112, size: 12, font: regular, color: INK });
    const ai = winAnsiSafe(`${t.ai} ${input.brand}`, regular);
    wrap(ai, regular, 8, W - 120).forEach((ln, i) => page.drawText(ln, { x: (W - regular.widthOfTextAtSize(ln, 8)) / 2, y: 94 - i * 11, size: 8, font: regular, color: rgb(0.4, 0.4, 0.4) }));
  }

  return doc.save();
}
