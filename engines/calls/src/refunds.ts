import type { OrderRow } from "@lumen/db";
import { formatPrice, COUNTRIES } from "@lumen/config";
import type { EngineDeps } from "./deps";
import { composeMessage } from "./emails";
import { baseProps, iso } from "./util";
import type { Language } from "./types";

export type RefundReason = "customer_request" | "no_delivery" | "opt_out" | "not_purchaser" | "technical_failure" | "window_closed" | "missing_consent" | "adult_unaware" | "support";

export interface RefundOutcome {
  refunded: boolean;
  reason?: string;
}

/** Automatic refund path. Called by the scheduler, the controller, the support agent and the refund link. No human involved. */
export class RefundService {
  constructor(private readonly d: EngineDeps) {}

  async refund(orderId: string, opts: { reason: RefundReason; automatic: boolean }): Promise<RefundOutcome> {
    const order = await this.d.db.orders.get(orderId);
    if (!order) return { refunded: false, reason: "not_found" };
    if (order.status === "refunded") return { refunded: true, reason: "already_refunded" };
    if (!order.payment_id) {
      // Never paid: just cancel.
      await this.d.db.orders.update(order.id, { status: "cancelled" });
      return { refunded: false, reason: "not_paid" };
    }
    const now = this.d.now();
    await this.d.payments.refund({ paymentId: order.payment_id, currency: order.currency as never, reason: opts.reason });
    // purge_at = now: the nightly job removes the personal data soon (the refund email is sent first, below).
    await this.d.db.orders.update(order.id, {
      status: "refunded",
      refunded_at: iso(now),
      refund_reason: opts.reason,
      refund_amount_minor: order.amount_minor,
      purge_at: iso(now),
    });
    await this.d.tracker.track("refunded", { ...baseProps(order), reason: opts.reason, amount_usd_cents: order.amount_usd_cents, automatic: opts.automatic });
    await this.sendRefundEmail(order);
    return { refunded: true };
  }

  private async sendRefundEmail(order: OrderRow): Promise<void> {
    if (!order.email) return;
    const lang = order.language as Language;
    const price = formatPrice(order.amount_minor, order.currency as never, COUNTRIES[order.country].priceFormatLocale);
    const msg = composeMessage("refund", lang, order.email, {
      childName: order.child_first_name ?? "",
      price,
      holder: this.d.brand.holder,
      privacyEmail: this.d.brand.privacyEmail,
      supportEmail: this.d.brand.supportEmail,
      brand: this.d.brand.brand,
    });
    await this.d.delivery.send(msg);
  }
}
