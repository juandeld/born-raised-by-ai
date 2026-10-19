import { COST_RATES, EXPECTED_VARIABLE_COST_USD, type CostRates } from "@lumen/config";
import type { CountryCode } from "@lumen/config";

/** A row of the `events` table, as `npm run costs` reads it. */
export interface EventRow {
  name: string;
  ts: string;
  order_id: string | null;
  product: string;
  country: string;
  test_mode?: boolean;
  properties: Record<string, unknown>;
}

export interface OrderCost {
  orderId: string;
  country: string;
  paidUsd: number;
  agentMinutes: number;
  telephonyMinutes: number;
  attempts: number;
  elevenlabs: number;
  telephony: number;
  recording: number;
  llm: number;
  payment: number;
  infra: number;
  total: number;
  withinExpected: boolean | null;
}

const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/**
 * Cost per order from events. Rules:
 *  - Telephony is billed per started minute, per attempt (Twilio rounds up).
 *  - Recording is billed only for attempts that were recorded (after the first key 1).
 *  - ElevenLabs and LLM are billed on agent minutes only (after the second key 1).
 *  - Payment fee uses the Polar formula (5 % + $0.50, +1.5 % for non-US) unless paid with Recurrente.
 *  - Infra (PDF, email, storage) only if the order was delivered.
 */
export function computeOrderCosts(events: EventRow[], rates: CostRates = COST_RATES): OrderCost[] {
  const byOrder = new Map<string, EventRow[]>();
  for (const e of events) {
    if (!e.order_id) continue;
    const list = byOrder.get(e.order_id) ?? [];
    list.push(e);
    byOrder.set(e.order_id, list);
  }
  const out: OrderCost[] = [];
  for (const [orderId, list] of byOrder) {
    const paid = list.find((e) => e.name === "paid");
    if (!paid) continue;
    const country = paid.country as CountryCode;
    const paidUsd = num(paid.properties.amount_usd_cents) / 100;
    const provider = String(paid.properties.payment_provider ?? "polar");
    let agentSeconds = 0;
    let telephonyMinutes = 0;
    let recordedMinutes = 0;
    let attempts = 0;
    for (const e of list.filter((x) => x.name === "call_attempt_ended")) {
      attempts += 1;
      const tel = num(e.properties.telephony_seconds);
      const minutes = tel > 0 ? Math.ceil(tel / 60) : 0;
      telephonyMinutes += minutes;
      if (e.properties.recorded) recordedMinutes += minutes;
      agentSeconds += num(e.properties.agent_seconds);
    }
    const agentMinutes = agentSeconds / 60;
    const telRate = rates.twilioPerMin[country] ?? rates.twilioPerMin.US;
    const elevenlabs = agentMinutes * rates.elevenlabsPerMin;
    const telephony = telephonyMinutes * telRate;
    const recording = recordedMinutes * rates.twilioRecordingPerMin;
    const llm = agentMinutes * rates.llmPerMin;
    let payment: number;
    if (provider === "recurrente") {
      payment = paidUsd * rates.recurrente.pct + rates.recurrente.fixedUsd;
    } else if (provider === "mock") {
      payment = 0;
    } else {
      payment = paidUsd * (rates.polar.pct + (country === "US" ? 0 : rates.polar.intlPct)) + rates.polar.fixedUsd;
    }
    const delivered = list.some((e) => e.name === "delivered");
    const infra = delivered ? rates.infraPerOrderUsd : 0;
    // Expected range compares IA + telco + infra (without payment fee), like the research table.
    const variable = elevenlabs + telephony + recording + llm + infra;
    const expected = EXPECTED_VARIABLE_COST_USD[country];
    out.push({
      orderId,
      country,
      paidUsd,
      agentMinutes,
      telephonyMinutes,
      attempts,
      elevenlabs,
      telephony,
      recording,
      llm,
      payment,
      infra,
      total: variable + payment,
      withinExpected: expected && delivered ? variable <= expected.max * 1.15 : null,
    });
  }
  return out;
}

export interface CountrySummary {
  country: string;
  orders: number;
  avgVariable: number;
  avgPayment: number;
  avgTotal: number;
  variablePctOfPrice: number;
}

export function summarizeByCountry(costs: OrderCost[]): CountrySummary[] {
  const groups = new Map<string, OrderCost[]>();
  for (const c of costs) groups.set(c.country, [...(groups.get(c.country) ?? []), c]);
  return [...groups.entries()].map(([country, list]) => {
    const n = list.length;
    const variable = list.reduce((s, c) => s + (c.total - c.payment), 0);
    const payment = list.reduce((s, c) => s + c.payment, 0);
    const paid = list.reduce((s, c) => s + c.paidUsd, 0);
    return {
      country,
      orders: n,
      avgVariable: variable / n,
      avgPayment: payment / n,
      avgTotal: (variable + payment) / n,
      variablePctOfPrice: paid > 0 ? (variable / paid) * 100 : 0,
    };
  });
}
