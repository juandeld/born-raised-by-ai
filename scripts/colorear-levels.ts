/**
 * npm run colorear:levels -- --out <dir> [--mock] [--quality low|medium|high]
 * Draws ONE page of each of the five detail levels (3-4, 5-6, 7-8, 9-12, adults) with the SAME test character and the SAME scene, so the
 * difference of detail between levels can be judged by eye. The character is an invented cartoon fox drawn from text: no photos and no real
 * people are involved. The image provider is the one chosen by IMAGE_PROVIDER (run it in production env for the real engine); --mock uses the
 * free local drawings, which only proves each level sends its own prompt. Writes level-<band>.png/svg, the prompts and report.json to --out
 * (outside the repository). Costs 6 images with a real provider (about USD 0.3 at medium quality).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { AGE_LEVELS } from "@lumen/config";
import { MockImageProvider, buildCharacterFromTextPrompt, buildScenePrompt, createImageProvider, type ImageQuality } from "@lumen/generate";

const arg = (name: string, d = "") => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] ?? d : d;
};

const ROLE = "a friendly cartoon fox with a long bushy tail, wearing a scarf and a small backpack";
const SCENE = "{1} walks along a garden path with flowers, a wooden fence, a tree and a small house in the background, under a sunny sky with clouds";

async function main() {
  const out = resolve(arg("out", "/tmp/colorear-levels"));
  if (out.startsWith(resolve(__dirname, ".."))) throw new Error("--out must be outside the repository");
  mkdirSync(out, { recursive: true });
  const quality = (arg("quality", "medium") as ImageQuality);
  const provider = process.argv.includes("--mock") ? new MockImageProvider() : createImageProvider(process.env);
  console.log(`provider: ${provider.name} (${provider.model}), quality ${quality}`);
  const hints = (seed: number) => ({ roles: ["fox"], setting: SCENE.replace("{1}", "the fox"), seed });

  // the shared character: drawn once at the 5-6 level, then used as the reference of every level
  const ch = await provider.render({ prompt: buildCharacterFromTextPrompt(ROLE, "5-6"), width: 1024, height: 1024, quality, refs: [], kind: "character", ageBand: "5-6", hints: hints(1) });
  const ext = (f: string) => (f === "svg" ? "svg" : "png");
  writeFileSync(resolve(out, `character.${ext(ch.format)}`), ch.bytes);
  const refs = ch.format === "png" ? [{ bytes: ch.bytes, mime: "image/png" as const }] : [];
  let cents = ch.costUsdCents;
  const report: Array<Record<string, unknown>> = [];
  for (const lv of AGE_LEVELS) {
    const prompt = buildScenePrompt(SCENE.replace("{1}", "character 1"), lv.band, refs.length);
    const img = await provider.render({ prompt, width: 1024, height: 1536, quality, refs, kind: "scene", ageBand: lv.band, hints: hints(7) });
    const file = `level-${lv.band}.${ext(img.format)}`;
    writeFileSync(resolve(out, file), img.bytes);
    writeFileSync(resolve(out, `level-${lv.band}.prompt.txt`), prompt);
    cents += img.costUsdCents;
    report.push({ band: lv.band, file, bytes: img.bytes.length, costCents: img.costUsdCents });
    console.log(`${lv.band}: ${file}`);
  }
  writeFileSync(resolve(out, "report.json"), JSON.stringify({ provider: provider.name, model: provider.model, quality, totalCostUsdCents: cents, levels: report }, null, 2));
  console.log(`done, ${out}, cost about USD ${(cents / 100).toFixed(2)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
