/** Outbound messages (receipt, reminder, delivery, refund). Resend real, mock, WhatsApp stub. Swap with EMAIL_PROVIDER. */
export type MessageKind = "receipt" | "reminder" | "delivery" | "delayed" | "refund" | "optout" | "incident" | "ops";

export interface OutboundMessage {
  kind: MessageKind;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SendResult {
  channel: "email" | "whatsapp" | "web";
  status: "sent" | "failed" | "stub";
  provider: string;
  providerId: string | null;
}

export interface DeliveryProvider {
  readonly name: string;
  send(msg: OutboundMessage): Promise<SendResult>;
}

export class MockDeliveryProvider implements DeliveryProvider {
  readonly name = "mock";
  readonly sent: OutboundMessage[] = [];
  async send(msg: OutboundMessage): Promise<SendResult> {
    this.sent.push(msg);
    return { channel: "email", status: "sent", provider: this.name, providerId: `mock_msg_${this.sent.length}` };
  }
}

export class ResendDeliveryProvider implements DeliveryProvider {
  readonly name = "resend";
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  static fromEnv(env: Record<string, string | undefined>): ResendDeliveryProvider {
    if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is required for EMAIL_PROVIDER=resend");
    return new ResendDeliveryProvider(env.RESEND_API_KEY, env.RESEND_FROM ?? "Lumen Labs <hola@lumen-labs.co>");
  }

  async send(msg: OutboundMessage): Promise<SendResult> {
    const res = await this.fetchFn("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from: this.from, to: [msg.to], subject: msg.subject, text: msg.text, ...(msg.html ? { html: msg.html } : {}) }),
    });
    if (!res.ok) return { channel: "email", status: "failed", provider: this.name, providerId: null };
    const j = (await res.json()) as { id?: string };
    return { channel: "email", status: "sent", provider: this.name, providerId: j.id ?? null };
  }
}

/** WhatsApp delivery is a stub: Meta Business verification is not done. It records the intent only. */
export class WhatsAppStubDeliveryProvider implements DeliveryProvider {
  readonly name = "whatsapp-stub";
  readonly intents: OutboundMessage[] = [];
  async send(msg: OutboundMessage): Promise<SendResult> {
    this.intents.push(msg);
    return { channel: "whatsapp", status: "stub", provider: this.name, providerId: null };
  }
}
