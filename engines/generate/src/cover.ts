/**
 * Cover fallback built from the REAL generated characters: when the model cannot draw a clean cover after its retries, the
 * characters of the book (already approved line art) are placed side by side under the title area. Never stick figures.
 */
type Sharp = (typeof import("sharp"))["default"];

export async function composeCoverFromCharacters(chars: Uint8Array[]): Promise<Uint8Array | null> {
  if (!chars.length) return null;
  let sharp: Sharp;
  try {
    const mod = (await import("sharp")) as unknown as { default?: Sharp };
    sharp = (mod.default ?? (mod as unknown as Sharp)) as Sharp;
  } catch {
    return null;
  }
  try {
    const W = 1024;
    const H = 1536;
    const top = Math.round(H * 0.26);
    const n = Math.min(chars.length, 5);
    const size = Math.min(1000, Math.round((W * (n === 1 ? 1 : 1.12)) / n));
    const step = n === 1 ? 0 : (W - size) / (n - 1);
    const layers: Array<{ input: Buffer; left: number; top: number; blend: "darken" }> = [];
    for (let i = 0; i < n; i++) {
      const input = await sharp(Buffer.from(chars[i]!)).flatten({ background: "#ffffff" }).resize(size, size, { fit: "contain", background: "#ffffff" }).png().toBuffer();
      const y = top + Math.round((H - top - size) / 2) + (n > 2 && i % 2 === 1 ? -Math.round(size * 0.06) : 0);
      layers.push({ input, left: Math.round(n === 1 ? (W - size) / 2 : step * i), top: Math.max(top, y), blend: "darken" });
    }
    const out = await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } }).composite(layers).greyscale().png({ compressionLevel: 9 }).toBuffer();
    return new Uint8Array(out);
  } catch {
    return null;
  }
}
