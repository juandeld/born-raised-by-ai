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
const allCosts = computeOrderCosts(real);
// Colorear has its own table below (image cost); this one stays Santa-only as before.
const costs = allCosts.filter((c) => c.product !== "colorear");
const colorear = allCosts.filter((c) => c.product === "colorear");
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

if (colorear.length) {
  console.log(`\nColorear: real image cost per order, last ${days} days (${colorear.length} orders)`);
  console.table(
    summarizeByCountry(colorear).map((s) => ({
      country: s.country,
      orders: s.orders,
      "image+infra $": s.avgVariable.toFixed(2),
      "payment fee $": s.avgPayment.toFixed(2),
      "total $": s.avgTotal.toFixed(2),
      "variable % of price": `${s.variablePctOfPrice.toFixed(1)} % ${s.variablePctOfPrice <= 25 ? "OK" : "OVER 25 %"}`,
    })),
  );
}

// Test-code orders (no payment, real generation) are test mode, so they are left out above. Their spend is shown apart: it is the cost of the team tests.
const testPaid = rows.filter((e) => e.test_mode && e.name === "paid" && e.properties.payment_provider === "test_code");
if (testPaid.length) {
  const ids = new Set(testPaid.map((e) => e.order_id));
  const spendUsd = rows.filter((e) => e.test_mode && e.name === "generation_completed" && e.order_id && ids.has(e.order_id)).reduce((sum, e) => sum + (typeof e.properties.image_cost_usd_cents === "number" ? e.properties.image_cost_usd_cents : 0) / 100, 0);
  console.log(`\nTest-code orders, last ${days} days: ${testPaid.length} orders, image cost $${spendUsd.toFixed(2)} (not in the tables above)`);
}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
