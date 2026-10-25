/**
 * Standard funnel events (docs/briefs/santa-H1-metricas.md). Every event carries
 * product, country, language, creative and device. No personal data: no email, phone,
 * child name, IP or free text. `order_id` is a random UUID and is the only identifier.
 * `creative` also carries the marketing experiment as `<exp>.<ad>` (e1, e2, e3, f0): see experiments.ts, D24.
 */
export const FUNNEL = [
  "ad_impression",
  "click",
  "landing_view",
  "form_started",
  "consent_given",
  "checkout_started",
  "paid",
  "call_scheduled",
  "call_started",
  "call_completed",
  "delivered",
  "survey_answered",
] as const;

/** Landing interactions sent from the browser (never with the child's name or any free text). */
export const LANDING_EVENTS = ["cta_click", "name_personalized", "audio_play"] as const;

/** Operational events (not funnel steps) needed for refunds, voicemail/failure and costs. */
export const OPS_EVENTS = [
  "call_attempt_ended",
  "refunded",
  "opted_out",
  "incident_flagged",
  "post_call_failed",
  // generate engine (colorear), docs/briefs/colorear-H1b-metricas.md
  "generation_started",
  "generation_page_retried",
  "generation_completed",
  "generation_failed",
  "content_blocked",
  "book_downloaded",
  "photos_deleted",
  // colorear ladder (19-oct): Trio, "otra aventura con las mismas fotos", character retention, day-25 reminder
  "bundle_selected",
  "credit_used",
  "upsell_viewed",
  "upsell_purchased",
  "characters_deleted",
  "expiry_reminder_sent",
  // colorear test codes (team tests without payment)
  "test_code_redeemed",
] as const;

export type FunnelEventName = (typeof FUNNEL)[number];
export type OpsEventName = (typeof OPS_EVENTS)[number];
export type LandingEventName = (typeof LANDING_EVENTS)[number];
export type EventName = FunnelEventName | OpsEventName | LandingEventName;

export type Device = "mobile" | "desktop" | "tablet" | "unknown";

export interface BaseProps {
  product: string;
  country: string;
  language: string;
  creative: string;
  device: Device;
  /** Random order UUID, when the event belongs to an order. */
  order_id?: string;
  /** Colorear: variant of the order (single | bundle3 | add1 | credit), to cut costs and deliveries by offer. */
  variant?: string;
  /** True for test-mode payments and team purchases: excluded from "venta real entregada". */
  test_mode?: boolean;
}

export interface EventPropsMap {
  ad_impression: BaseProps;
  click: BaseProps & { utm_source?: string; utm_campaign?: string };
  landing_view: BaseProps;
  form_started: BaseProps;
  /** Landing: a purchase button was pressed. placement = hero | price | sticky. */
  cta_click: BaseProps & { placement: string; personalized: boolean };
  /** Landing: the visitor typed a name in the hero field (the name itself is never sent). */
  name_personalized: BaseProps;
  /** Landing: the sample call was played for the first time in this visit. */
  audio_play: BaseProps;
  consent_given: BaseProps & { checkbox_ids: string[]; text_version_ids: string[] };
  checkout_started: BaseProps & { variant: "single" | "bundle" | "bundle3" | "add1" | "credit"; amount_usd_cents: number; currency: string; payment_provider: string; /** colorear: photos uploaded for each person, in order (numbers only) */ photos_per_person?: number[] };
  paid: BaseProps & { variant: "single" | "bundle" | "bundle3" | "add1" | "credit"; amount_usd_cents: number; currency: string; payment_provider: string };
  call_scheduled: BaseProps & { window_start_utc: string; window_end_utc: string };
  call_started: BaseProps & { attempt: number };
  call_completed: BaseProps & { attempt: number; agent_seconds: number; telephony_seconds: number; ended_by: string };
  delivered: BaseProps & { channel: "email" | "whatsapp" | "web" };
  survey_answered: BaseProps & { answer: "loved" | "ok" | "bad" };
  call_attempt_ended: BaseProps & {
    attempt: number;
    result: string;
    telephony_seconds: number;
    agent_seconds: number;
    recorded: boolean;
  };
  refunded: BaseProps & { reason: string; amount_usd_cents: number; automatic: boolean };
  opted_out: BaseProps & { source: string };
  incident_flagged: BaseProps & { incident_type: string };
  /** Post-call delivery step failed (recording, certificate, email). `error` is truncated and has emails/numbers redacted. */
  post_call_failed: BaseProps & { call_id: string; error: string };
  /** Colorear: one book generation run. `theme` is a catalog id, "custom" or "none"; never the buyer's text. */
  generation_started: BaseProps & { pages_total: number; provider: string; model: string; quality: string; character_model?: string; character_quality?: string; age_band: string; persons: number; theme: string };
  generation_page_retried: BaseProps & { page_index: number; attempt: number; reason: string };
  /**
   * image_cost_usd_cents is the estimated provider cost of the whole book (fractions of a cent allowed). `model` / `quality` are the pages',
   * `character_*` the character step's, with the cost of each step, so books made with different models can be compared.
   */
  generation_completed: BaseProps & {
    provider: string; images_generated: number; retries: number; image_cost_usd_cents: number; duration_seconds: number; pdf_bytes: number;
    model?: string; quality?: string; character_model?: string; character_quality?: string; character_cost_usd_cents?: number; pages_cost_usd_cents?: number;
  };
  generation_failed: BaseProps & { reason: string; pages_done: number };
  content_blocked: BaseProps & { stage: "input" | "output"; reason: string };
  book_downloaded: BaseProps & { kind: "pdf" };
  /** Photos of the order were erased (reason: characters_ready | unpaid | refund | retention). Counts only. */
  photos_deleted: BaseProps & { count: number; reason: string };
  /** Colorear landing: the buyer picked an option in the selector (1 adventure / Trio). Sent only when the choice changes. */
  bundle_selected: BaseProps & { variant: "single" | "bundle3"; previous: "single" | "bundle3" | "none" };
  /** Colorear: one of the Trio's 2 extra adventures was requested with 1 click (characters reused, no photos). */
  credit_used: BaseProps & { variant: "credit"; credits_left: number; credits_total: number };
  /** Colorear: the delivery page showed "otra aventura con las mismas fotos" for the first time (hours_left of the 48 h window). */
  upsell_viewed: BaseProps & { offer: "add1"; hours_left: number };
  /** Colorear: the "otra aventura" order was paid. Sent together with `paid` (variant add1). */
  upsell_purchased: BaseProps & { offer: "add1"; amount_usd_cents: number; currency: string };
  /** Colorear: character drawings kept for the Trio/upsell were erased (reason: window_ended | credits_used | refund). Counts only. */
  characters_deleted: BaseProps & { count: number; reason: string };
  /** Colorear: day-25 email "your book is deleted on <date>" (has_credits: it also reminded unused Trio adventures). */
  expiry_reminder_sent: BaseProps & { days_left: number; has_credits: boolean; sent: boolean };
  /**
   * Colorear: an order skipped the payment with a test code. `code_hash` is a short keyed hash (10 hex chars), never the code itself;
   * `uses_total` / `uses_24h` are this code's order counts including this one (to watch the two caps). Always `test_mode: true`.
   */
  test_code_redeemed: BaseProps & { code_hash: string; variant: "single" | "bundle3"; uses_total: number; uses_24h: number; max_uses: number; daily_cap: number };
}

export type EventProps<N extends EventName> = EventPropsMap[N];

export interface TrackedEvent<N extends EventName = EventName> {
  name: N;
  ts: string;
  props: EventPropsMap[N];
}

/** Property names that must never reach analytics sinks (PostHog included). */
const FORBIDDEN_KEYS = ["email", "phone", "phone_e164", "ip", "name", "child_name", "child_first_name", "details", "address", "user_agent"];

export function assertNoPii(props: Record<string, unknown>): void {
  for (const key of Object.keys(props)) {
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) {
      throw new Error(`Analytics property "${key}" is personal data and is not allowed`);
    }
  }
}

export interface EventSink {
  write(event: TrackedEvent): Promise<void>;
}

export class MemorySink implements EventSink {
  readonly events: TrackedEvent[] = [];
  async write(event: TrackedEvent): Promise<void> {
    this.events.push(event);
  }
}

export class MultiSink implements EventSink {
  constructor(private readonly sinks: EventSink[]) {}
  async write(event: TrackedEvent): Promise<void> {
    // One failing sink must not break the customer flow.
    await Promise.allSettled(this.sinks.map((s) => s.write(event)));
  }
}

/** PostHog capture API (no SDK needed). Active only when POSTHOG_KEY is set. */
export class PostHogSink implements EventSink {
  constructor(
    private readonly apiKey: string,
    private readonly host = "https://us.i.posthog.com",
    private readonly fetchFn: typeof fetch = fetch,
  ) {}
  async write(event: TrackedEvent): Promise<void> {
    const distinct = event.props.order_id ?? "anonymous";
    await this.fetchFn(`${this.host}/capture/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: this.apiKey,
        event: event.name,
        distinct_id: distinct,
        timestamp: event.ts,
        properties: { ...event.props, $process_person_profile: false },
      }),
    });
  }
}

export interface EventsTableWriter {
  insert(row: {
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
  }): Promise<unknown>;
}

/** Internal source of truth: the `events` table (read by `npm run costs`). */
export class TableSink implements EventSink {
  constructor(private readonly table: EventsTableWriter) {}
  async write(event: TrackedEvent): Promise<void> {
    const { product, country, language, creative, device, order_id, test_mode, ...rest } = event.props as BaseProps & Record<string, unknown>;
    await this.table.insert({
      name: event.name,
      ts: event.ts,
      order_id: order_id ?? null,
      product,
      country,
      language,
      creative,
      device,
      test_mode: !!test_mode,
      properties: rest,
    });
  }
}

export class Tracker {
  constructor(private readonly sink: EventSink, private readonly now: () => Date = () => new Date()) {}

  async track<N extends EventName>(name: N, props: EventPropsMap[N]): Promise<void> {
    assertNoPii(props as unknown as Record<string, unknown>);
    await this.sink.write({ name, ts: this.now().toISOString(), props } as TrackedEvent);
  }
}
