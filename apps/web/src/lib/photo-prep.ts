/**
 * Photo preparation in the browser. The buyer may pick ANY phone photo or screenshot, of any size (a 48 MP camera photo, a 15 MB iPhone
 * screenshot, a HEIC): the size limit applies only to what is SENT, never to the original. The original is decoded, rotated upright
 * (EXIF), scaled down in steps and re-encoded as JPEG of about 640 KB (this also strips GPS and every other piece of metadata); only that
 * small JPEG goes to the server, which still re-encodes it and strips metadata again.
 *
 * - Decoding: `createImageBitmap` (off the main thread), then an `<img>` as a fallback for browsers that lack an option.
 * - HEIC/HEIF: Safari decodes it natively. Where the browser cannot (Chrome on Android or desktop), a decoder is loaded on demand
 *   (`heic-to`, only in that case; the photo never leaves the device). A server-side conversion is not an option: the prebuilt image
 *   library on Vercel has no HEVC decoder and a function cannot receive more than 4.5 MB per request.
 * - EXIF orientation: browsers that apply it do it while decoding; a one-pixel probe checks that once, and only if a browser does not,
 *   the rotation is done here.
 * - One photo at a time (`serial`): 15 large photos never decode together, so the page stays responsive.
 */
import { COLOREAR } from "@lumen/config";

export type PhotoErrorCode = "too_big" | "not_image" | "unreadable" | "heic_failed";

export class PhotoPrepError extends Error {
  constructor(readonly code: PhotoErrorCode, detail = "") {
    super(`${code}${detail ? `: ${detail}` : ""}`);
  }
}

export type PhotoKind = "jpeg" | "png" | "webp" | "gif" | "bmp" | "heic" | "avif" | "tiff" | "svg" | "unknown";

const HEIC_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"]);

/** What a file is from its first bytes (the type the browser reports can be empty or wrong, especially for HEIC). */
export function sniffKind(head: Uint8Array): PhotoKind {
  const at = (i: number) => head[i] ?? 0;
  const ascii = (from: number, n: number) => String.fromCharCode(...Array.from(head.subarray(from, from + n)));
  if (at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) return "jpeg";
  if (ascii(0, 8) === "\x89PNG\r\n\x1a\n") return "png";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return "webp";
  if (ascii(0, 2) === "BM") return "bmp";
  if (ascii(4, 4) === "ftyp") {
    const brand = ascii(8, 4).toLowerCase();
    if (brand === "avif" || brand === "avis") return "avif";
    if (HEIC_BRANDS.has(brand)) return "heic";
  }
  if ((ascii(0, 4) === "II*\0") || ascii(0, 4) === "MM\0*") return "tiff"; // also the base of DNG raw files
  if (/<svg[\s>]|<\?xml/i.test(ascii(0, Math.min(head.length, 512)))) return "svg";
  return "unknown";
}

/** Orientation (1 to 8) and pixel size read from the header of a JPEG, without decoding it. */
export function jpegInfo(b: Uint8Array): { orientation: number; width: number; height: number } | null {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let orientation = 1;
  let size: { width: number; height: number } | null = null;
  let i = 2;
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1]!;
    if (marker === 0xff) { i++; continue; }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    if (marker === 0xd9 || marker === 0xda) break; // end of image / start of the scan: the header is over
    const len = (b[i + 2]! << 8) | b[i + 3]!;
    if (marker === 0xe1 && b[i + 4] === 0x45 && b[i + 5] === 0x78 && b[i + 6] === 0x69 && b[i + 7] === 0x66) orientation = exifOrientation(b, i + 10, i + 2 + len) ?? orientation;
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) size = { height: (b[i + 5]! << 8) | b[i + 6]!, width: (b[i + 7]! << 8) | b[i + 8]! };
    i += 2 + len;
  }
  return size ? { orientation, ...size } : { orientation, width: 0, height: 0 };
}

function exifOrientation(b: Uint8Array, tiff: number, end: number): number | null {
  if (tiff + 8 > b.length) return null;
  const little = b[tiff] === 0x49 && b[tiff + 1] === 0x49;
  if (!little && !(b[tiff] === 0x4d && b[tiff + 1] === 0x4d)) return null;
  const u16 = (o: number) => (little ? b[o]! | (b[o + 1]! << 8) : (b[o]! << 8) | b[o + 1]!);
  const u32 = (o: number) => (little ? (b[o]! | (b[o + 1]! << 8) | (b[o + 2]! << 16) | (b[o + 3]! << 24)) >>> 0 : ((b[o]! << 24) | (b[o + 1]! << 16) | (b[o + 2]! << 8) | b[o + 3]!) >>> 0);
  const ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > Math.min(end, b.length)) return null;
  const n = u16(ifd);
  for (let k = 0; k < n; k++) {
    const e = ifd + 2 + k * 12;
    if (e + 12 > b.length) return null;
    if (u16(e) === 0x0112) {
      const v = u16(e + 8);
      return v >= 1 && v <= 8 ? v : null;
    }
  }
  return null;
}

// ------------------------------------------------------------------ browser part

/** Longest side of the first reduction (the decoded original is dropped right after). */
const BASE_SIDE = 2048;
/** Where the JPEG loop starts: the server keeps at most 1536 px and the model sees less, so this is plenty for a face. */
const START_SIDE = 1280;
const START_QUALITY = 0.82;
/** Hard limit of a photo the server accepts (COLOREAR.maxPhotoBytes). */
const SENT_MAX = COLOREAR.maxPhotoBytes;
const DECODE_TIMEOUT_MS = 30_000;
const HEIC_TIMEOUT_MS = 90_000;

/** A 2x1 JPEG whose EXIF orientation is 6: a browser that applies EXIF decodes it as 1x2. */
const PROBE_JPEG_B64 = "/9j/4QC8RXhpZgAASUkqAAgAAAAGABIBAwABAAAABgAAABoBBQABAAAAVgAAABsBBQABAAAAXgAAACgBAwABAAAAAgAAABMCAwABAAAAAQAAAGmHBAABAAAAZgAAAAAAAAA4YwAA6AMAADhjAADoAwAABgAAkAcABAAAADAyMTABkQcABAAAAAECAwAAoAcABAAAADAxMDABoAMAAQAAAP//AAACoAQAAQAAAAIAAAADoAQAAQAAAAEAAAAAAAAA/+IB8ElDQ19QUk9GSUxFAAEBAAAB4GxjbXMEIAAAbW50clJHQiBYWVogB+IAAwAUAAkADgAdYWNzcE1TRlQAAAAAc2F3c2N0cmwAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1oYW5keem/Vlo+AbaDI4VVRvdPqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKZGVzYwAAAPwAAAAkY3BydAAAASAAAAAid3RwdAAAAUQAAAAUY2hhZAAAAVgAAAAsclhZWgAAAYQAAAAUZ1hZWgAAAZgAAAAUYlhZWgAAAawAAAAUclRSQwAAAcAAAAAgZ1RSQwAAAcAAAAAgYlRSQwAAAcAAAAAgbWx1YwAAAAAAAAABAAAADGVuVVMAAAAIAAAAHABzAFIARwBCbWx1YwAAAAAAAAABAAAADGVuVVMAAAAGAAAAHABDAEMAMAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDD8AAAXd///zJgAAB5AAAP2S///7of///aIAAAPcAADAcVhZWiAAAAAAAABvoAAAOPIAAAOPWFlaIAAAAAAAAGKWAAC3iQAAGNpYWVogAAAAAAAAJKAAAA+FAAC2xHBhcmEAAAAAAAMAAAACZmkAAPKnAAANWQAAE9AAAApb/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAAQACAwEiAAIRAQMRAf/EABUAAQEAAAAAAAAAAAAAAAAAAAAI/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/EABUBAQEAAAAAAAAAAAAAAAAAAAcJ/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AnQAGKpv/2Q==";

interface Decoded {
  src: CanvasImageSource;
  width: number;
  height: number;
  path: "bitmap" | "img";
  close(): void;
}

const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new PhotoPrepError("unreadable", "timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });

async function decodeBlob(blob: Blob): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
      return { src: bmp, width: bmp.width, height: bmp.height, path: "bitmap", close: () => bmp.close() };
    } catch {
      /* an option this browser does not know, or a format it cannot read: try an <img> */
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    if (!img.naturalWidth || !img.naturalHeight) throw new Error("empty");
    return { src: img, width: img.naturalWidth, height: img.naturalHeight, path: "img", close: () => URL.revokeObjectURL(url) };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

const exifApplied: Partial<Record<"bitmap" | "img", boolean>> = {};
/** Does this browser rotate by EXIF while decoding (through the given decode path)? Asked once, with a 2x1 probe. */
async function appliesExif(path: "bitmap" | "img"): Promise<boolean> {
  const known = exifApplied[path];
  if (known !== undefined) return known;
  let applied = true; // when in doubt, trust the browser: every current browser applies it
  try {
    const bytes = Uint8Array.from(atob(PROBE_JPEG_B64), (c) => c.charCodeAt(0));
    const d = await decodeBlob(new Blob([bytes], { type: "image/jpeg" }));
    if (d.path === path) applied = d.width === 1 && d.height === 2;
    d.close();
  } catch {
    /* keep the default */
  }
  exifApplied[path] = applied;
  return applied;
}

function newCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}
const release = (c: HTMLCanvasElement) => { c.width = 0; c.height = 0; }; // iOS keeps canvas memory until it is resized to nothing

function context(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext("2d");
  if (!ctx) throw new PhotoPrepError("unreadable", "no canvas");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return ctx;
}

/** Scales `src` down to tw x th in steps of at most one half (one big step aliases, especially in Safari), white background for transparency. */
function downscale(src: CanvasImageSource, sw: number, sh: number, tw: number, th: number): HTMLCanvasElement {
  let cur: CanvasImageSource = src;
  let cw = sw;
  let ch = sh;
  let prev: HTMLCanvasElement | null = null;
  while (cw / 2 > tw && ch / 2 > th) {
    const c = newCanvas(cw / 2, ch / 2);
    const ctx = context(c);
    ctx.drawImage(cur, 0, 0, c.width, c.height);
    if (prev) release(prev);
    prev = c;
    cur = c;
    cw = c.width;
    ch = c.height;
  }
  const out = newCanvas(tw, th);
  const ctx = context(out);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(cur, 0, 0, out.width, out.height);
  if (prev) release(prev);
  return out;
}

/** Draws `c` rotated/flipped so that EXIF orientation `o` (2 to 8) becomes upright; `c` is released. Used only when a browser does not apply EXIF itself. */
export function orientCanvas(c: HTMLCanvasElement, o: number): HTMLCanvasElement {
  const swap = o >= 5;
  const out = newCanvas(swap ? c.height : c.width, swap ? c.width : c.height);
  const ctx = context(out);
  const w = c.width;
  const h = c.height;
  // [a, b, c, d, e, f] of the canvas transform for each orientation (the standard table)
  const t: Record<number, [number, number, number, number, number, number]> = {
    2: [-1, 0, 0, 1, w, 0], 3: [-1, 0, 0, -1, w, h], 4: [1, 0, 0, -1, 0, h],
    5: [0, 1, 1, 0, 0, 0], 6: [0, 1, -1, 0, h, 0], 7: [0, -1, -1, 0, h, w], 8: [0, -1, 1, 0, 0, w],
  };
  const m = t[o];
  if (m) ctx.setTransform(...m);
  ctx.drawImage(c, 0, 0);
  release(c);
  return out;
}

/** The decoded original reduced to at most BASE_SIDE px and upright; the full-size original is released by the caller. */
async function toBase(file: Blob, kind: PhotoKind, head: Uint8Array): Promise<HTMLCanvasElement> {
  let d: Decoded | null = null;
  let manual = 1; // EXIF orientation this code must apply itself
  const jpeg = kind === "jpeg" ? jpegInfo(head) : null;
  if (kind === "heic") {
    try {
      d = await withTimeout(decodeBlob(file), DECODE_TIMEOUT_MS); // Safari reads HEIC itself
    } catch {
      d = await decodeHeic(file);
    }
  } else {
    d = await withTimeout(decodeBlob(file), DECODE_TIMEOUT_MS);
    // the browser rotates by EXIF while decoding; only when it does not is the rotation done here
    if (jpeg && jpeg.orientation > 1 && !(await appliesExif(d.path))) manual = jpeg.orientation;
  }
  try {
    const k = Math.min(1, BASE_SIDE / Math.max(d.width, d.height));
    const scaled = downscale(d.src, d.width, d.height, d.width * k, d.height * k);
    return manual > 1 ? orientCanvas(scaled, manual) : scaled;
  } finally {
    d.close();
  }
}

/** HEIC the browser cannot read: decode it with a library that is downloaded only now. */
async function decodeHeic(file: Blob): Promise<Decoded> {
  try {
    const { heicTo } = await import("heic-to/csp");
    const bmp = await withTimeout(heicTo({ blob: file, type: "bitmap" }), HEIC_TIMEOUT_MS);
    return { src: bmp, width: bmp.width, height: bmp.height, path: "bitmap", close: () => bmp.close() };
  } catch (err) {
    throw new PhotoPrepError("heic_failed", err instanceof Error ? err.message : String(err));
  }
}

const blobOf = (c: HTMLCanvasElement, quality: number) => new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", quality));

/** JPEG of at most `target` bytes from `base`: smaller and smaller until it fits (a photo of any content gets there well before the end). */
async function encode(base: HTMLCanvasElement, target: number, side = START_SIDE, quality = START_QUALITY): Promise<Blob> {
  let best: Blob | null = null;
  for (let i = 0; i < 10; i++) {
    const k = Math.min(1, side / Math.max(base.width, base.height));
    const c = downscale(base, base.width, base.height, base.width * k, base.height * k);
    const blob = await blobOf(c, quality);
    release(c);
    if (blob && (!best || blob.size < best.size)) best = blob;
    if (blob && blob.size <= target) return blob;
    quality = Math.max(0.5, quality - 0.07);
    side = Math.round(side * 0.85);
  }
  if (best && best.size <= SENT_MAX) return best;
  throw new PhotoPrepError("unreadable", "cannot shrink");
}

/** One at a time: a queue of heavy decodes never blocks the page for long and never holds two originals in memory. */
let tail: Promise<unknown> = Promise.resolve();
function serial<T>(job: () => Promise<T>): Promise<T> {
  const run = tail.then(job, job);
  tail = run.catch(() => undefined);
  return run;
}

export interface PrepareOptions {
  /** JPEG size to aim for (default 640 KB). */
  target?: number;
}

export const TARGET_BYTES = 640_000;

/**
 * A phone photo or screenshot of any size, ready to send: upright, no metadata, JPEG of about `target` bytes. Throws PhotoPrepError
 * ("too_big" over ~60 MB, "not_image", "unreadable" for RAW/DNG or a damaged file, "heic_failed").
 */
export function preparePhoto(file: Blob & { name?: string }, opts: PrepareOptions = {}): Promise<Blob> {
  return serial(async () => {
    if (file.size > COLOREAR.maxOriginalBytes) throw new PhotoPrepError("too_big");
    if (file.size === 0) throw new PhotoPrepError("unreadable", "empty");
    const head = new Uint8Array(await file.slice(0, 262_144).arrayBuffer());
    const kind = sniffKind(head);
    if (kind === "svg" || (kind === "unknown" && !/^image\//.test(file.type))) throw new PhotoPrepError("not_image");
    const base = await toBase(file, kind, head).catch((err) => {
      throw err instanceof PhotoPrepError ? err : new PhotoPrepError("unreadable", err instanceof Error ? err.message : String(err));
    });
    try {
      return await encode(base, opts.target ?? TARGET_BYTES);
    } finally {
      release(base);
    }
  });
}

/** Makes an already prepared photo smaller (the whole order must fit one request). */
export function shrinkPhoto(blob: Blob, target: number): Promise<Blob> {
  return serial(async () => {
    const d = await withTimeout(decodeBlob(blob), DECODE_TIMEOUT_MS);
    const base = downscale(d.src, d.width, d.height, d.width, d.height);
    const longest = Math.max(d.width, d.height);
    d.close();
    try {
      return await encode(base, target, Math.round(longest * 0.85), 0.72);
    } finally {
      release(base);
    }
  });
}
