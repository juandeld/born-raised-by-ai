import type { AgentConfig } from "../guardrails/config";
import { assertAgentVariables } from "../guardrails/sanitize";
import type { ConnectInfo, ConversationInfo, RegisterCallInput, VoiceProvider } from "./voice";

/**
 * ElevenLabs Agents adapter (real). Needs ELEVENLABS_API_KEY, a voice id per language (ELEVENLABS_VOICE_ID_<LANG>)
 * and AGENT_TOOL_SECRET + PUBLIC_BASE_URL for the webhook tools. Written from the public API reference; it could not be
 * run without an account, so every field marked [no verificado] in docs/arquitectura/pendientes-cuentas.md must be
 * confirmed on the first real call (H2).
 */
export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl?: string;
  /** Voice id by language key (es-419, es-ES, en). Catalog or designed voice only: never a clone (A-09). */
  voiceIds: Record<string, string>;
  llm: string;
  /** TTS + LLM settings of the live agent. syncAgent resends them so a PATCH never changes the voice. */
  ttsModel: string;
  stability: number;
  similarityBoost: number;
  speed: number;
  temperature: number;
  maxTokens: number;
  publicBaseUrl: string;
  toolSecret: string;
}

export class ElevenLabsVoiceProvider implements VoiceProvider {
  readonly name = "elevenlabs";
  private readonly base: string;

  constructor(private readonly cfg: ElevenLabsConfig, private readonly fetchFn: typeof fetch = fetch) {
    this.base = cfg.baseUrl ?? "https://api.elevenlabs.io";
  }

  static fromEnv(env: Record<string, string | undefined>): ElevenLabsVoiceProvider {
    if (!env.ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is required for VOICE_PROVIDER=elevenlabs");
    return new ElevenLabsVoiceProvider({
      apiKey: env.ELEVENLABS_API_KEY,
      voiceIds: {
        "es-419": env.ELEVENLABS_VOICE_ID_ES_419 ?? "",
        "es-ES": env.ELEVENLABS_VOICE_ID_ES_ES ?? env.ELEVENLABS_VOICE_ID_ES_419 ?? "",
        en: env.ELEVENLABS_VOICE_ID_EN ?? "",
      },
      llm: env.ELEVENLABS_LLM ?? "claude-haiku-5-5",
      ttsModel: env.ELEVENLABS_TTS_MODEL ?? "eleven_v3_conversational",
      stability: Number(env.ELEVENLABS_TTS_STABILITY ?? 0.6),
      similarityBoost: Number(env.ELEVENLABS_TTS_SIMILARITY ?? 0.9),
      speed: Number(env.ELEVENLABS_TTS_SPEED ?? 0.95),
      temperature: Number(env.ELEVENLABS_LLM_TEMPERATURE ?? 0.6),
      maxTokens: Number(env.ELEVENLABS_LLM_MAX_TOKENS ?? 120),
      publicBaseUrl: env.PUBLIC_BASE_URL ?? "http://localhost:3000",
      toolSecret: env.AGENT_TOOL_SECRET ?? "",
    });
  }

  private headers(): Record<string, string> {
    return { "xi-api-key": this.cfg.apiKey, "content-type": "application/json" };
  }

  private toolDefs(config: AgentConfig) {
    const hook = (name: string, description: string, properties: Record<string, unknown>) => ({
      type: "webhook",
      name,
      description,
      api_schema: {
        url: `${this.cfg.publicBaseUrl}/api/calls/tools/${name}`,
        method: "POST",
        request_headers: { "x-agent-secret": this.cfg.toolSecret },
        // The call is identified by the Twilio call sid that the platform provides, never by the order id (A-05).
        request_body_schema: { type: "object", properties: { call_sid: { type: "string", dynamic_variable: "system__call_sid" }, ...properties } },
      },
    });
    return config.tools.map((t) => {
      if (t === "end_call") return { type: "system", name: "end_call", description: "End the call after the closing phrase." };
      if (t === "mark_optout") return hook("mark_optout", "Register that the person does not want more calls to this number.", {});
      return hook("flag_incident", "Register a safety or conduct incident. No content, only the type.", {
        incident_type: { type: "string", enum: ["seguridad", "maltrato", "autolesion", "datos", "contenido", "abuso", "contacto", "fallo_tecnico", "confusion"] },
      });
    });
  }

  async syncAgent(config: AgentConfig, existingAgentId?: string): Promise<{ agentId: string }> {
    const voiceId = this.cfg.voiceIds[config.language];
    if (!voiceId) throw new Error(`No ElevenLabs voice id configured for ${config.language}`);
    const body = {
      name: config.name,
      conversation_config: {
        agent: {
          first_message: config.firstMessage,
          language: config.language.startsWith("es") ? "es" : "en",
          prompt: { prompt: config.prompt, llm: this.cfg.llm, temperature: this.cfg.temperature, max_tokens: this.cfg.maxTokens, tools: this.toolDefs(config) },
        },
        tts: { voice_id: voiceId, model_id: this.cfg.ttsModel, stability: this.cfg.stability, similarity_boost: this.cfg.similarityBoost, speed: this.cfg.speed },
        conversation: { max_duration_seconds: config.maxCallSeconds },
        turn: { silence_end_call_timeout: config.silence.closeAfterSeconds },
      },
      platform_settings: {
        // [no verificado] exact option names; zero retention and no training must be confirmed with ElevenLabs (H0).
        privacy: { zero_retention_mode: config.dataHandling.zeroRetention, record_voice: false },
        guardrails: { enabled: config.moderation.enabled },
      },
    };
    const url = existingAgentId ? `${this.base}/v1/convai/agents/${existingAgentId}` : `${this.base}/v1/convai/agents/create`;
    const res = await this.fetchFn(url, { method: existingAgentId ? "PATCH" : "POST", headers: this.headers(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`ElevenLabs syncAgent ${res.status}: ${await res.text()}`);
    const j = (await res.json()) as { agent_id?: string };
    return { agentId: j.agent_id ?? existingAgentId ?? "" };
  }

  async registerCall(input: RegisterCallInput): Promise<ConnectInfo> {
    assertAgentVariables(input.variables as unknown as Record<string, string>);
    const res = await this.fetchFn(`${this.base}/v1/convai/twilio/register-call`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        agent_id: input.agentId,
        from_number: input.from,
        to_number: input.to,
        direction: "outbound",
        conversation_initiation_client_data: { dynamic_variables: input.variables },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs registerCall ${res.status}: ${await res.text()}`);
    // The endpoint answers with TwiML (<Connect><Stream>) to hand to Twilio.
    return { twiml: await res.text(), conversationId: null };
  }

  async findConversationByCallSid(callSid: string): Promise<string | null> {
    const res = await this.fetchFn(`${this.base}/v1/convai/conversations?page_size=30`, { headers: this.headers() });
    if (!res.ok) return null;
    const j = (await res.json()) as { conversations?: Array<{ conversation_id: string; call_sid?: string; metadata?: { phone_call?: { call_sid?: string } } }> };
    const hit = j.conversations?.find((c) => c.call_sid === callSid || c.metadata?.phone_call?.call_sid === callSid);
    return hit?.conversation_id ?? null;
  }

  async getConversation(conversationId: string): Promise<ConversationInfo | null> {
    const res = await this.fetchFn(`${this.base}/v1/convai/conversations/${conversationId}`, { headers: this.headers() });
    if (!res.ok) return null;
    const j = (await res.json()) as { metadata?: { call_duration_secs?: number; termination_reason?: string } };
    const reason = j.metadata?.termination_reason ?? "";
    return {
      conversationId,
      durationSeconds: j.metadata?.call_duration_secs ?? 0,
      endedBy: reason.includes("agent") ? "agent" : reason.includes("user") ? "user" : reason.includes("timeout") ? "timeout" : "unknown",
    };
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const res = await this.fetchFn(`${this.base}/v1/convai/conversations/${conversationId}`, { method: "DELETE", headers: this.headers() });
    if (!res.ok && res.status !== 404) throw new Error(`ElevenLabs deleteConversation ${res.status}`);
  }

  async getSignedUrl(agentId: string): Promise<string> {
    const res = await this.fetchFn(`${this.base}/v1/convai/conversation/get-signed-url?agent_id=${agentId}`, { headers: this.headers() });
    if (!res.ok) throw new Error(`ElevenLabs getSignedUrl ${res.status}`);
    return ((await res.json()) as { signed_url: string }).signed_url;
  }
}
