import { MemorySink, MultiSink, PostHogSink, TableSink, Tracker, type EventSink } from "@lumen/analytics";
import { SANTA, brandConfig, maxConcurrency } from "@lumen/config";
import { getDb, type Db } from "@lumen/db";
import { createPaymentProvider } from "@lumen/payments";
import { InlineDispatcher } from "./dispatcher";
import type { Dispatcher, EngineDeps } from "./deps";
import { CallsEngine } from "./engine";
import { MockDeliveryProvider, ResendDeliveryProvider, WhatsAppStubDeliveryProvider, type DeliveryProvider } from "./providers/delivery";
import { BuiltinPdfRenderer, RemotePdfRenderer, type PdfRenderer } from "./providers/pdf";
import { FsStorage, MemoryStorage, SupabaseStorage, type Storage } from "./providers/storage";
import type { TelephonyProvider } from "./providers/telephony";
import { MockTelephonyProvider } from "./providers/telephony-mock";
import { TwilioTelephonyProvider } from "./providers/telephony-twilio";
import { WebTelephonyProvider } from "./providers/telephony-web";
import type { VoiceProvider } from "./providers/voice";
import { ElevenLabsVoiceProvider } from "./providers/voice-elevenlabs";
import { MockVoiceProvider } from "./providers/voice-mock";

type Env = Record<string, string | undefined>;

/**
 * Provider selection by environment variable. Default is always the mock: nothing real is touched unless asked.
 * Fallback providers are switched the same way (e.g. TELEPHONY_PROVIDER, VOICE_PROVIDER, EMAIL_PROVIDER, PAYMENT_PROVIDER).
 */
export function createVoice(env: Env): VoiceProvider {
  return (env.VOICE_PROVIDER ?? "mock") === "elevenlabs" ? ElevenLabsVoiceProvider.fromEnv(env) : new MockVoiceProvider();
}
export function createTelephony(env: Env): TelephonyProvider {
  switch (env.TELEPHONY_PROVIDER ?? "mock") {
    case "twilio":
      return TwilioTelephonyProvider.fromEnv(env);
    case "web":
      return new WebTelephonyProvider(env.PUBLIC_BASE_URL ?? "http://localhost:3000");
    default:
      return new MockTelephonyProvider();
  }
}
export function createDelivery(env: Env): DeliveryProvider {
  return (env.EMAIL_PROVIDER ?? "mock") === "resend" ? ResendDeliveryProvider.fromEnv(env) : new MockDeliveryProvider();
}
export function createStorage(env: Env, db: Db): Storage {
  const kind = env.STORAGE_PROVIDER ?? (db.kind === "supabase" ? "supabase" : "fs");
  if (kind === "supabase") {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for STORAGE_PROVIDER=supabase");
    return new SupabaseStorage(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, env.SUPABASE_BUCKET ?? "deliveries");
  }
  return kind === "memory" ? new MemoryStorage() : new FsStorage(env.MOCK_STORAGE_DIR ?? ".data/storage");
}
export function createPdf(env: Env): PdfRenderer {
  return env.PDF_RENDER_URL ? new RemotePdfRenderer(env.PDF_RENDER_URL, env.PDF_RENDER_TOKEN) : new BuiltinPdfRenderer();
}
export function createTracker(env: Env, db: Db, extra?: EventSink): Tracker {
  const sinks: EventSink[] = [new TableSink(db.events as never)];
  if (env.POSTHOG_KEY) sinks.push(new PostHogSink(env.POSTHOG_KEY, env.POSTHOG_HOST));
  if (extra) sinks.push(extra);
  return new Tracker(new MultiSink(sinks));
}

export interface CreateEngineOptions {
  env?: Env;
  overrides?: Partial<EngineDeps>;
  /** Use the in-process dispatcher (mock mode). Default: Inngest when INNGEST_EVENT_KEY or INNGEST_DEV is set. */
  dispatcher?: Dispatcher;
  /** Auto-run afterCall when a call ends (inline mode). Default true. */
  inlineAfterCall?: boolean;
}

/**
 * Agent ids already created in ElevenLabs, read from the environment (no network, no PATCH). Both spellings of the
 * es-419 variable are accepted (ELEVENLABS_AGENT_ID_ES_419, fallback ELEVENLABS_AGENT_ID_ES419).
 */
export function agentIdsFromEnv(env: Env): Record<string, string> {
  const ids: Record<string, string> = {};
  const es419 = env.ELEVENLABS_AGENT_ID_ES_419 || env.ELEVENLABS_AGENT_ID_ES419;
  if (es419) ids["es-419"] = es419;
  const esEs = env.ELEVENLABS_AGENT_ID_ES_ES || env.ELEVENLABS_AGENT_ID_ESES;
  if (esEs) ids["es-ES"] = esEs;
  if (env.ELEVENLABS_AGENT_ID_EN) ids.en = env.ELEVENLABS_AGENT_ID_EN;
  if (env.ELEVENLABS_AGENT_ID_EN_US) ids["en-US"] = env.ELEVENLABS_AGENT_ID_EN_US;
  if (env.ELEVENLABS_AGENT_ID_EN_GB) ids["en-GB"] = env.ELEVENLABS_AGENT_ID_EN_GB;
  return ids;
}

export function createEngine(opts: CreateEngineOptions = {}): CallsEngine {
  const env = opts.env ?? process.env;
  const db = opts.overrides?.db ?? getDb(env);
  const deps: EngineDeps = {
    db,
    tracker: opts.overrides?.tracker ?? createTracker(env, db),
    voice: opts.overrides?.voice ?? createVoice(env),
    telephony: opts.overrides?.telephony ?? createTelephony(env),
    delivery: opts.overrides?.delivery ?? createDelivery(env),
    whatsapp: opts.overrides?.whatsapp ?? new WhatsAppStubDeliveryProvider(),
    payments: opts.overrides?.payments ?? createPaymentProvider(env),
    storage: opts.overrides?.storage ?? createStorage(env, db),
    pdf: opts.overrides?.pdf ?? createPdf(env),
    env,
    now: opts.overrides?.now ?? (() => new Date()),
    product: opts.overrides?.product ?? SANTA,
    maxConcurrency: opts.overrides?.maxConcurrency ?? maxConcurrency(env),
    brand: opts.overrides?.brand ?? brandConfig(env),
    agentIds: opts.overrides?.agentIds ?? agentIdsFromEnv(env),
    dispatcher: opts.dispatcher ?? opts.overrides?.dispatcher ?? new InlineDispatcher(),
  };
  const engine = new CallsEngine(deps);
  if (deps.dispatcher instanceof InlineDispatcher && opts.inlineAfterCall !== false) {
    deps.dispatcher.handlers["call/ended"] = async (data) => {
      // A post-call failure must never reach the Twilio webhook as a 500: log it and let the minute tick retry it
      // (the call keeps recording_id until delivery succeeds, which is what the tick's "recover" pass looks for).
      try {
        let out = await engine.afterCall(data.callId as string);
        // No Inngest: Twilio finishes the recording a few seconds after hangup, so poll here (webhook has maxDuration 60 s).
        for (let i = 0; i < 8 && out.kind === "recording_pending" && deps.telephony.name !== "mock"; i++) {
          await new Promise((r) => setTimeout(r, 5000));
          out = await engine.afterCall(data.callId as string);
        }
      } catch (err) {
        await engine.recordPostCallFailure(data.callId as string, err);
      }
    };
  }
  return engine;
}

export { MemorySink };
