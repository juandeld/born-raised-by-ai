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

export async function inspectLineArt(bytes: Uint8Array, opts: InspectOptions = {}): Promise<LineArtReport> {
  const sharp = await loadSharp();
  if (!sharp) return { ok: true, reasons: [], ink: 0, colored: 0, gray: 0, checked: false };
  const W = 256;
  const H = 384;
  const { data } = await sharp(Buffer.from(bytes)).flatten({ background: "#ffffff" }).resize(W, H, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let dark = 0;
  let colored = 0;
  let gray = 0;
  let topInk = 0;
  const topRows = Math.floor(H * (opts.emptyTop ?? 0));
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3]!;
    const g = data[i * 3 + 1]!;
    const b = data[i * 3 + 2]!;
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const lum = (r + g + b) / 3;
    if (mx - mn > 45) colored++;
    if (lum < 110) {
      dark++;
      if (i < topRows * W) topInk++;
    } else if (lum < 215) gray++;
  }
  const n = W * H;
  const ink = dark / n;
  const col = colored / n;
  const gr = gray / n;
  const reasons: string[] = [];
  if (ink < (opts.minInk ?? 0.008)) reasons.push("too_little_ink");
  if (ink > (opts.maxInk ?? 0.3)) reasons.push("too_much_ink");
  if (col > 0.02) reasons.push("has_color");
  if (gr > 0.2) reasons.push("has_gray_or_shading");
  if (topRows && topInk / (topRows * W) > 0.01) reasons.push("cover_top_not_empty");
  return { ok: reasons.length === 0, reasons, ink, colored: col, gray: gr, checked: true };
}
