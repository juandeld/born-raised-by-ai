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
}

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

async function drawImage(doc: PDFDocument, page: PDFPage, img: GeneratedImage, box: { x: number; y: number; w: number; h: number }): Promise<void> {
  if (img.format === "svg") {
    const art = parseArtSvg(new TextDecoder().decode(img.bytes));
    if (!art) throw new Error("unreadable mock art");
    drawPrims(page, art, box);
    return;
  }
  const png = await doc.embedPng(img.bytes);
  const s = Math.min(box.w / png.width, box.h / png.height);
  page.drawImage(png, { x: box.x + (box.w - png.width * s) / 2, y: box.y + (box.h - png.height * s) / 2, width: png.width * s, height: png.height * s });
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

  // ---- cover
  {
    const page = doc.addPage([W, H]);
    const pad = 18;
    await drawImage(doc, page, input.cover, { x: pad, y: pad, w: W - pad * 2, h: H - pad * 2 });
    // white band behind the title so any art that reaches the top never collides with the hollow letters
    page.drawRectangle({ x: 0, y: H * 0.8, width: W, height: H * 0.2, color: rgb(1, 1, 1) });
    const names = winAnsiSafe(input.namesLine, bold);
    page.drawText(winAnsiSafe(t.coverTop, bold), { x: (W - bold.widthOfTextAtSize(t.coverTop, 20)) / 2, y: H - 70, size: 20, font: bold, color: INK });
    // names in hollow letters: the child can color them
    let size = 54;
    let lines = [names];
    while (bold.widthOfTextAtSize(names, size) > W - 90 && size > 30) size -= 2;
    if (bold.widthOfTextAtSize(names, size) > W - 90) {
      lines = wrap(names, bold, 38, W - 90);
      size = 38;
    }
    page.pushOperators(setTextRenderingMode(TextRenderingMode.Outline), setLineWidth(1.6), setStrokingColor(INK));
    lines.slice(0, 3).forEach((ln, i) => {
      page.drawText(ln, { x: (W - bold.widthOfTextAtSize(ln, size)) / 2, y: H - 125 - i * (size + 8), size, font: bold, color: rgb(1, 1, 1) });
    });
    page.pushOperators(setTextRenderingMode(TextRenderingMode.Fill));
  }

  // ---- scenes
  for (const s of input.scenes) {
    const page = doc.addPage([W, H]);
    const imgH = H - 44;
    const imgW = Math.min(W - 24, (imgH * 2) / 3);
    await drawImage(doc, page, s.image, { x: (W - imgW) / 2, y: 22, w: imgW, h: imgH });
    const text = winAnsiSafe(s.text, regular);
    if (text) {
      const size = 17;
      const lines = wrap(text, regular, size, W - 110).slice(0, 4);
      // white strip so the caption never collides with art that reaches the bottom of the drawing
      page.drawRectangle({ x: 0, y: 0, width: W, height: 28 + lines.length * 21, color: rgb(1, 1, 1) });
      let y = 38 + lines.length * 21;
      for (const ln of lines) {
        y -= 21;
        page.drawText(ln, { x: (W - regular.widthOfTextAtSize(ln, size)) / 2, y: y + 14, size, font: regular, color: INK });
      }
    }
  }

  // ---- last page: draw your family
  {
    const page = doc.addPage([W, H]);
    page.drawText(t.last, { x: (W - bold.widthOfTextAtSize(t.last, 30)) / 2, y: H - 80, size: 30, font: bold, color: INK });
    const sub = wrap(t.lastSub, regular, 15, W - 120);
    sub.forEach((ln, i) => page.drawText(ln, { x: (W - regular.widthOfTextAtSize(ln, 15)) / 2, y: H - 112 - i * 20, size: 15, font: regular, color: INK }));
    page.drawRectangle({ x: 50, y: 110, width: W - 100, height: H - 270, borderColor: INK, borderWidth: 5 });
    page.drawText(t.thanks, { x: (W - regular.widthOfTextAtSize(t.thanks, 12)) / 2, y: 78, size: 12, font: regular, color: INK });
    const ai = winAnsiSafe(`${t.ai} ${input.brand}`, regular);
    wrap(ai, regular, 8, W - 120).forEach((ln, i) => page.drawText(ln, { x: (W - regular.widthOfTextAtSize(ln, 8)) / 2, y: 58 - i * 11, size: 8, font: regular, color: rgb(0.4, 0.4, 0.4) }));
  }

  return doc.save();
}
