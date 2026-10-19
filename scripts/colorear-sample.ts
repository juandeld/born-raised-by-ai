/**
 * npm run colorear:sample -- --photos <dir> --persons "Manuela:niña, 6 años;Toby:perro" --out <dir> [--lang es] [--theme "el espacio"] [--story story.json] [--max-cost 2]
 * Runs the whole generate pipeline in memory (mock payment, no emails sent) with the image provider chosen by IMAGE_PROVIDER, and writes
 * book.pdf and report.json to --out. Photos are read from --photos in alphabetical order, one per person. IMPORTANT: --out and --photos must
 * be OUTSIDE the repository (real photos of minors never go into git).
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { MemorySink, MultiSink, Tracker } from "@lumen/analytics";
import { brandConfig } from "@lumen/config";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import { ColorearEngine, MockImageProvider, TemplateStoryProvider, createImageProvider, validateStory, type StoryProvider } from "@lumen/generate";

const arg = (name: string, d = "") => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] ?? d : d;
};

async function main() {
  const out = resolve(arg("out", "/tmp/colorear-sample"));
  if (resolve(out).startsWith(resolve(__dirname, ".."))) throw new Error("--out must be outside the repository");
  const photosDir = arg("photos");
  const persons = arg("persons").split(";").map((s) => s.trim()).filter(Boolean).map((s) => ({ name: s.split(":")[0]!.trim(), role: (s.split(":")[1] ?? "").trim() }));
  if (!persons.length) throw new Error('--persons "Name:role;Name:role" is required');
  const files = readdirSync(photosDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (files.length < persons.length) throw new Error(`need ${persons.length} photos in ${photosDir}, found ${files.length}`);
  // same as the browser does before uploading: max 1280 px, JPEG
  const photos = await Promise.all(persons.map(async (_, i) => new Uint8Array(await sharp(readFileSync(resolve(photosDir, files[i]!))).rotate().resize(1280, 1280, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer())));
  const lang = arg("lang", "es") === "en" ? "en" : "es";
  mkdirSync(out, { recursive: true });

  const env = { ...process.env, COLOREAR_COUNTRIES: "MX,ES,GB,US", COLOREAR_MAX_COST_USD: arg("max-cost", "2"), COLOREAR_MOCK_REAL_DAILY_CAP: "99" } as Record<string, string | undefined>;
  const sink = new MemorySink();
  const delivery = new MockDeliveryProvider();
  const storage = new MemoryStorage();
  let story: StoryProvider = new TemplateStoryProvider();
  const storyFile = arg("story");
  if (storyFile) {
    const raw = JSON.parse(readFileSync(resolve(storyFile), "utf8"));
    story = { name: "manual", write: async () => ({ ...validateStory(raw, persons.length), writer: "manual" }) };
  }
  const engine = new ColorearEngine({
    db: createMemoryDb(), storage, uploads: new MemoryStorage(), delivery, tracker: new Tracker(new MultiSink([sink])),
    payments: new MockPaymentProvider("http://localhost:3000"), image: createImageProvider(env), mockImage: new MockImageProvider(), story,
    env, now: () => new Date(), brand: { ...brandConfig(env), brand: "Colorfam" },
  });
  const { order } = await engine.createCheckout(
    { lang, country: "MX", email: "muestra@example.com", persons, photos, theme: arg("theme"), age: Number(arg("age", "6")), checkboxIds: ["K1", "K2", "K3", "K4"], ip: null },
    { successUrl: () => "http://localhost/x", cancelUrl: "http://localhost/x" },
  );
  await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "sample" });
  const t0 = Date.now();
  let res = await engine.runGeneration(order.id, { budgetMs: 600_000, concurrency: 4 });
  for (let i = 0; i < 3 && res.status === "partial"; i++) res = await engine.runGeneration(order.id, { budgetMs: 600_000, concurrency: 4 });
  const pdf = await engine.readPdf(order.access_token);
  const done = sink.events.find((e) => e.name === "generation_completed");
  console.log(JSON.stringify({ result: res, seconds: Math.round((Date.now() - t0) / 1000), completed: done?.props }, null, 2));
  if (pdf) writeFileSync(resolve(out, "book.pdf"), pdf.bytes);
  writeFileSync(resolve(out, "report.json"), JSON.stringify({ result: res, completed: done?.props, events: sink.events.map((e) => e.name) }, null, 2));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
