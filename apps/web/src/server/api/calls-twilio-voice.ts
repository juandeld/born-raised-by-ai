import { TwilioTelephonyProvider } from "@lumen/calls";
import type { TextLocale } from "@lumen/legal";
import { getEngine } from "@/lib/engine";
import { twilioParams, twilioPublicUrl } from "@/lib/twilio";


const xml = (body: string, status = 200) => new Response(body, { status, headers: { "content-type": "text/xml" } });

/**
 * Twilio voice webhook: the call was answered, or a Gather finished (?event=digit | no_input).
 * The prelude state machine lives in the engine; this route only translates Twilio <-> engine events and renders TwiML.
 */
export async function POST(req: Request) {
  const engine = getEngine();
  const tel = engine.deps.telephony;
  if (!(tel instanceof TwilioTelephonyProvider)) return new Response("Not found", { status: 404 });
  const url = new URL(req.url);
  const params = await twilioParams(req);
  if (!tel.validateSignature(twilioPublicUrl(url), params, req.headers.get("x-twilio-signature"))) return new Response("Invalid signature", { status: 403 });
  const callId = url.searchParams.get("call");
  if (!callId) return new Response("Bad request", { status: 400 });
  const call = await engine.deps.db.calls.get(callId);
  const order = call ? await engine.deps.db.orders.get(call.order_id) : null;
  if (!call || !order) return new Response("Not found", { status: 404 });

  const event = tel.parseVoiceWebhook(params, url.searchParams);
  const actions = await engine.controller.handleEvent(callId, event, { providerCallId: params.CallSid });
  return xml(tel.renderTwiml(actions, { callId, locale: order.locale as TextLocale }));
}
