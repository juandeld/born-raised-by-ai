import type { Tracker } from "@lumen/analytics";
import type { BrandConfig, CallProductConfig } from "@lumen/config";
import type { Db } from "@lumen/db";
import type { PaymentProvider } from "@lumen/payments";
import type { DeliveryProvider } from "./providers/delivery";
import type { PdfRenderer } from "./providers/pdf";
import type { Storage } from "./providers/storage";
import type { TelephonyProvider } from "./providers/telephony";
import type { VoiceProvider } from "./providers/voice";

export interface Dispatcher {
  send(name: "order/scheduled" | "call/ended" | "call/retry", data: Record<string, unknown>): Promise<void>;
}

export interface EngineDeps {
  db: Db;
  tracker: Tracker;
  voice: VoiceProvider;
  telephony: TelephonyProvider;
  delivery: DeliveryProvider;
  whatsapp: DeliveryProvider;
  payments: PaymentProvider;
  storage: Storage;
  pdf: PdfRenderer;
  env: Record<string, string | undefined>;
  now: () => Date;
  product: CallProductConfig;
  maxConcurrency: number;
  brand: BrandConfig;
  /** ElevenLabs agent ids by language, filled by `syncAgents`. */
  agentIds: Record<string, string>;
  dispatcher: Dispatcher;
}
