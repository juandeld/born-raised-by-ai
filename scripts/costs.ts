/**
 * npm run costs [-- --days 7] [--real]
 * Real AI/telephony/payment cost per order of the last N days (default 7), by country. Read by `metricas`.
 * Reads the `events` table of the configured database (mock file in development, Supabase in production).
 * Test-mode orders are excluded.
 */
import { computeOrderCosts, summarizeByCountry, type EventRow } from "@lumen/analytics";
import { EXPECTED_VARIABLE_COST_USD, type CountryCode } from "@lumen/config";
import { getDb } from "@lumen/db";

const args = process.argv.slice(2);
const days = Number(args[args.indexOf("--days") + 1] || 7) || 7;
const since = new Date(Date.now() - days * 86_400_000).toISOString();

async function main() {
const db = getDb();
const rows = (await db.events.find({ ts: { gte: since } })) as unknown as EventRow[];
const real = rows.filter((e) => !e.test_mode);
const costs = computeOrderCosts(real);
const summary = summarizeByCountry(costs);

console.log(`Costs per order, last ${days} days (db: ${db.kind}, ${real.length} events, ${costs.length} orders, test orders excluded)`);
if (!summary.length) {
  console.log("No real orders yet.");
} else {
  console.table(
    summary.map((s) => ({
      country: s.country,
      orders: s.orders,
      "variable $": s.avgVariable.toFixed(2),
      "payment fee $": s.avgPayment.toFixed(2),
      "total $": s.avgTotal.toFixed(2),
      "variable % of price": `${s.variablePctOfPrice.toFixed(1)} % ${s.variablePctOfPrice <= 10 ? "OK" : "OVER 10 %"}`,
      "expected $": (() => {
        const e = EXPECTED_VARIABLE_COST_USD[s.country as CountryCode];
        return e ? `${e.min}-${e.max}` : "n/a";
      })(),
    })),
  );
  const outside = costs.filter((c) => c.withinExpected === false);
  if (outside.length) console.log(`${outside.length} order(s) outside the expected range: ${outside.map((c) => c.orderId.slice(0, 8)).join(", ")}`);
}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
