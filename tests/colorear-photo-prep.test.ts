import { spawnSync } from "node:child_process";
import { closeSync, copyFileSync, ftruncateSync, mkdtempSync, openSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { COLOREAR } from "@lumen/config";
import { jpegInfo, sniffKind } from "../apps/web/src/lib/photo-prep";

/**
 * Photos the buyer picks can be of any size: a 48 MP camera JPEG, an iPhone screenshot PNG of 10 to 20 MB, a JPEG that is only rotated by
 * its EXIF tag, a HEIC. The limit applies only to what is SENT. The files are generated here (nothing is read from a person), the real
 * `photo-prep.ts` is bundled and run in a real Chromium (Playwright for Python, skipped when it is not installed), and every result is
 * checked: small JPEG, upright, readable, no limit talk for the original.
 */
const dir = mkdtempSync(join(tmpdir(), "lumen-photoprep-"));
const noise = (w: number, h: number, sigma: number) => sharp({ create: { width: w, height: h, channels: 3, background: { r: 128, g: 128, b: 128 }, noise: { type: "gaussian", mean: 128, sigma } } });
/** A landscape picture whose top-left quarter is red and the rest gray: where the red ends up shows which way the picture was turned. */
const quarter = async (orientation: number) => {
  const red = await sharp({ create: { width: 400, height: 200, channels: 3, background: { r: 230, g: 30, b: 30 } } }).png().toBuffer();
  return sharp({ create: { width: 800, height: 400, channels: 3, background: { r: 128, g: 128, b: 128 } } }).composite([{ input: red, left: 0, top: 0 }]).jpeg({ quality: 95 }).withMetadata({ orientation }).toBuffer();
};

const run = (args: string[]) => spawnSync("python3", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 280_000 });
const browserOk = (() => {
  const r = spawnSync("python3", ["-c", "from playwright.sync_api import sync_playwright as s\np=s().start()\nb=p.chromium.launch()\nb.close()\np.stop()"], { encoding: "utf8", timeout: 60_000 });
  return r.status === 0;
})();

describe("what the files look like before anything is decoded", () => {
  it("recognizes the formats from their first bytes, whatever name or type the browser gives", async () => {
    expect(sniffKind(new Uint8Array(await sharp({ create: { width: 4, height: 4, channels: 3, background: "#fff" } }).jpeg().toBuffer()))).toBe("jpeg");
    expect(sniffKind(new Uint8Array(await sharp({ create: { width: 4, height: 4, channels: 3, background: "#fff" } }).png().toBuffer()))).toBe("png");
    expect(sniffKind(new Uint8Array(await sharp({ create: { width: 4, height: 4, channels: 3, background: "#fff" } }).webp().toBuffer()))).toBe("webp");
    expect(sniffKind(new Uint8Array(readFileSync(resolve(__dirname, "fixtures/phone-sample.heic"))))).toBe("heic");
    expect(sniffKind(new TextEncoder().encode("hello, this is not a picture"))).toBe("unknown");
    expect(sniffKind(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe("svg");
    expect(sniffKind(new Uint8Array([0x49, 0x49, 0x2a, 0x00, 8, 0, 0, 0]))).toBe("tiff"); // DNG raw files start like this
  });

  it("reads the EXIF orientation and the pixel size from the header of a JPEG without decoding it", async () => {
    for (const o of [1, 3, 6, 8]) {
      const info = jpegInfo(new Uint8Array(await quarter(o)));
      expect(info, `orientation ${o}`).toEqual({ orientation: o, width: 800, height: 400 });
    }
    expect(jpegInfo(new TextEncoder().encode("not a jpeg"))).toBeNull();
  });
});

describe.skipIf(!browserOk)("in a real Chromium, at 390 px", () => {
  const out: Record<string, Record<string, any>> = {};
  const MB = 1024 * 1024;

  beforeAll(async () => {
    // generated here: 8000x6000 camera JPEG, iPhone-size screenshot PNG, rotated-by-tag JPEGs, and files that are not photos
    writeFileSync(join(dir, "camera-8000x6000.jpg"), await noise(8000, 6000, 32).jpeg({ quality: 85 }).toBuffer());
    writeFileSync(join(dir, "screenshot-1290x2796.png"), await noise(1290, 2796, 40).png({ compressionLevel: 1 }).toBuffer());
    for (const o of [3, 6, 8]) writeFileSync(join(dir, `exif${o}.jpg`), await quarter(o));
    writeFileSync(join(dir, "notes.txt"), "this is not a picture");
    writeFileSync(join(dir, "broken.jpg"), Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(3000, 7)]));
    writeFileSync(join(dir, "raw.dng"), Buffer.concat([Buffer.from([0x49, 0x49, 0x2a, 0x00, 8, 0, 0, 0]), Buffer.alloc(4000, 3)]));
    const fd = openSync(join(dir, "huge.jpg"), "w");
    ftruncateSync(fd, 61 * MB);
    closeSync(fd);
    copyFileSync(resolve(__dirname, "fixtures/phone-sample.heic"), join(dir, "phone-sample.heic"));

    const built = await build({ entryPoints: [resolve(__dirname, "../apps/web/src/lib/photo-prep.ts")], bundle: true, format: "iife", globalName: "PhotoPrep", platform: "browser", target: "es2020", write: false, define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent" });
    writeFileSync(join(dir, "bundle.js"), built.outputFiles[0]!.text);
    const f = (path: string, extra: Record<string, unknown> = {}) => ({ path: join(dir, path), ...extra });
    writeFileSync(join(dir, "spec.json"), JSON.stringify({ width: 390, orient: [2, 3, 4, 5, 6, 7, 8], files: [
      f("camera-8000x6000.jpg", { shrinkTo: 200_000 }), f("screenshot-1290x2796.png"),
      f("exif6.jpg"), f("exif8.jpg"), f("exif3.jpg"),
      f("notes.txt"), f("broken.jpg"), f("raw.dng"), f("huge.jpg"), f("phone-sample.heic"),
    ] }));
    const r = run([resolve(__dirname, "helpers/photo-prep-browser.py"), join(dir, "bundle.js"), join(dir, "spec.json")]);
    expect(r.status, r.stderr).toBe(0);
    const list = JSON.parse(r.stdout) as Array<Record<string, any>>;
    for (const item of list) out[item.file] = item;
  }, 300_000);
  afterAll(() => undefined);

  const small = (r: Record<string, any>) => {
    expect(r.ok, JSON.stringify(r)).toBe(true);
    expect(r.type).toBe("image/jpeg");
    expect(r.size).toBeLessThanOrEqual(640_000);
    expect(r.size).toBeLessThanOrEqual(COLOREAR.maxPhotoBytes);
    expect(Math.max(r.width, r.height)).toBeLessThanOrEqual(1280);
  };

  it("generated the originals big enough to matter (they would all have been refused at 10 MB)", () => {
    expect(statSync(join(dir, "camera-8000x6000.jpg")).size).toBeGreaterThan(20 * MB);
    expect(statSync(join(dir, "screenshot-1290x2796.png")).size).toBeGreaterThan(10 * MB);
  });

  it("a 8000x6000 camera JPEG of about 25 MB becomes a small JPEG in a few seconds", () => {
    const r = out["camera-8000x6000.jpg"]!;
    small(r);
    expect(r.width).toBeGreaterThan(r.height); // landscape stays landscape
    expect(r.ms).toBeLessThan(60_000);
    console.log(`camera 8000x6000: ${(statSync(join(dir, "camera-8000x6000.jpg")).size / MB).toFixed(1)} MB -> ${Math.round(r.size / 1000)} KB, ${r.width}x${r.height}, ${r.ms} ms`);
  });

  it("an iPhone screenshot PNG of 1290x2796 (over 10 MB) becomes a small portrait JPEG", () => {
    const r = out["screenshot-1290x2796.png"]!;
    small(r);
    expect(r.height).toBeGreaterThan(r.width);
    console.log(`screenshot 1290x2796: ${(statSync(join(dir, "screenshot-1290x2796.png")).size / MB).toFixed(1)} MB -> ${Math.round(r.size / 1000)} KB, ${r.width}x${r.height}, ${r.ms} ms`);
  });

  it("a prepared photo can be shrunk again so that a whole order fits one request", () => {
    const r = out["camera-8000x6000.jpg"]!;
    expect(r.shrunk.size).toBeLessThanOrEqual(200_000);
    expect(r.shrunk.type).toBe("image/jpeg");
  });

  // red = the top-left quarter of the stored picture. Turned 90 degrees clockwise (EXIF 6) it ends top-right, 90 counter-clockwise (8) bottom-left, 180 (3) bottom-right.
  const where = (r: Record<string, any>) => Object.entries(r.corners as Record<string, number[]>).filter(([, [red, g]]) => red! > 180 && g! < 90).map(([k]) => k);

  it("EXIF orientation 6, 8 and 3 come out upright (the browser applies it while decoding)", () => {
    const six = out["exif6.jpg"]!;
    expect(six.ok, JSON.stringify(six)).toBe(true);
    expect([six.width, six.height]).toEqual([400, 800]);
    expect(where(six)).toEqual(["tr"]);
    expect([out["exif8.jpg"]!.width, out["exif8.jpg"]!.height]).toEqual([400, 800]);
    expect(where(out["exif8.jpg"]!)).toEqual(["bl"]);
    expect([out["exif3.jpg"]!.width, out["exif3.jpg"]!.height]).toEqual([800, 400]);
    expect(where(out["exif3.jpg"]!)).toEqual(["br"]);
  });

  it("the rotation done by hand (for a browser that does not apply EXIF) is right for all 7 cases", () => {
    // [width, height, where the red quarter lands] for orientations 2 to 8 of an 800x400 picture with red at its top-left
    const expected: Record<number, [number, number, string[]]> = {
      2: [800, 400, ["tr"]], 3: [800, 400, ["br"]], 4: [800, 400, ["bl"]], 5: [400, 800, ["tl"]], 6: [400, 800, ["tr"]], 7: [400, 800, ["br"]], 8: [400, 800, ["bl"]],
    };
    for (const [o, [w, h, red]] of Object.entries(expected)) {
      const r = out[`orient${o}`]!;
      expect([r.width, r.height], `orientation ${o}`).toEqual([w, h]);
      expect(where(r), `orientation ${o}`).toEqual(red);
    }
  });

  it("answers a friendly, size-free error for what cannot be a photo or cannot be read", () => {
    expect(out["notes.txt"]).toMatchObject({ ok: false, code: "not_image" });
    expect(out["broken.jpg"]).toMatchObject({ ok: false, code: "unreadable" });
    expect(out["raw.dng"]).toMatchObject({ ok: false, code: "unreadable" });
    expect(out["huge.jpg"]).toMatchObject({ ok: false, code: "too_big" }); // over the 60 MB sanity limit, and only then
  });

  it("opens a HEIC in a browser that cannot (Chromium) by loading a decoder on demand", () => {
    const r = out["phone-sample.heic"]!;
    small(r);
    expect([r.width, r.height]).toEqual([320, 240]);
    expect(r.corners.tl[0]).toBeGreaterThan(180); // the red quarter is where it was
    expect(r.corners.br[2]).toBeGreaterThan(180); // and the blue one
  });
});
