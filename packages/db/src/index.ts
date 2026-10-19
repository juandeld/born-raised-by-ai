import { createMemoryDb } from "./memory";
import { createSupabaseDb } from "./postgrest";
import type { Db } from "./db";

export * from "./types";
export * from "./db";
export { createMemoryDb } from "./memory";
export { createSupabaseDb, encodeFilter } from "./postgrest";

const GLOBAL_KEY = Symbol.for("lumen.db");

/**
 * Picks the database from the environment:
 *  - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (and DB_PROVIDER != mock): real Supabase.
 *  - otherwise: in-memory mock persisted to MOCK_DB_FILE (default .data/mock-db.json) so the web
 *    server and CLI scripts share state in development.
 * Cached on globalThis because Next.js may load a module several times in dev.
 */
export function getDb(env: Record<string, string | undefined> = process.env): Db {
  const g = globalThis as unknown as Record<symbol, Db | undefined>;
  const cached = g[GLOBAL_KEY];
  if (cached) return cached;
  const useReal = env.DB_PROVIDER !== "mock" && !!env.SUPABASE_URL && !!env.SUPABASE_SERVICE_ROLE_KEY;
  const db = useReal ? createSupabaseDb(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!) : createMemoryDb({ file: env.MOCK_DB_FILE ?? ".data/mock-db.json" });
  g[GLOBAL_KEY] = db;
  return db;
}

export function resetDbCache(): void {
  (globalThis as unknown as Record<symbol, Db | undefined>)[GLOBAL_KEY] = undefined;
}
