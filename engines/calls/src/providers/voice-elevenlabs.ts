import { INCIDENT_TYPES, type AgentConfig } from "../guardrails/config";
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
  /**
   * Backup LLMs, in order. "default" lets the vendor choose (it was seen cascading to gemini and gpt-4o on a children's call),
   * "disabled" turns the cascade off. Default here is the same family as the main model.
   */
  backupLlm: "default" | "disabled" | string[];
  cascadeTimeoutSeconds: number;
  /**
   * Native hang-up on silence (seconds since the user last spoke; -1 disables). Default: config.silence.closeAfterSeconds (15, D16).
   * D17 proposes -1 with the agent counting the silences itself, because the native timer also runs while the agent speaks and cuts the goodbye.
   */
  silenceEndCallTimeoutSeconds?: number;
  /** Seconds of user silence before the agent speaks again ("¿Sigues ahí?"). The live agent uses 5. Not sent when unset. */
  turnTimeoutSeconds?: number;
}

export function parseBackupLlm(raw: string | undefined): "default" | "disabled" | string[] {
  const v = (raw ?? "default").trim();
  if (v === "default" || v === "disabled") return v;
  return v.split(",").map((x) => x.trim()).filter(Boolean);
}

type ToolBody = { tool_config: Record<string, unknown> };

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
        "en-US": env.ELEVENLABS_VOICE_ID_EN_US ?? env.ELEVENLABS_VOICE_ID_EN ?? "",
        "en-GB": env.ELEVENLABS_VOICE_ID_EN_GB ?? env.ELEVENLABS_VOICE_ID_EN_US ?? env.ELEVENLABS_VOICE_ID_EN ?? "",
      },
      llm: env.ELEVENLABS_LLM ?? "gemini-2.5-flash",
      ttsModel: env.ELEVENLABS_TTS_MODEL ?? "eleven_v3_conversational",
      stability: Number(env.ELEVENLABS_TTS_STABILITY ?? 0.6),
      similarityBoost: Number(env.ELEVENLABS_TTS_SIMILARITY ?? 0.9),
      speed: Number(env.ELEVENLABS_TTS_SPEED ?? 0.95),
      temperature: Number(env.ELEVENLABS_LLM_TEMPERATURE ?? 0.6),
      maxTokens: Number(env.ELEVENLABS_LLM_MAX_TOKENS ?? 400),
      publicBaseUrl: env.PUBLIC_BASE_URL ?? "http://localhost:3000",
      toolSecret: env.AGENT_TOOL_SECRET ?? "",
      backupLlm: parseBackupLlm(env.ELEVENLABS_BACKUP_LLM),
      cascadeTimeoutSeconds: Number(env.ELEVENLABS_CASCADE_TIMEOUT ?? 4),
      silenceEndCallTimeoutSeconds: env.ELEVENLABS_SILENCE_END_CALL_TIMEOUT ? Number(env.ELEVENLABS_SILENCE_END_CALL_TIMEOUT) : undefined,
      turnTimeoutSeconds: env.ELEVENLABS_TURN_TIMEOUT ? Number(env.ELEVENLABS_TURN_TIMEOUT) : undefined,
    });
  }

  private headers(): Record<string, string> {
    return { "xi-api-key": this.cfg.apiKey, "content-type": "application/json" };
  }

  /**
   * Workspace tool definitions (POST /v1/convai/tools). The inline `tools` field of the agent is deprecated: tools are
   * created once as workspace objects and attached to the agent by id (`prompt.tool_ids`). The call is identified by the
   * Twilio call sid that the platform provides (system__call_sid), never by the order id (A-05).
   */
  toolBodies(config: AgentConfig): Record<string, ToolBody> {
    const hook = (name: string, description: string, properties: Record<string, unknown>, required: string[] = []): ToolBody => ({
      tool_config: {
        type: "webhook",
        name,
        description,
        response_timeout_secs: 10,
        // The character never narrates a bookkeeping call to the child.
        pre_tool_speech: "off",
        tool_error_handling_mode: "hide",
        api_schema: {
          url: `${this.cfg.publicBaseUrl}/api/calls/tools/${name}`,
          method: "POST",
          request_headers: { "x-agent-secret": this.cfg.toolSecret },
          request_body_schema: {
            type: "object",
            properties: { call_sid: { type: "string", dynamic_variable: "system__call_sid" }, ...properties },
            required: ["call_sid", ...required],
          },
        },
      },
    });
    const out: Record<string, ToolBody> = {};
    for (const t of config.tools) {
      if (t === "end_call") continue; // built-in system tool, see builtInTools()
      if (t === "mark_optout") out[t] = hook(t, "Registra que la persona adulta no quiere más llamadas a este número. Solo si lo pide con claridad. Nunca lo menciones en voz alta.", {});
      else if (t === "flag_incident") {
        out[t] = hook(
          t,
          "Registra un incidente de seguridad o conducta. Solo el tipo, nunca contenido. Nunca lo menciones en voz alta.",
          { incident_type: { type: "string", description: "Tipo de incidente.", enum: [...INCIDENT_TYPES] } },
          ["incident_type"],
        );
      }
    }
    return out;
  }

  builtInTools(config: AgentConfig): Record<string, unknown> {
    if (!config.tools.includes("end_call")) return {};
    return {
      end_call: {
        type: "system",
        name: "end_call",
        description: "Termina la llamada. Úsala solo después de decir la despedida (frase fija D-02 o la despedida amable). Nunca nombres la herramienta en voz alta.",
        params: { system_tool_type: "end_call" },
      },
    };
  }

  private backupLlmConfig(): Record<string, unknown> {
    const b = this.cfg.backupLlm;
    if (b === "default" || b === "disabled") return { preference: b };
    return { preference: "override", order: b };
  }

  /** Creates or updates one workspace tool by name; returns its id. */
  private async upsertTool(name: string, body: ToolBody): Promise<string> {
    const list = await this.fetchFn(`${this.base}/v1/convai/tools?search=${encodeURIComponent(name)}&page_size=100`, { headers: this.headers() });
    if (!list.ok) throw new Error(`ElevenLabs list tools ${list.status}: ${await list.text()}`);
    const j = (await list.json()) as { tools?: Array<{ id: string; tool_config?: { name?: string } }> };
    const hit = j.tools?.find((t) => t.tool_config?.name === name);
    const res = await this.fetchFn(hit ? `${this.base}/v1/convai/tools/${hit.id}` : `${this.base}/v1/convai/tools`, {
      method: hit ? "PATCH" : "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`ElevenLabs upsert tool ${name} ${res.status}: ${await res.text()}`);
    const r = (await res.json()) as { id?: string };
    const id = r.id ?? hit?.id;
    if (!id) throw new Error(`ElevenLabs upsert tool ${name}: no id in the response`);
    return id;
  }

  /** The agent PATCH/POST body. Pure, so it can be tested. `toolIds` are the ids returned by the tool upserts. */
  agentBody(config: AgentConfig, toolIds: string[], create: { voiceId: string } | null): Record<string, unknown> {
    const conversation_config: Record<string, any> = {
      agent: {
        first_message: config.firstMessage,
        language: config.language.startsWith("es") ? "es" : "en",
        prompt: {
          prompt: config.prompt,
          llm: this.cfg.llm,
          temperature: this.cfg.temperature,
          max_tokens: this.cfg.maxTokens,
          tool_ids: toolIds,
          built_in_tools: this.builtInTools(config),
          backup_llm_config: this.backupLlmConfig(),
          cascade_timeout_seconds: this.cfg.cascadeTimeoutSeconds,
        },
      },
      conversation: { max_duration_seconds: config.maxCallSeconds },
      // Without this a stuck call ran to the 600 s cap (seen on the first real call, 18-oct-2026).
      turn: {
        silence_end_call_timeout: this.cfg.silenceEndCallTimeoutSeconds ?? config.silence.closeAfterSeconds,
        ...(this.cfg.turnTimeoutSeconds !== undefined ? { turn_timeout: this.cfg.turnTimeoutSeconds } : {}),
      },
    };
    // The voice is sent ONLY when the agent is created. An update never touches tts, so a PATCH can never change the voice.
    if (create) {
      conversation_config.tts = {
        voice_id: create.voiceId,
        model_id: this.cfg.ttsModel,
        stability: this.cfg.stability,
        similarity_boost: this.cfg.similarityBoost,
        speed: this.cfg.speed,
        agent_output_audio_format: "ulaw_8000",
      };
    }
    // Privacy and guardrail settings are not sent: the live account owns them (zero retention and the content
    // guardrails are configured per agent in the vendor, see docs/arquitectura/agentes-elevenlabs.md).
    return create ? { name: config.name, conversation_config } : { conversation_config };
  }

  async syncAgent(config: AgentConfig, existingAgentId?: string): Promise<{ agentId: string }> {
    const voiceId = this.cfg.voiceIds[config.locale] || this.cfg.voiceIds[config.language] || "";
    if (!existingAgentId && !voiceId) throw new Error(`No ElevenLabs voice id configured for ${config.locale} (needed to create the agent)`);
    const toolIds: string[] = [];
    for (const [name, body] of Object.entries(this.toolBodies(config))) toolIds.push(await this.upsertTool(name, body));
    const body = this.agentBody(config, toolIds, existingAgentId ? null : { voiceId });
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
    const twiml = await res.text();
    // If the TwiML carries the conversation id as a stream <Parameter>, keep it; otherwise the post-call looks it up by call_sid.
    const m = /<Parameter[^>]*name="conversation_id"[^>]*value="([^"]+)"/i.exec(twiml) ?? /<Parameter[^>]*value="([^"]+)"[^>]*name="conversation_id"/i.exec(twiml);
    return { twiml, conversationId: m?.[1] ?? null };
  }

  async findConversationByCallSid(callSid: string, opts: { agentId?: string; after?: Date } = {}): Promise<string | null> {
    // The list endpoint does NOT carry call_sid (seen on the real call of 19-oct-2026); only the detail has metadata.phone_call.call_sid.
    // So: list the recent conversations of the agent (narrow time window), then read each detail, newest first, until one matches.
    const q = new URLSearchParams({ page_size: "15" });
    if (opts.agentId) q.set("agent_id", opts.agentId);
    if (opts.after) q.set("call_start_time_after_unix", String(Math.floor(opts.after.getTime() / 1000) - 120));
    const res = await this.fetchFn(`${this.base}/v1/convai/conversations?${q}`, { headers: this.headers() });
    if (!res.ok) return null;
    const j = (await res.json()) as { conversations?: Array<{ conversation_id: string; call_sid?: string; metadata?: { phone_call?: { call_sid?: string } } }> };
    const list = j.conversations ?? [];
    const direct = list.find((c) => c.call_sid === callSid || c.metadata?.phone_call?.call_sid === callSid);
    if (direct) return direct.conversation_id;
    for (const c of list.slice(0, 10)) {
      const d = await this.fetchFn(`${this.base}/v1/convai/conversations/${c.conversation_id}`, { headers: this.headers() });
      if (!d.ok) continue;
      const dj = (await d.json()) as { metadata?: { phone_call?: { call_sid?: string } } };
      if (dj.metadata?.phone_call?.call_sid === callSid) return c.conversation_id;
    }
    return null;
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
