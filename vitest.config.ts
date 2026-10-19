import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["engines/**/*.test.ts", "packages/**/*.test.ts", "tests/**/*.test.ts", "scripts/**/*.test.ts"],
    environment: "node",
    testTimeout: 20000,
  },
});
