import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { TwilioTelephonyProvider, xmlEscape } from "./providers/telephony-twilio";

const tw = new TwilioTelephonyProvider({ accountSid: "ACxxx", authToken: "token", publicBaseUrl: "https://lumen-labs.co" });

describe("Twilio adapter", () => {
  it("validates X-Twilio-Signature", () => {
    const url = "https://lumen-labs.co/api/calls/twilio/voice?call=c1";
    const params = { CallSid: "CA1", AnsweredBy: "human" };
    const sig = createHmac("sha1", "token").update(url + "AnsweredByhumanCallSidCA1").digest("base64");
    expect(tw.validateSignature(url, params, sig)).toBe(true);
    expect(tw.validateSignature(url, { ...params, AnsweredBy: "machine_start" }, sig)).toBe(false);
    expect(tw.validateSignature(url, params, null)).toBe(false);
  });

  it("maps webhooks to events", () => {
    expect(tw.parseVoiceWebhook({ AnsweredBy: "machine_end_beep" }, new URLSearchParams())).toEqual({ type: "answered", answeredBy: "machine" });
    expect(tw.parseVoiceWebhook({ AnsweredBy: "human" }, new URLSearchParams())).toEqual({ type: "answered", answeredBy: "human" });
    expect(tw.parseVoiceWebhook({ Digits: "1" }, new URLSearchParams("event=digit"))).toEqual({ type: "digit", digit: "1" });
    expect(tw.parseVoiceWebhook({}, new URLSearchParams("event=no_input"))).toEqual({ type: "no_input" });
    expect(tw.parseStatusWebhook({ CallStatus: "completed", CallDuration: "61" })).toEqual({ type: "ended", telephonySeconds: 61 });
    expect(tw.parseStatusWebhook({ CallStatus: "no-answer" })).toEqual({ type: "no_answer" });
    expect(tw.parseStatusWebhook({ CallStatus: "ringing" })).toBeNull();
  });

  it("renders the prelude as TwiML: say outside gather (not interruptible), DTMF only, redirect on silence", () => {
    const xml = tw.renderTwiml([{ type: "say", text: "Hola <Leo> & familia" }, { type: "gather", timeoutSeconds: 8 }], { callId: "c1", locale: "es-ES" });
    expect(xml).toContain('<Say language="es-ES"');
    expect(xml).toContain("Hola &lt;Leo&gt; &amp; familia");
    expect(xml).toContain('<Gather input="dtmf" numDigits="1" timeout="8"');
    expect(xml.indexOf("<Say")).toBeLessThan(xml.indexOf("<Gather"));
    expect(xml).toContain("event=no_input");
    expect(xml).not.toContain("speech");
    expect(xmlEscape(`a"b'c`)).toBe("a&quot;b&apos;c");
  });

  it("connect_agent returns the vendor TwiML verbatim", () => {
    const xml = tw.renderTwiml([{ type: "connect_agent", twiml: "<Response><Connect/></Response>", conversationId: null }], { callId: "c1", locale: "en-US" });
    expect(xml).toBe("<Response><Connect/></Response>");
  });
});
