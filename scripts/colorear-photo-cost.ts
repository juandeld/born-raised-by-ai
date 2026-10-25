/**
 * npm run colorear:photo-cost -- --photos <dir> --out <dir> [--models gpt-image-1-mini,gpt-image-2.5-flare] [--qualities low,medium]
 *   [--counts 1,3] [--persons "Manuela:niña, 6 años;Toby:perro"] [--max-total 10] [--dry-run]
 *
 * Measures what several photos per person cost and how they look. For every case (model x quality x photos per person) it runs the whole
 * real pipeline in memory (mock payment, no emails) and records: cost of the book as the API reported it (usage tokens), cost and time of
 * the character step alone (the only step that receives the photos), total time, and a visual sample (the characters and 2 pages).
 *
 * The photos: --photos is a folder with ONE SUBFOLDER PER PERSON (sorted by name, in the order of --persons), each with at least
 * max(--counts) pictures of THAT person or pet (JPG/PNG/WebP). Use licensed stock or photos of the team; NEVER photos of customers.
 * --out and --photos must be OUTSIDE the repository.
 *
 * Spending guard: --max-total (default 10 USD) is a hard cap. The plan and its worst-case estimate are printed first (--dry-run stops
 * there and needs no key); before each case the remaining budget is compared with the estimate of that case, and the engine itself
 * stops a book at the remaining budget (COLOREAR_MAX_COST_USD). Needs OPENAI_API_KEY; the model of each case is set through OPENAI_IMAGE_MODEL
 * for that case only: the production value is never touched.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { MemoryStorage, MockDeliveryProvider } from "@lumen/calls";
import { MemorySink, MultiSink, Tracker } from "@lumen/analytics";
import { COLOREAR, brandConfig, openaiImageFamily } from "@lumen/config";
import { createMemoryDb } from "@lumen/db";
import { MockPaymentProvider } from "@lumen/payments";
import { ColorearEngine, MockImageProvider, TemplateStoryProvider, createImageProvider, type GeneratedImage, type ImageProvider, type ImageQuality, type ImageRequest } from "@lumen/generate";

const arg = (name: string, d = "") => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] ?? d : d;
};
const flag = (name: string) => process.argv.includes(`--${name}`);
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

/** Wraps the real provider to time and cost every call, by kind (character calls are the ones that receive the photos). */
class Probe implements ImageProvider {
  readonly name: ImageProvider["name"];
  readonly model: string;
  calls: Array<{ kind: string; refs: number; ms: number; cents: number }> = [];
  constructor(private readonly inner: ImageProvider) {
    this.name = inner.name;
    this.model = inner.model;
  }
  async render(req: ImageRequest): Promise<GeneratedImage> {
    const t0 = Date.now();
    const out = await this.inner.render(req);
    this.calls.push({ kind: req.kind, refs: req.refs.length, ms: Date.now() - t0, cents: out.costUsdCents });
    return out;
  }
}

/** In-memory storage that also keeps a copy of the characters and two scene pages (the book deletes them when it is delivered). */
class TapStorage extends MemoryStorage {
  readonly kept = new Map<string, Uint8Array>();
  async put(path: string, bytes: Uint8Array, contentType: string) {
    if (/\/char-\d+\.(png|svg)$/.test(path) || /\/page-(01|12)\.(png|svg)$/.test(path)) this.kept.set(path.split("/").pop()!, bytes);
    await super.put(path, bytes, contentType);
  }
}

interface Row {
  model: string;
  quality: string;
  photosPerPerson: number;
  status: string;
  bookUsd?: number;
  characterStepUsd?: number;
  characterStepSeconds?: number;
  totalSeconds?: number;
  images?: number;
  retries?: number;
  estimateUsd: number;
}

/** Worst-case estimate of a case in USD: price table x images, plus the photo tokens (about 1,100 image tokens each) at the family's image-input rate, x2 margin. */
function estimate(model: string, quality: ImageQuality, persons: number, perPerson: number): number {
  const fam = openaiImageFamily(model);
  const rate = fam === "mini" ? 2.5 : fam === "v1" ? 10 : 8;
  const base = ColorearEngine.estimateCostCents(model, quality, persons) / 100;
  const photoTokens = persons * perPerson * 1100 * rate * 1e-6;
  const refTokensScenes = (COLOREAR.scenes + 1) * Math.min(persons, 2) * 1100 * rate * 1e-6;
  return Math.round((base + photoTokens + refTokensScenes) * 2 * 1000) / 1000;
}

async function main() {
  const out = resolve(arg("out", "/tmp/colorear-photo-cost"));
  const photosDir = resolve(arg("photos"));
  const repo = resolve(__dirname, "..");
  if (out.startsWith(repo) || photosDir.startsWith(repo)) throw new Error("--out and --photos must be outside the repository");
  const models = list(arg("models", "gpt-image-1-mini,gpt-image-2.5-flare"));
  const qualities = list(arg("qualities", "low,medium")) as ImageQuality[];
  const counts = list(arg("counts", "1,3")).map(Number);
  const persons = arg("persons", "Manuela:niña, 6 años;Toby:perro").split(";").map((s) => s.trim()).filter(Boolean).map((s) => ({ name: s.split(":")[0]!.trim(), role: (s.split(":")[1] ?? "").trim() }));
  const cap = Number(arg("max-total", "10"));
  if (!Number.isFinite(cap) || cap <= 0) throw new Error("--max-total must be a positive number of USD");
  if (models.some((m) => /^gpt-image-1$/i.test(m))) throw new Error("gpt-image-1 was shut down on 2026-10-23");
  if (counts.some((n) => !Number.isInteger(n) || n < 1 || n > COLOREAR.photosPerPersonCeiling)) throw new Error(`--counts must be integers from 1 to ${COLOREAR.photosPerPersonCeiling}`);

  const cases = models.flatMap((model) => qualities.flatMap((quality) => counts.map((n) => ({ model, quality, n, estimateUsd: estimate(model, quality, persons.length, n) }))));
  const planned = cases.reduce((s, c) => s + c.estimateUsd, 0);
  console.log(`Plan: ${cases.length} books, worst-case estimate ${planned.toFixed(2)} USD (cap ${cap} USD)`);
  for (const c of cases) console.log(`  ${c.model} ${c.quality} ${c.n} photo(s) per person: up to ${c.estimateUsd.toFixed(3)} USD`);
  if (flag("dry-run")) return;
  if (planned > cap) throw new Error(`The worst-case estimate (${planned.toFixed(2)} USD) is over the cap (${cap} USD): run fewer cases (--models, --qualities, --counts)`);
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required (use --dry-run to see the plan without it)");

  // photos: one subfolder per person
  const folders = readdirSync(photosDir).filter((f) => statSync(resolve(photosDir, f)).isDirectory()).sort();
  if (folders.length < persons.length) throw new Error(`need ${persons.length} subfolders (one per person) in ${photosDir}, found ${folders.length}`);
  const need = Math.max(...counts);
  const prepared = await Promise.all(persons.map(async (_, i) => {
    const files = readdirSync(resolve(photosDir, folders[i]!)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
    if (files.length < need) throw new Error(`${folders[i]} needs ${need} pictures, found ${files.length}`);
    // the same treatment as the browser: upright, at most 1280 px, JPEG
    return Promise.all(files.slice(0, need).map(async (f) => new Uint8Array(await sharp(readFileSync(resolve(photosDir, folders[i]!, f))).rotate().resize(1280, 1280, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer())));
  }));

  mkdirSync(out, { recursive: true });
  let spent = 0;
  const rows: Row[] = [];
  for (const c of cases) {
    const label = `${c.model}_${c.quality}_${c.n}ph`;
    const row: Row = { model: c.model, quality: c.quality, photosPerPerson: c.n, status: "skipped", estimateUsd: c.estimateUsd };
    rows.push(row);
    if (spent + c.estimateUsd > cap) {
      console.log(`${label}: skipped (spent ${spent.toFixed(2)} + estimate ${c.estimateUsd.toFixed(2)} would pass the ${cap} USD cap)`);
      continue;
    }
    const env = {
      ...process.env, IMAGE_PROVIDER: "openai", OPENAI_IMAGE_MODEL: c.model, IMAGE_QUALITY: c.quality, COLOREAR_COUNTRIES: "MX,ES,GB,US",
      COLOREAR_MAX_COST_USD: String(Math.max(0.01, cap - spent)), COLOREAR_MOCK_REAL_DAILY_CAP: "99",
    } as Record<string, string | undefined>;
    const probe = new Probe(createImageProvider(env));
    if (probe.name !== "openai") throw new Error("the real image provider is not active (check OPENAI_API_KEY and IMAGE_PROVIDER)");
    const storage = new TapStorage();
    const sink = new MemorySink();
    const engine = new ColorearEngine({
      db: createMemoryDb(), storage, uploads: new MemoryStorage(), delivery: new MockDeliveryProvider(), tracker: new Tracker(new MultiSink([sink])),
      payments: new MockPaymentProvider("http://localhost:3000"), image: probe, mockImage: new MockImageProvider(), story: new TemplateStoryProvider(),
      env, now: () => new Date(), brand: { ...brandConfig(env), brand: "Pintoria" },
    });
    const { order } = await engine.createCheckout(
      { lang: "es", country: "MX", email: "medicion@example.com", persons, photos: prepared.map((g) => g[0]!), extraPhotos: prepared.map((g) => g.slice(1, c.n)), theme: "el espacio", age: 6, checkboxIds: ["K1", "K2"], ip: null },
      { successUrl: () => "http://localhost/x", cancelUrl: "http://localhost/x" },
    );
    await engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: "measure" });
    const t0 = Date.now();
    let res = await engine.runGeneration(order.id, { budgetMs: 600_000, concurrency: 4 });
    for (let i = 0; i < 3 && res.status === "partial"; i++) res = await engine.runGeneration(order.id, { budgetMs: 600_000, concurrency: 4 });
    const done = sink.events.find((e) => e.name === "generation_completed")?.props as Record<string, number> | undefined;
    const chars = probe.calls.filter((x) => x.kind === "character");
    row.status = res.status;
    row.bookUsd = Math.round((probe.calls.reduce((s, x) => s + x.cents, 0) / 100) * 1000) / 1000;
    row.characterStepUsd = Math.round((chars.reduce((s, x) => s + x.cents, 0) / 100) * 1000) / 1000;
    row.characterStepSeconds = Math.round(Math.max(0, ...chars.map((x) => x.ms)) / 100) / 10;
    row.totalSeconds = Math.round((Date.now() - t0) / 1000);
    row.images = probe.calls.length;
    row.retries = done?.retries ?? 0;
    spent += row.bookUsd;
    const dir = resolve(out, label);
    mkdirSync(dir, { recursive: true });
    for (const [name, bytes] of storage.kept) writeFileSync(resolve(dir, name), bytes);
    const pdf = await engine.readPdf(order.access_token);
    if (pdf) writeFileSync(resolve(dir, "book.pdf"), pdf.bytes);
    console.log(`${label}: ${res.status}, book ${row.bookUsd} USD (characters ${row.characterStepUsd}), ${row.totalSeconds} s, ${row.images} images. Spent so far ${spent.toFixed(3)} USD`);
  }

  // Cost of one extra photo = (cost of the character step with n photos - with 1) / (extra photos sent)
  const extra: string[] = [];
  for (const m of models) for (const q of qualities) {
    const one = rows.find((r) => r.model === m && r.quality === q && r.photosPerPerson === 1);
    for (const r of rows.filter((x) => x.model === m && x.quality === q && x.photosPerPerson > 1)) {
      if (one?.characterStepUsd === undefined || r.characterStepUsd === undefined) continue;
      extra.push(`${m} ${q}: ${((r.characterStepUsd - one.characterStepUsd) / (persons.length * (r.photosPerPerson - 1))).toFixed(4)} USD per extra photo (character step, ${r.photosPerPerson} vs 1)`);
    }
  }
  const md = [
    `# Cost of photos per person (${new Date().toISOString().slice(0, 10)})`, "",
    "| Model | Quality | Photos per person | Status | Book (USD) | Character step (USD) | Slowest character (s) | Total (s) | Images | Retries |", "|---|---|---|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.model} | ${r.quality} | ${r.photosPerPerson} | ${r.status} | ${r.bookUsd ?? "-"} | ${r.characterStepUsd ?? "-"} | ${r.characterStepSeconds ?? "-"} | ${r.totalSeconds ?? "-"} | ${r.images ?? "-"} | ${r.retries ?? "-"} |`),
    "", `Spent: ${spent.toFixed(3)} USD of ${cap} USD.`, "", ...extra.map((e) => `- ${e}`),
  ].join("\n");
  writeFileSync(resolve(out, "results.md"), md);
  writeFileSync(resolve(out, "results.json"), JSON.stringify({ spentUsd: spent, capUsd: cap, rows, extraPhoto: extra }, null, 2));
  console.log(`\n${md}\n\nFiles in ${out}`);
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
