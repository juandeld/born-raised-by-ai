/**
 * Automatic review of an image before it can enter a book (docs/dominio/colorear/paginas.md, docs/qa/colorear-rubrica.md).
 * Uses `sharp` (shipped with Next); when it is unavailable the check is skipped, never faked.
 * Thresholds are estimates [EST] to be recalibrated with the first real samples.
 */
export interface LineArtReport {
  ok: boolean;
  reasons: string[];
  /** Fraction of dark pixels (ink). */
  ink: number;
  /** Fraction of colored pixels. */
  colored: number;
  /** Fraction of mid-gray pixels (after normalizing). */
  gray: number;
  checked: boolean;
}

type Sharp = (typeof import("sharp"))["default"];
async function loadSharp(): Promise<Sharp | null> {
  try {
    const mod = (await import("sharp")) as unknown as { default?: Sharp };
    return (mod.default ?? (mod as unknown as Sharp)) as Sharp;
  } catch {
    return null;
  }
}

/** Flattens transparency onto white and converts to 8-bit grayscale PNG (pure line art prints better and weighs less). Returns the input if sharp is missing. */
export async function normalizeLineArt(bytes: Uint8Array): Promise<Uint8Array> {
  const sharp = await loadSharp();
  if (!sharp) return bytes;
  const out = await sharp(Buffer.from(bytes)).flatten({ background: "#ffffff" }).greyscale().normalise({ lower: 1, upper: 99 }).png({ compressionLevel: 9 }).toBuffer();
  return new Uint8Array(out);
}

export interface InspectOptions {
  /** Expected ink range as a fraction of the page. */
  minInk?: number;
  maxInk?: number;
  /** Fraction of the top that must be empty (cover). */
  emptyTop?: number;
}

/**
 * Most ink a page may carry, per detail level. The finer levels (9-12, adults/mandala) are meant to be dense.
 * (Incident of 25-oct: three real orders of levels 7-8, 9-12 and adults failed with too_many_fallback_pages because the
 * review rejected their fine lines; see inspectLineArt.)
 */
export function maxInkFor(band: string): number {
  return band === "adult" ? 0.6 : band === "9-12" ? 0.4 : 0.3;
}

/**
 * Reviews a page at full resolution (1024 x 1536). Shading is a mid-gray pixel with NO ink within 2 px: the anti-aliased edge of a
 * line is gray too, and on fine or dense line art (mandalas, hatching-free textures) those edges are most of the page, so a plain
 * gray count at a reduced size rejected every detailed drawing. A real gray fill or gradient has gray pixels away from any line.
 */
export async function inspectLineArt(bytes: Uint8Array, opts: InspectOptions = {}): Promise<LineArtReport> {
  const sharp = await loadSharp();
  if (!sharp) return { ok: true, reasons: [], ink: 0, colored: 0, gray: 0, checked: false };
  const W = 1024;
  const H = 1536;
  const { data } = await sharp(Buffer.from(bytes)).flatten({ background: "#ffffff" }).resize(W, H, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = W * H;
  const lumOf = new Uint8Array(n);
  let dark = 0;
  let colored = 0;
  let topInk = 0;
  const topRows = Math.floor(H * (opts.emptyTop ?? 0));
  for (let i = 0; i < n; i++) {
    const r = data[i * 3]!;
    const g = data[i * 3 + 1]!;
    const b = data[i * 3 + 2]!;
    const lum = (r + g + b) / 3;
    lumOf[i] = lum;
    if (Math.max(r, g, b) - Math.min(r, g, b) > 45) colored++;
    if (lum < 110) {
      dark++;
      if (i < topRows * W) topInk++;
    }
  }
  // A gray pixel is shading only when it sits in a flat area. Next to a line the neighborhood (2 px around) has strong contrast: the
  // anti-aliased edge of a thick line is gray beside a dark pixel, and a 1 px line is gray beside white without any dark pixel at all.
  let gray = 0;
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      const i = y * W + x;
      const l = lumOf[i]!;
      if (l < 110 || l >= 215) continue;
      let lo = l;
      let hi = l;
      for (const d of [1, 2, W, 2 * W, -1, -2, -W, -2 * W]) {
        const v = lumOf[i + d]!;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      if (hi - lo < 60) gray++;
    }
  }
  const ink = dark / n;
  const col = colored / n;
  const gr = gray / n;
  const reasons: string[] = [];
  if (ink < (opts.minInk ?? 0.008)) reasons.push("too_little_ink");
  if (ink > (opts.maxInk ?? 0.3)) reasons.push("too_much_ink");
  if (col > 0.02) reasons.push("has_color");
  if (gr > 0.05) reasons.push("has_gray_or_shading");
  if (topRows && topInk / (topRows * W) > 0.01) reasons.push("cover_top_not_empty");
  return { ok: reasons.length === 0, reasons, ink, colored: col, gray: gr, checked: true };
}
