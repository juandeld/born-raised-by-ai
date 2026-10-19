import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Vercel Hobby: max 12 serverless functions per deployment (docs/arquitectura/limite-funciones-vercel.md).
// Static guards so the limit cannot be broken silently; `npm run check:functions` verifies the real build output.
const WEB = join(__dirname, "../apps/web/src");
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(join(WEB, "app"));

describe("vercel function budget", () => {
  it("app/api has exactly one route handler: the catch-all dispatcher", () => {
    const routes = files.filter((f) => /\/api\/.*route\.tsx?$/.test(f)).map((f) => relative(WEB, f));
    expect(routes).toEqual(["app/api/[...path]/route.ts"]);
  });

  it("every server/api module is registered in the dispatcher (and vice versa)", () => {
    const table = readFileSync(join(WEB, "server/dispatch.ts"), "utf8");
    const registered = [...table.matchAll(/import\("\.\/api\/([\w-]+)"\)/g)].map((m) => m[1]).sort();
    const onDisk = readdirSync(join(WEB, "server/api")).map((f) => f.replace(/\.ts$/, "")).sort();
    expect(registered).toEqual(onDisk);
  });

  it("no route-segment function config outside the catch-all (it would split functions)", () => {
    const offenders = files
      .filter((f) => /\.(tsx?|jsx?)$/.test(f) && !f.endsWith("app/api/[...path]/route.ts"))
      .filter((f) => /export const (maxDuration|preferredRegion|regions|runtime)\b/.test(readFileSync(f, "utf8")))
      .map((f) => relative(WEB, f));
    expect(offenders).toEqual([]);
    const handlers = readdirSync(join(WEB, "server/api")).filter((f) =>
      /export const (maxDuration|runtime|dynamic)\b/.test(readFileSync(join(WEB, "server/api", f), "utf8")),
    );
    expect(handlers).toEqual([]);
  });
});
