/**
 * Fails if the Vercel build output holds more than 12 serverless functions (Hobby limit).
 * Run after `vercel build` (needs `.vercel/output`): `npm run check:functions`.
 * Symlinked `*.func` dirs point at an existing function and do not count.
 */
import { existsSync, lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 12;
const root = join(process.cwd(), ".vercel/output/functions");
if (!existsSync(root)) {
  console.error("No .vercel/output/functions: run `npx vercel build` first.");
  process.exit(2);
}
const found: string[] = [];
const walk = (dir: string): void => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = lstatSync(p);
    if (st.isSymbolicLink() || !st.isDirectory()) continue;
    if (name.endsWith(".func")) found.push(p.slice(root.length + 1));
    else walk(p);
  }
};
walk(root);
console.log(`Serverless functions: ${found.length}/${LIMIT}\n${found.map((f) => `  ${f}`).join("\n")}`);
if (found.length > LIMIT) {
  console.error(`Exceeds Hobby limit of ${LIMIT}. See docs/arquitectura/limite-funciones-vercel.md`);
  process.exit(1);
}
