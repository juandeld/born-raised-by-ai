import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OUT, render } from "./legal-docs";

describe("generated legal pages", () => {
  it("apps/web/src/lib/legal-docs.generated.ts is in sync with docs/legal/textos (run `npm run legal:docs`)", () => {
    expect(readFileSync(OUT, "utf8")).toBe(render());
  });
});
