import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // The web app is TSX compiled by Next; tests that render its pages need the automatic JSX runtime and the "@" alias.
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": resolve(__dirname, "apps/web/src") } },
  test: {
    include: ["engines/**/*.test.ts", "packages/**/*.test.ts", "tests/**/*.test.ts", "scripts/**/*.test.ts"],
    environment: "node",
    testTimeout: 20000,
  },
});
