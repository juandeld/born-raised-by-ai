/**
 * Polar readiness and weekly reconciliation (pagos-finanzas).
 *   npx tsx scripts/polar-check.ts            -> catalog the account must have + what is missing in POLAR_PRODUCT_MAP
 *   npx tsx scripts/polar-check.ts --reconcile [days=14]   -> compares Polar orders with the database (needs POLAR_ACCESS_TOKEN and the DB env)
 * Env comes from the shell (never from a committed file). Prints no secrets.
 */
import { checkProductMap, polarCatalog, reconcile, type DbOrderLite, type PolarOrderLite } from "../packages/payments/src";

async function main() {
  const env = process.env;
  let map: Record<string, string> = {};
  try { map = JSON.parse(env.POLAR_PRODUCT_MAP ?? "{}"); } catch { console.error("POLAR_PRODUCT_MAP is not valid JSON"); process.exit(1); }
  console.log("Catalogo que Polar debe tener (PAYMENT_PROVIDER=polar):");
  for (const i of polarCatalog(env)) console.log(`  ${map[i.key] ? "OK " : i.required ? "FALTA" : "off  "} ${i.key}  ${(i.amountMinor / 100).toFixed(2)} ${i.currency}`);
  const chk = checkProductMap(map, env);
  console.log(chk.ok ? "Mapa de productos completo." : `Faltan: ${chk.missing.join(", ") || "-"}  Mal formados: ${chk.malformed.join(", ") || "-"}`);
  if (chk.unknown.length) console.log(`Claves sin uso: ${chk.unknown.join(", ")}`);
  for (const v of ["POLAR_ACCESS_TOKEN", "POLAR_WEBHOOK_SECRET", "POLAR_SERVER", "PAYMENT_PROVIDER", "ENABLED_COUNTRIES"]) console.log(`  ${v}: ${env[v] ? (v.includes("TOKEN") || v.includes("SECRET") ? "definida" : env[v]) : "NO definida"}`);

  if (!process.argv.includes("--reconcile")) return;
  const days = Number(process.argv[process.argv.indexOf("--reconcile") + 1]) || 14;
  if (!env.POLAR_ACCESS_TOKEN) throw new Error("POLAR_ACCESS_TOKEN required");
  const base = env.POLAR_SERVER === "production" ? "https://api.polar.sh" : "https://sandbox-api.polar.sh";
  const since = Date.now() - days * 86_400_000;
  const polar: PolarOrderLite[] = [];
  for (let page = 1; page <= 50; page++) {
    const r = await fetch(`${base}/v1/orders/?limit=100&page=${page}&sorting=-created_at`, { headers: { authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}` } });
    if (!r.ok) throw new Error(`Polar orders ${r.status}`);
    const j = (await r.json()) as { items: Array<Record<string, any>>; pagination?: { max_page?: number } };
    for (const o of j.items) {
      if (new Date(o.created_at).getTime() < since) continue;
      polar.push({ id: o.id, status: o.status, netAmount: o.net_amount ?? 0, currency: String(o.currency ?? "").toUpperCase(), checkoutId: o.checkout_id ?? null, orderId: o.metadata?.order_id ?? null });
    }
    if (page >= (j.pagination?.max_page ?? 1) || j.items.length === 0 || new Date(j.items[j.items.length - 1]!.created_at).getTime() < since) break;
  }
  const { createEngine } = await import("../engines/calls/src");
  const engine = createEngine({ env });
  const rows = await engine.deps.db.orders.find({}, { limit: 5000 });
  const db: DbOrderLite[] = rows
    .filter((o) => new Date(o.created_at).getTime() >= since)
    .map((o) => ({ id: o.id, status: o.status, paymentId: o.payment_id, checkoutId: o.checkout_id, amountMinor: o.amount_minor, currency: o.currency, testMode: o.test_mode }));
  const rep = reconcile(polar, db);
  console.log(JSON.stringify({ days, ...rep }, null, 2));
  process.exit(rep.mismatches.length ? 2 : 0);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
