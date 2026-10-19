import { RETENTION_DAYS, COUNTRIES, LOCALE_SLUG, addDays } from "@lumen/config";
import type { CallRow, OrderRow } from "@lumen/db";
import { Certificate } from "./certificate";
import type { EngineDeps } from "./deps";
import { composeMessage } from "./emails";
import { Recorder } from "./recorder";
import { AgentTools } from "./tools";
import type { Language } from "./types";
import { baseProps, formatLocal, iso, addMinutes } from "./util";

export type PostCallOutcome = { kind: "delivered" } | { kind: "recording_pending"; retryAt: Date };

const EMERGENCY: Record<string, string> = { US: "911", MX: "911", ES: "112", GB: "999" }; // [no verificado: confirmar vigencia]
const CHARACTER_NAME: Record<string, Record<Language, string>> = { santa: { "es-419": "Santa", "es-ES": "Papá Noel", en: "Santa" } };

/** Recording -> MP3 -> certificate -> delivery -> deletion of the vendor copies (A-10). */
export class PostCall {
  private readonly recorder: Recorder;
  private readonly certificate: Certificate;

  constructor(private readonly d: EngineDeps) {
    this.recorder = new Recorder(d.telephony, d.storage);
    this.certificate = new Certificate(d.pdf);
  }

  async run(call: CallRow): Promise<PostCallOutcome> {
    const d = this.d;
    const order = (await d.db.orders.get(call.order_id))!;
    if (order.status === "delivered" || order.status === "refunded") return { kind: "delivered" };
    if (!call.recording_id) throw new Error(`Call ${call.id} completed without a recording id`);

    const rec = await this.recorder.collect({ orderId: order.id, callId: call.id, recordingId: call.recording_id });
    if (!rec.ready) return { kind: "recording_pending", retryAt: addMinutes(d.now(), 2) };

    const now = d.now();
    const language = order.language as Language;
    const country = COUNTRIES[order.country];
    const cert = await this.certificate.render({
      language,
      brand: d.brand.brand,
      character: CHARACTER_NAME[order.product]?.[language] ?? order.product,
      childFirstName: order.child_first_name!,
      callDateLocal: formatLocal(new Date(call.started_at), order.timezone, country.priceFormatLocale),
      durationMinutes: Math.max(1, Math.round((call.agent_seconds || rec.durationSeconds) / 60)),
    });
    const pdfPath = `certificates/${order.id}.pdf`;
    await d.storage.put(pdfPath, cert.pdf, "application/pdf");

    const linkExpires = addDays(now, RETENTION_DAYS.recording);
    const deliveryLink = `${d.brand.domain}/${LOCALE_SLUG[language]}/entrega/${order.access_token}`;
    const res = await d.delivery.send(
      composeMessage("delivery", language, order.email!, {
        childName: order.child_first_name!,
        deliveryLink,
        linkExpires: linkExpires.toISOString().slice(0, 10),
        holder: d.brand.holder,
        privacyEmail: d.brand.privacyEmail,
        supportEmail: d.brand.supportEmail,
        brand: d.brand.brand,
      }),
    );
    if (res.status === "failed") throw new Error(`Delivery email failed for order ${order.id}`); // Inngest retries the step
    await d.db.deliveries.insert({
      order_id: order.id, kind: "delivery", channel: res.channel, status: res.status, provider: res.provider, provider_id: res.providerId,
      mp3_path: rec.path, pdf_path: pdfPath, link_expires_at: iso(linkExpires), survey_answer: null, survey_at: null,
      purge_at: iso(addDays(now, RETENTION_DAYS.deliveryLog)),
    });
    await d.db.calls.update(call.id, { recording_path: rec.path, recording_purge_at: iso(linkExpires) });
    await d.db.orders.update(order.id, { status: "delivered", delivered_at: iso(now), purge_at: iso(addDays(now, RETENTION_DAYS.order)) });
    await d.tracker.track("delivered", { ...baseProps(order), channel: res.channel === "whatsapp" ? "whatsapp" : "email" });

    // A-10: delete the vendor copies right after delivery. Our private copy lives 30 days.
    await d.telephony.deleteRecording(call.recording_id);
    if (call.conversation_id) await d.voice.deleteConversation(call.conversation_id);
    await d.db.calls.update(call.id, { recording_id: null, conversation_id: null });

    await this.notifyIncidents(order, call);
    return { kind: "delivered" };
  }

  /** Neutral email to the buyer for safety incidents (docs/legal/textos/07 section E). Once per call. */
  private async notifyIncidents(order: OrderRow, call: CallRow): Promise<void> {
    const fresh = (await this.d.db.calls.get(call.id))!;
    const relevant = fresh.incidents.filter((i) => AgentTools.shouldNotifyBuyer(i.type));
    if (!relevant.length || !order.email) return;
    const msg = composeMessage("incident", order.language as Language, order.email, {
      childName: order.child_first_name!,
      holder: this.d.brand.holder,
      privacyEmail: this.d.brand.privacyEmail,
      supportEmail: this.d.brand.supportEmail,
      brand: this.d.brand.brand,
      emergencyNumber: EMERGENCY[order.country],
    });
    const res = await this.d.delivery.send(msg);
    await this.d.db.deliveries.insert({
      order_id: order.id, kind: "incident", channel: res.channel, status: res.status, provider: res.provider, provider_id: res.providerId,
      mp3_path: null, pdf_path: null, link_expires_at: null, survey_answer: null, survey_at: null,
      purge_at: iso(addDays(this.d.now(), RETENTION_DAYS.deliveryLog)),
    });
  }
}
