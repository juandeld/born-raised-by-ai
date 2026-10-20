/**
 * Weekly reconciliation Polar <-> our database (pagos-finanzas). Pure: the script fetches both sides and passes them in.
 * A mismatch is never fixed silently; it is listed, and the safe repair is to replay the Polar event through the webhook handler.
 */
export interface PolarOrderLite {
  id: string;
  status: string; // pending | paid | refunded | partially_refunded ...
  netAmount: number;
  currency: string;
  checkoutId: string | null;
  orderId: string | null; // metadata.order_id
}
export interface DbOrderLite {
  id: string;
  status: string; // created | scheduled | ... | refunded
  paymentId: string | null;
  checkoutId: string | null;
  amountMinor: number;
  currency: string;
  testMode: boolean;
}
export interface Mismatch {
  kind: "paid_in_polar_not_in_db" | "refunded_in_polar_not_in_db" | "paid_in_db_not_in_polar" | "refunded_in_db_not_in_polar" | "orphan_polar_order" | "amount_differs";
  polarOrderId?: string;
  dbOrderId?: string;
  detail: string;
}
export interface ReconcileReport {
  polarPaid: number;
  dbPaid: number;
  polarRefunded: number;
  grossMinorByCurrency: Record<string, number>;
  mismatches: Mismatch[];
}

const PAID_DB = (s: string) => s !== "created" && s !== "refunded" && s !== "cancelled" && s !== "expired";

export function reconcile(polar: PolarOrderLite[], db: DbOrderLite[]): ReconcileReport {
  const real = db.filter((o) => !o.testMode);
  const byId = new Map(real.map((o) => [o.id, o]));
  const byCheckout = new Map(real.filter((o) => o.checkoutId).map((o) => [o.checkoutId!, o]));
  const byPayment = new Map(real.filter((o) => o.paymentId).map((o) => [o.paymentId!, o]));
  const mismatches: Mismatch[] = [];
  const seenDb = new Set<string>();
  const gross: Record<string, number> = {};
  let polarPaid = 0;
  let polarRefunded = 0;

  for (const p of polar) {
    const isPaid = p.status === "paid";
    const isRefunded = p.status === "refunded";
    if (!isPaid && !isRefunded && p.status !== "partially_refunded") continue;
    if (isPaid) { polarPaid++; gross[p.currency] = (gross[p.currency] ?? 0) + p.netAmount; }
    if (isRefunded) polarRefunded++;
    const o = (p.orderId && byId.get(p.orderId)) || byPayment.get(p.id) || (p.checkoutId ? byCheckout.get(p.checkoutId) : undefined);
    if (!o) { mismatches.push({ kind: "orphan_polar_order", polarOrderId: p.id, detail: `Polar ${p.status} order without a matching order in the database` }); continue; }
    seenDb.add(o.id);
    if (isPaid && !PAID_DB(o.status)) mismatches.push({ kind: "paid_in_polar_not_in_db", polarOrderId: p.id, dbOrderId: o.id, detail: `database status "${o.status}"; replay order.paid` });
    if (isRefunded && o.status !== "refunded") mismatches.push({ kind: "refunded_in_polar_not_in_db", polarOrderId: p.id, dbOrderId: o.id, detail: `database status "${o.status}"; replay order.refunded` });
    if (isPaid && PAID_DB(o.status) && o.currency.toLowerCase() === p.currency.toLowerCase() && Math.abs(o.amountMinor - p.netAmount) > Math.max(2, o.amountMinor * 0.2)) {
      // net excludes tax, so only a large gap is suspicious
      mismatches.push({ kind: "amount_differs", polarOrderId: p.id, dbOrderId: o.id, detail: `database ${o.amountMinor} vs Polar net ${p.netAmount} ${p.currency}` });
    }
  }
  let dbPaid = 0;
  for (const o of real) {
    if (!o.paymentId && !PAID_DB(o.status)) continue;
    if (PAID_DB(o.status)) dbPaid++;
    if (seenDb.has(o.id)) continue;
    if (PAID_DB(o.status)) mismatches.push({ kind: "paid_in_db_not_in_polar", dbOrderId: o.id, detail: `database status "${o.status}" but Polar has no paid order for it` });
    else if (o.status === "refunded" && o.paymentId) mismatches.push({ kind: "refunded_in_db_not_in_polar", dbOrderId: o.id, detail: "refunded in database but Polar does not list it as refunded" });
  }
  return { polarPaid, dbPaid, polarRefunded, grossMinorByCurrency: gross, mismatches };
}
