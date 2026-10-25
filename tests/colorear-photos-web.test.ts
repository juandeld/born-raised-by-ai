import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { MemoryStorage } from "@lumen/calls";

/**
 * The form and the route handler with several photos per person: `photo<i>` is the required photo of person i and `photo<i>_2`,
 * `photo<i>_3` are optional extras of the same person. The form shows the limit it is given.
 */
const env = process.env as Record<string, string | undefined>;
let checkout: typeof import("../apps/web/src/server/api/colorear-checkout");
let lib: typeof import("../apps/web/src/lib/colorear");

const jpeg = (n: number) => sharp({ create: { width: 200, height: 300, channels: 3, background: { r: 120 + n, g: 160, b: 200 } } }).jpeg().toBuffer();
const file = async (n: number, name: string) => new File([new Uint8Array(await jpeg(n))], name, { type: "image/jpeg" });

async function form(photos: Record<string, number>, over: Record<string, string> = {}) {
  const fd = new FormData();
  const base: Record<string, string> = { lang: "es", country: "MX", variant: "single", email: "mama@example.com", age: "5", theme: "el espacio", themeId: "space", creative: "wa", checkboxIds: JSON.stringify(["K1", "K2"]), name1: "Manuela", roleId1: "protagonist_girl", name2: "Toby", roleId2: "dog", ...over };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  for (const [field, n] of Object.entries(photos)) fd.set(field, await file(n, `${field}.jpg`));
  return fd;
}
let n = 0;
const send = (fd: FormData) => checkout.POST(new Request("http://localhost:3000/api/colorear/checkout", { method: "POST", body: fd, headers: { "x-forwarded-for": `198.51.100.${++n}` } }));
const stored = () => [...(lib.getColorear().d.uploads as unknown as MemoryStorage).files.keys()];

beforeAll(async () => {
  Object.assign(env, {
    DB_PROVIDER: "mock", MOCK_DB_FILE: join(mkdtempSync(join(tmpdir(), "lumen-photos-")), "db.json"), STORAGE_PROVIDER: "memory",
    PAYMENT_PROVIDER: "mock", EMAIL_PROVIDER: "mock", IMAGE_PROVIDER: "mock", COLOREAR_COUNTRIES: "MX,ES,GB,US", PHONE_HASH_SALT: "test-salt",
    PUBLIC_BASE_URL: "http://localhost:3000", COLOREAR_PUBLIC_URL: "https://www.pintoria.app",
  });
  delete env.VERCEL_ENV;
  delete env.COLOREAR_MAX_PHOTOS_MAIN;
  delete env.COLOREAR_MAX_PHOTOS_OTHER;
  vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 202 })));
  checkout = await import("../apps/web/src/server/api/colorear-checkout");
  lib = await import("../apps/web/src/lib/colorear");
});
afterAll(() => vi.unstubAllGlobals());

describe("the form", () => {
  const legal = { country: "MX", label: "México", prices: { single: "MX$229", bundle3: "MX$429", threeSingles: "MX$687" }, trioLine: "t", trioRefundLine: "r", emailLine: "e", checkboxes: [{ id: "K1", text: "k1" }, { id: "K2", text: "k2" }], aviso: { title: "a", intro: "i", sections: [], privacyLink: "p: x" }, refundLine: "rf" };
  const render = async (lang: "es" | "en", photoLimits?: { main: number; other: number }) => {
    const { ColorearForm } = await import("../apps/web/src/components/colorear/ColorearForm");
    return renderToStaticMarkup(createElement(ColorearForm, { lang, countries: { MX: legal }, defaultCountry: "MX", themes: [], creative: "x", ...(photoLimits ? { photoLimits } : {}) }));
  };

  it("offers 3 photo slots by default, the first one required and the others optional, with the hint in both languages", async () => {
    const es = await render("es");
    expect(es).toContain("Añade hasta 3 fotos: más ángulos = más parecido.");
    expect(es.match(/Obligatoria/g)).toHaveLength(2); // the visible caption and the label of the file input
    expect(es.match(/Opcional/g)!.length).toBeGreaterThanOrEqual(2);
    expect(es).toContain('role="group" aria-label="Fotos de Protagonista"');
    expect(es).toContain("multiple");
    const en = await render("en");
    expect(en).toContain("Add up to 3 photos: more angles = a closer likeness.");
    expect(en).toContain("Required");
    expect(en).toContain("Optional");
  });

  it("shows the limit it receives (the owner can lower it) and no hint when only one photo is allowed", async () => {
    expect(await render("es", { main: 2, other: 1 })).toContain("Añade hasta 2 fotos");
    const one = await render("es", { main: 1, other: 1 });
    expect(one).not.toContain("Añade hasta");
    expect(one).not.toContain("Opcional");
    expect(one).not.toContain("multiple");
  });

  it("no longer promises one photo per person", async () => {
    const es = await render("es");
    expect(es).not.toContain("Una por foto");
    expect(es).toContain("de 1 a 5 personas");
  });
});

describe("POST /api/colorear/checkout with several photos", () => {
  it("stores photo<i> and photo<i>_<j> under the right person and records the counts", async () => {
    const res = await send(await form({ photo1: 1, photo1_2: 2, photo1_3: 3, photo2: 4, photo2_2: 5 }));
    expect(res.status).toBe(200);
    const [order] = await lib.getColorear().d.db.orders.find();
    expect(JSON.parse(order!.details!).photoCounts).toEqual([3, 2]);
    expect(stored()).toHaveLength(5);
    const events = await lib.getColorear().d.db.events.find({ name: "checkout_started" });
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events[0])).toContain('"photos_per_person":[3,2]');
  });

  it("answers a photo error for a 4th photo, and keeps the old one-photo-per-person form working", async () => {
    const before = stored().length;
    const bad = await send(await form({ photo1: 1, photo1_2: 2, photo1_3: 3, photo1_4: 4, photo2: 5 }));
    expect(bad.status).toBe(422);
    expect(((await bad.json()) as { errors: Record<string, string> }).errors.photos).toBeTruthy();
    expect(stored()).toHaveLength(before);
    const old = await send(await form({ photo1: 1, photo2: 2 }));
    expect(old.status).toBe(200);
    expect(stored()).toHaveLength(before + 2);
  });

  it("an extra photo without its required first photo is ignored", async () => {
    const before = stored().length;
    const res = await send(await form({ photo1: 1, photo2_2: 2, photo2_3: 3 }, { name2: "", roleId2: "" }));
    expect(res.status).toBe(200);
    expect(stored()).toHaveLength(before + 1);
  });
});
