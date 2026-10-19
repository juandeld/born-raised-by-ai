export type OrderStatus = "created" | "paid" | "scheduled" | "calling" | "completed" | "delivered" | "refunded" | "cancelled" | "failed" | "purged";

export interface OrderRow {
  id: string;
  access_token: string;
  product: string;
  variant: "single" | "bundle";
  calls_included: number;
  country: "US" | "ES" | "GB" | "MX";
  locale: string;
  language: string;
  currency: string;
  amount_minor: number;
  amount_usd_cents: number;
  status: OrderStatus;
  email: string | null;
  phone_e164: string | null;
  phone_e164_hash: string | null;
  child_first_name: string | null;
  child_age: number | null;
  details: string | null;
  consent_draft: { checkbox_ids: string[]; accepted_at: string; ip: string | null } | null;
  timezone: string;
  window_start: string;
  window_end: string;
  payment_provider: string | null;
  checkout_id: string | null;
  payment_id: string | null;
  test_mode: boolean;
  creative: string;
  device: string;
  created_at: string;
  paid_at: string | null;
  delivered_at: string | null;
  refunded_at: string | null;
  refund_reason: string | null;
  refund_amount_minor: number | null;
  purge_at: string | null;
  pii_purged_at: string | null;
}

export interface ConsentRow {
  id: string;
  order_id: string;
  payment_id: string | null;
  checkbox_id: string;
  text_version_id: string;
  text_sha256: string;
  locale: string;
  accepted_at: string;
  ip: string | null;
  phone_e164_hash: string;
  window_start: string | null;
  window_end: string | null;
  product_slug: string;
  purge_at: string;
}

export interface SuppressionRow {
  phone_e164_hash: string;
  created_at: string;
  source: string;
}

export type CallResult = "completed" | "voicemail" | "no_key" | "opted_out" | "no_answer" | "busy" | "failed" | "technical" | "handoff_timeout" | "blocked";

export interface CallRow {
  id: string;
  order_id: string;
  attempt: number;
  status: "dialing" | "prelude" | "in_progress" | "ended";
  result: CallResult | null;
  telephony_provider: string;
  voice_provider: string;
  provider_call_id: string | null;
  conversation_id: string | null;
  recording_id: string | null;
  recording_path: string | null;
  prelude_version: string;
  state: Record<string, unknown>;
  key1_at: string | null;
  key2_at: string | null;
  incidents: Array<{ type: string; at: string }>;
  scheduled_for: string | null;
  started_at: string;
  ended_at: string | null;
  telephony_seconds: number;
  agent_seconds: number;
  recording_purge_at: string | null;
}

export interface DeliveryRow {
  id: string;
  order_id: string;
  kind: string;
  channel: "email" | "whatsapp" | "web";
  status: "sent" | "failed" | "stub";
  provider: string;
  provider_id: string | null;
  mp3_path: string | null;
  pdf_path: string | null;
  link_expires_at: string | null;
  survey_answer: "loved" | "ok" | "bad" | null;
  survey_at: string | null;
  sent_at: string;
  purge_at: string;
}

export interface EventRowDb {
  id: number;
  name: string;
  ts: string;
  order_id: string | null;
  product: string;
  country: string;
  language: string;
  creative: string;
  device: string;
  test_mode: boolean;
  properties: Record<string, unknown>;
}
