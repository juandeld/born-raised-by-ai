import { PDFPage, rgb, LineCapStyle } from "pdf-lib";

/**
 * Tiny vector kit for the mock provider and the local pages of the book: thick black outline, white fill (so shapes hide what is
 * behind them). Output is always an SVG with a fixed, simple attribute order so the PDF assembler can parse and draw it.
 */
export interface Prim {
  d: string;
  fill: "white" | "black" | "none";
  sw: number;
}

type Seg = ["M", number, number] | ["L", number, number] | ["C", number, number, number, number, number, number] | ["Q", number, number, number, number] | ["Z"];
type Mat = [number, number, number, number, number, number];
const ID: Mat = [1, 0, 0, 1, 0, 0];
const mul = (a: Mat, b: Mat): Mat => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
];
const K = 0.5522847498;
const r1 = (n: number) => Math.round(n * 10) / 10;

export class Art {
  prims: Prim[] = [];
  private m: Mat = ID;
  private stack: Mat[] = [];
  /** Default stroke width in artboard pixels (stays constant when scaling: uniform line like a real coloring book). */
  sw: number;
  constructor(readonly width = 1024, readonly height = 1536, sw = 10) {
    this.sw = sw;
  }

  push(): void { this.stack.push(this.m); }
  pop(): void { this.m = this.stack.pop() ?? ID; }
  translate(x: number, y: number): void { this.m = mul(this.m, [1, 0, 0, 1, x, y]); }
  scale(sx: number, sy = sx): void { this.m = mul(this.m, [sx, 0, 0, sy, 0, 0]); }
  rotate(deg: number): void {
    const a = (deg * Math.PI) / 180;
    this.m = mul(this.m, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
  }
  private pt(x: number, y: number): [number, number] {
    const m = this.m;
    return [r1(m[0] * x + m[2] * y + m[4]), r1(m[1] * x + m[3] * y + m[5])];
  }

  path(segs: Seg[], fill: Prim["fill"] = "white", sw = this.sw): void {
    const out: string[] = [];
    for (const s of segs) {
      if (s[0] === "Z") out.push("Z");
      else if (s[0] === "M" || s[0] === "L") out.push(`${s[0]}${this.pt(s[1], s[2]).join(" ")}`);
      else if (s[0] === "Q") out.push(`Q${this.pt(s[1], s[2]).join(" ")} ${this.pt(s[3], s[4]).join(" ")}`);
      else out.push(`C${this.pt(s[1], s[2]).join(" ")} ${this.pt(s[3], s[4]).join(" ")} ${this.pt(s[5], s[6]).join(" ")}`);
    }
    this.prims.push({ d: out.join(""), fill, sw });
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, fill: Prim["fill"] = "white", sw = this.sw): void {
    const kx = rx * K, ky = ry * K;
    this.path([["M", cx + rx, cy], ["C", cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry], ["C", cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy], ["C", cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry], ["C", cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy], ["Z"]], fill, sw);
  }
  circle(cx: number, cy: number, r: number, fill: Prim["fill"] = "white", sw = this.sw): void { this.ellipse(cx, cy, r, r, fill, sw); }

  rect(x: number, y: number, w: number, h: number, r = 0, fill: Prim["fill"] = "white", sw = this.sw): void {
    const q = Math.min(r, w / 2, h / 2);
    if (q <= 0) return this.path([["M", x, y], ["L", x + w, y], ["L", x + w, y + h], ["L", x, y + h], ["Z"]], fill, sw);
    this.path([
      ["M", x + q, y], ["L", x + w - q, y], ["Q", x + w, y, x + w, y + q], ["L", x + w, y + h - q], ["Q", x + w, y + h, x + w - q, y + h],
      ["L", x + q, y + h], ["Q", x, y + h, x, y + h - q], ["L", x, y + q], ["Q", x, y, x + q, y], ["Z"],
    ], fill, sw);
  }

  poly(pts: Array<[number, number]>, close = true, fill: Prim["fill"] = "white", sw = this.sw): void {
    const segs: Seg[] = pts.map((p, i) => (i === 0 ? ["M", p[0], p[1]] : ["L", p[0], p[1]]) as Seg);
    if (close) segs.push(["Z"]);
    this.path(segs, close ? fill : "none", sw);
  }

  /** Smooth closed or open curve through points (Catmull-Rom to Bezier). */
  curve(pts: Array<[number, number]>, close = false, fill: Prim["fill"] = "white", sw = this.sw): void {
    const n = pts.length;
    const P = (i: number) => (close ? pts[(i + n) % n]! : pts[Math.max(0, Math.min(n - 1, i))]!);
    const segs: Seg[] = [["M", pts[0]![0], pts[0]![1]]];
    const count = close ? n : n - 1;
    for (let i = 0; i < count; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      segs.push(["C", p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]]);
    }
    if (close) segs.push(["Z"]);
    this.path(segs, close ? fill : "none", sw);
  }

  line(x1: number, y1: number, x2: number, y2: number, sw = this.sw): void { this.poly([[x1, y1], [x2, y2]], false, "none", sw); }

  /** Quadratic smile / arc from (x1,y1) to (x2,y2) bending through control (cx,cy). */
  arc(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, sw = this.sw): void { this.path([["M", x1, y1], ["Q", cx, cy, x2, y2]], "none", sw); }

  star(cx: number, cy: number, R: number, r: number, n = 5, fill: Prim["fill"] = "white"): void {
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI * i) / n - Math.PI / 2;
      const rad = i % 2 === 0 ? R : r;
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
    }
    this.poly(pts, true, fill);
  }

  cloud(cx: number, cy: number, w: number): void {
    const h = w * 0.45;
    this.curve([[cx - w / 2, cy + h / 2], [cx - w / 2 - h * 0.1, cy], [cx - w * 0.25, cy - h * 0.15], [cx - w * 0.12, cy - h * 0.55], [cx + w * 0.12, cy - h * 0.5], [cx + w * 0.25, cy - h * 0.1], [cx + w / 2 + h * 0.1, cy], [cx + w / 2, cy + h / 2]], true);
  }

  toSvg(): string {
    const body = this.prims
      .map((p) => `<path d="${p.d}" fill="${p.fill === "white" ? "#fff" : p.fill === "black" ? "#111" : "none"}" stroke="#111" stroke-width="${p.sw}"/>`)
      .join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}"><rect width="${this.width}" height="${this.height}" fill="#fff"/>${body}</svg>`;
  }
}

/** Parses the SVG produced by Art.toSvg (fixed attribute order). Returns null for anything else. */
export function parseArtSvg(svg: string): { width: number; height: number; prims: Prim[] } | null {
  const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  if (!vb) return null;
  const prims: Prim[] = [];
  const re = /<path d="([^"]*)" fill="([^"]*)" stroke="#111" stroke-width="([\d.]+)"\/>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg))) prims.push({ d: m[1]!, fill: m[2] === "#fff" ? "white" : m[2] === "#111" ? "black" : "none", sw: Number(m[3]) });
  return { width: Number(vb[1]), height: Number(vb[2]), prims };
}

/** Draws prims onto a PDF page, scaled to fit `box` (x, y = bottom-left in PDF points). */
export function drawPrims(page: PDFPage, art: { width: number; height: number; prims: Prim[] }, box: { x: number; y: number; w: number; h: number }): void {
  const s = Math.min(box.w / art.width, box.h / art.height);
  const ox = box.x + (box.w - art.width * s) / 2;
  const top = box.y + (box.h + art.height * s) / 2;
  for (const p of art.prims) {
    page.drawSvgPath(p.d, {
      x: ox,
      y: top,
      scale: s,
      color: p.fill === "white" ? rgb(1, 1, 1) : p.fill === "black" ? rgb(0.07, 0.07, 0.07) : undefined,
      borderColor: rgb(0.07, 0.07, 0.07),
      borderWidth: p.sw * s,
      borderLineCap: LineCapStyle.Round,
    });
  }
}
