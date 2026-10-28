import { colorearBrandConfig, colorearResendFrom } from "@lumen/config";
import { FsStorage, MemoryStorage, SupabaseStorage, createDelivery, createStorage, createTracker, type Storage } from "@lumen/calls";
import { getDb } from "@lumen/db";
import { createPaymentProvider } from "@lumen/payments";
import { ColorearEngine, type ColorearDeps } from "./engine";
import { MockImageProvider, createImageProvider } from "./providers";
import { AnthropicStoryProvider, FallbackStoryProvider } from "./story";
import { UploadsStorage } from "./uploads";

type Env = Record<string, string | undefined>;

export function createUploads(env: Env, main: Storage, dbKind: string): Storage {
  const kind = env.STORAGE_PROVIDER ?? (dbKind === "supabase" ? "supabase" : "fs");
  if (kind === "supabase" && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    return new UploadsStorage(new SupabaseStorage(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, env.UPLOADS_BUCKET ?? "uploads"), main);
  }
  return kind === "memory" ? new MemoryStorage() : new FsStorage(env.MOCK_UPLOADS_DIR ?? ".data/uploads");
}

export interface CreateColorearOptions {
  env?: Env;
  overrides?: Partial<ColorearDeps>;
}

/**
 * All providers come from environment variables and default to the mock: IMAGE_PROVIDER (openai | nanobanana | mock),
 * EMAIL_PROVIDER, PAYMENT_PROVIDER, STORAGE_PROVIDER. The story uses Claude when ANTHROPIC_API_KEY exists, else a built-in template.
 */
export function createColorearEngine(opts: CreateColorearOptions = {}): ColorearEngine {
  const env = opts.env ?? process.env;
  const o = opts.overrides ?? {};
  const db = o.db ?? getDb(env);
  const storage = o.storage ?? createStorage(env, db);
  // Colorear is sold as Pintoria: its emails come from "Pintoria <...>" and replies go to Pintoria's support address (COLOREAR_SUPPORT_EMAIL),
  // the same one the legal texts and the emails print.
  const brand = o.brand ?? colorearBrandConfig(env);
  const deps: ColorearDeps = {
    db,
    storage,
    uploads: o.uploads ?? createUploads(env, storage, db.kind),
    delivery: o.delivery ?? createDelivery(env, { from: colorearResendFrom(env), replyTo: brand.supportEmail }),
    tracker: o.tracker ?? createTracker(env, db),
    payments: o.payments ?? createPaymentProvider(env, "generate"),
    image: o.image ?? createImageProvider(env),
    mockImage: o.mockImage ?? new MockImageProvider(),
    story: o.story ?? new FallbackStoryProvider(AnthropicStoryProvider.fromEnv(env)),
    env,
    now: o.now ?? (() => new Date()),
    brand,
    continueRun: o.continueRun,
  };
  return new ColorearEngine(deps);
}
