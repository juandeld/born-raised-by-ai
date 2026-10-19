import { MemorySink, MultiSink, TableSink, Tracker } from "@lumen/analytics";
import { SANTA, brandConfig } from "@lumen/config";
import { createMemoryDb } from "@lumen/db";
import {
  CallsEngine,
  InlineDispatcher,
  MemoryStorage,
  MockDeliveryProvider,
  MockTelephonyProvider,
  MockVoiceProvider,
  BuiltinPdfRenderer,
  WhatsAppStubDeliveryProvider,
  type CheckoutInput,
  type EngineDeps,
} from "@lumen/calls";
import { MockPaymentProvider } from "@lumen/payments";

export interface Harness {
  engine: CallsEngine;
  deps: EngineDeps;
  clock: { now: Date };
  telephony: MockTelephonyProvider;
  voice: MockVoiceProvider;
  delivery: MockDeliveryProvider;
  payments: MockPaymentProvider;
  storage: MemoryStorage;
  sink: MemorySink;
  dispatcher: InlineDispatcher;
}

export function makeHarness(opts: { maxConcurrency?: number; env?: Record<string, string> } = {}): Harness {
  const db = createMemoryDb();
  const clock = { now: new Date("2026-12-20T15:00:00Z") };
  const sink = new MemorySink();
  const telephony = new MockTelephonyProvider();
  const voice = new MockVoiceProvider();
  const delivery = new MockDeliveryProvider();
  const payments = new MockPaymentProvider("http://localhost:3000");
  const storage = new MemoryStorage();
  const dispatcher = new InlineDispatcher();
  const env = { ENABLED_COUNTRIES: "US,ES,GB,MX", PHONE_HASH_SALT: "test-salt", OWNER_ALERT_EMAIL: "owner@example.com", LEGAL_ALERT_EMAIL: "legal@example.com", ...opts.env };
  const deps: EngineDeps = {
    db,
    tracker: new Tracker(new MultiSink([new TableSink(db.events as never), sink]), () => clock.now),
    voice,
    telephony,
    delivery,
    whatsapp: new WhatsAppStubDeliveryProvider(),
    payments,
    storage,
    pdf: new BuiltinPdfRenderer(),
    env,
    now: () => clock.now,
    product: SANTA,
    maxConcurrency: opts.maxConcurrency ?? 20,
    brand: brandConfig(env),
    agentIds: { "es-419": "agent_es419", "es-ES": "agent_eses", en: "agent_en" },
    dispatcher,
  };
  const engine = new CallsEngine(deps);
  dispatcher.handlers["call/ended"] = async (d) => {
    await engine.afterCall(d.callId as string);
  };
  return { engine, deps, clock, telephony, voice, delivery, payments, storage, sink, dispatcher };
}

export const ALL_BOXES = ["C1", "C2", "C3", "C4", "C5", "C6"];

/** Call tomorrow-ish at 18:00 Mexico City (window 18:00-20:00 local = 00:00-02:00 UTC next day). */
export function mxCheckout(overrides: Partial<CheckoutInput> = {}): CheckoutInput {
  return {
    language: "es-419",
    country: "MX",
    variant: "single",
    email: "Mama@Example.com",
    phone: "+52 55 1234 5678",
    childName: "Sofía",
    childAge: 6,
    details: "Le encanta su perro Max y ayudó a ordenar su cuarto",
    date: "2026-12-24",
    windowStartHour: 18,
    timezone: "America/Mexico_City",
    checkboxIds: ALL_BOXES,
    ip: "203.0.113.7",
    creative: "reaction-1",
    device: "mobile",
    ...overrides,
  };
}

export const urls = { successUrl: (o: { access_token: string }) => `http://localhost:3000/es-419/entrega/${o.access_token}`, cancelUrl: "http://localhost:3000/es-419/comprar" };

/** Checkout + mock payment confirmed. Returns the scheduled order. */
export async function buyAndSchedule(h: Harness, input: CheckoutInput = mxCheckout()) {
  const { order, checkoutUrl } = await h.engine.orders.createCheckout(input, urls);
  await h.engine.handlePaymentEvent({ type: "payment_succeeded", orderId: order.id, checkoutId: order.checkout_id, paymentId: `pay_${order.id.slice(0, 6)}` });
  const scheduled = (await h.deps.db.orders.get(order.id))!;
  return { order: scheduled, checkoutUrl };
}

/** Moves the fake clock to one minute into the order window. */
export function enterWindow(h: Harness, windowStartIso: string, plusMinutes = 1) {
  h.clock.now = new Date(new Date(windowStartIso).getTime() + plusMinutes * 60_000);
}
