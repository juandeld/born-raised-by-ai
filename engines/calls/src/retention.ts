import type { EngineDeps } from "./deps";
import { iso } from "./util";

export interface RetentionReport {
  ordersScrubbed: number;
  recordingsDeleted: number;
  vendorCopiesDeleted: number;
  consentsDeleted: number;
  deliveriesDeleted: number;
  callLogsDeleted: number;
}

/**
 * Deletion cron (docs/decisiones.md D8, docs/legal/textos 01/02/04):
 *  - order personal data and recordings: 30 days after delivery (purge_at / recording_purge_at);
 *  - consent records: 4 years; delivery log: 13 months; call log (no content, A-12): 13 months with the delivery log.
 * The order row itself is kept without personal data (id, amounts, status, country) for accounting and metrics.
 */
export class RetentionJob {
  constructor(private readonly d: EngineDeps) {}

  async run(): Promise<RetentionReport> {
    const d = this.d;
    const now = iso(d.now());
    const report: RetentionReport = { ordersScrubbed: 0, recordingsDeleted: 0, vendorCopiesDeleted: 0, consentsDeleted: 0, deliveriesDeleted: 0, callLogsDeleted: 0 };

    // 1. Recordings and certificates in our storage, and any vendor copy that survived.
    const dueCalls = await d.db.calls.find({ recording_purge_at: { lte: now } });
    for (const call of dueCalls) {
      if (call.recording_path) {
        await d.storage.delete(call.recording_path);
        report.recordingsDeleted += 1;
      }
      if (call.recording_id) {
        await d.telephony.deleteRecording(call.recording_id);
        report.vendorCopiesDeleted += 1;
      }
      if (call.conversation_id) {
        await d.voice.deleteConversation(call.conversation_id);
        report.vendorCopiesDeleted += 1;
      }
      await d.db.calls.update(call.id, { recording_path: null, recording_id: null, conversation_id: null, recording_purge_at: null });
      const deliveries = await d.db.deliveries.find({ order_id: call.order_id });
      for (const del of deliveries) {
        if (del.pdf_path) await d.storage.delete(del.pdf_path);
        if (del.mp3_path || del.pdf_path) await d.db.deliveries.update(del.id, { mp3_path: null, pdf_path: null });
      }
    }

    // 2. Order personal data. Also removes files of calls that never got a recording_purge_at.
    const dueOrders = await d.db.orders.find({ purge_at: { lte: now }, pii_purged_at: null });
    for (const order of dueOrders) {
      for (const call of await d.db.calls.find({ order_id: order.id })) {
        if (call.recording_path) await d.storage.delete(call.recording_path);
        if (call.recording_id) await d.telephony.deleteRecording(call.recording_id);
        if (call.conversation_id) await d.voice.deleteConversation(call.conversation_id);
        await d.db.calls.update(call.id, { recording_path: null, recording_id: null, conversation_id: null, recording_purge_at: null });
      }
      for (const del of await d.db.deliveries.find({ order_id: order.id })) {
        if (del.pdf_path) await d.storage.delete(del.pdf_path);
        if (del.mp3_path) await d.storage.delete(del.mp3_path);
        if (del.mp3_path || del.pdf_path) await d.db.deliveries.update(del.id, { mp3_path: null, pdf_path: null });
      }
      await d.db.orders.update(order.id, {
        email: null,
        phone_e164: null,
        phone_e164_hash: null,
        child_first_name: null,
        child_age: null,
        details: null,
        consent_draft: null,
        pii_purged_at: now,
      });
      report.ordersScrubbed += 1;
    }

    // 3. Consent records (4 years).
    for (const c of await d.db.consents.find({ purge_at: { lte: now } })) {
      await d.db.consents.delete(c.id);
      report.consentsDeleted += 1;
    }
    // 4. Delivery log and call log (13 months).
    for (const del of await d.db.deliveries.find({ purge_at: { lte: now } })) {
      await d.db.deliveries.delete(del.id);
      report.deliveriesDeleted += 1;
    }
    const logCutoff = iso(new Date(d.now().getTime() - 13 * 30 * 24 * 3600_000));
    for (const call of await d.db.calls.find({ started_at: { lte: logCutoff } })) {
      await d.db.calls.delete(call.id);
      report.callLogsDeleted += 1;
    }
    return report;
  }
}
