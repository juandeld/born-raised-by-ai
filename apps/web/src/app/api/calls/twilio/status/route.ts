import { TwilioTelephonyProvider } from "@lumen/calls";
import { getEngine } from "@/lib/engine";
import { twilioParams, twilioPublicUrl } from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Delivery (recording wait, PDF, email) runs inline after the call ends when Inngest is not configured. */
export const maxDuration = 60;

/** Twilio status callback (completed, busy, no-answer, failed): closes the attempt and triggers delivery / retry / refund. */
export async function POST(req: Request) {
  const engine = getEngine();
  const tel = engine.deps.telephony;
  if (!(tel instanceof TwilioTelephonyProvider)) return new Response("Not found", { status: 404 });
  const url = new URL(req.url);
  const params = await twilioParams(req);
  if (!tel.validateSignature(twilioPublicUrl(url), params, req.headers.get("x-twilio-signature"))) return new Response("Invalid signature", { status: 403 });
  const callId = url.searchParams.get("call");
  if (!callId) return new Response("Bad request", { status: 400 });
  const event = tel.parseStatusWebhook(params);
  if (event) await engine.controller.handleEvent(callId, event, { providerCallId: params.CallSid });
  return new Response(null, { status: 204 });
}
