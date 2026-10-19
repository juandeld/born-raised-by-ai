import { describe, expect, it } from "vitest";
import { buildAgentConfig } from "./guardrails/config";
import { ElevenLabsVoiceProvider, parseBackupLlm } from "./providers/voice-elevenlabs";
import { SANTA } from "@lumen/config";

const cfg = {
  apiKey: "k",
  voiceIds: { "es-419": "voice_es" },
  llm: "claude-haiku-5-5",
  ttsModel: "eleven_v3_conversational",
  stability: 0.6,
  similarityBoost: 0.9,
  speed: 0.95,
  temperature: 0.6,
  maxTokens: 120,
  publicBaseUrl: "https://example.test",
  toolSecret: "s3cret",
  backupLlm: ["claude-sonnet-5-5"] as string[],
  cascadeTimeoutSeconds: 6,
};
const config = buildAgentConfig({ product: SANTA as never, character: "santa", language: "es-419", firstMessage: "Hola {{child_name}}" });

function fakeFetch() {
  const calls: Array<{ url: string; method: string; body: any }> = [];
  const f = (async (url: string, init: any) => {
    const body = init?.body ? JSON.parse(init.body) : null;
    calls.push({ url, method: init?.method ?? "GET", body });
    if (url.includes("/v1/convai/tools?")) return new Response(JSON.stringify({ tools: [{ id: "tool_existing", tool_config: { name: "mark_optout" } }] }), { status: 200 });
    if (url.endsWith("/v1/convai/tools")) return new Response(JSON.stringify({ id: "tool_new" }), { status: 200 });
    if (url.includes("/v1/convai/tools/")) return new Response(JSON.stringify({ id: "tool_existing" }), { status: 200 });
    const m = /agents\/(agent_[a-z]+)$/.exec(url);
    return new Response(JSON.stringify({ agent_id: m ? m[1] : "agent_new" }), { status: 200 });
  }) as unknown as typeof fetch;
  return { f, calls };
}

describe("ElevenLabs syncAgent", () => {
  it("never sends tts or privacy when it updates an existing agent (the voice cannot change)", async () => {
    const { f, calls } = fakeFetch();
    const p = new ElevenLabsVoiceProvider(cfg, f);
    const out = await p.syncAgent(config, "agent_live");
    expect(out.agentId).toBe("agent_live");
    const patch = calls.find((c) => c.method === "PATCH" && c.url.endsWith("/agents/agent_live"))!;
    expect(patch.body.conversation_config.tts).toBeUndefined();
    expect(patch.body.platform_settings).toBeUndefined();
    expect(patch.body.conversation_config.agent.prompt.tools).toBeUndefined();
  });

  it("attaches the webhook tools by id, end_call as built-in, a silence timeout and a same-family backup LLM", async () => {
    const { f, calls } = fakeFetch();
    await new ElevenLabsVoiceProvider(cfg, f).syncAgent(config, "agent_live");
    const patch = calls.find((c) => c.url.endsWith("/agents/agent_live"))!;
    const prompt = patch.body.conversation_config.agent.prompt;
    expect(prompt.tool_ids.sort()).toEqual(["tool_existing", "tool_new"]);
    expect(prompt.built_in_tools.end_call.params.system_tool_type).toBe("end_call");
    expect(prompt.backup_llm_config).toEqual({ preference: "override", order: ["claude-sonnet-5-5"] });
    expect(patch.body.conversation_config.turn.silence_end_call_timeout).toBe(config.silence.closeAfterSeconds);
    expect(patch.body.conversation_config.conversation.max_duration_seconds).toBe(config.maxCallSeconds);
  });

  it("webhook tools identify the call by the platform call sid and carry the secret header; existing tools are patched", async () => {
    const { f, calls } = fakeFetch();
    await new ElevenLabsVoiceProvider(cfg, f).syncAgent(config, "agent_live");
    const optout = calls.find((c) => c.method === "PATCH" && c.url.endsWith("/tools/tool_existing"))!;
    const incident = calls.find((c) => c.method === "POST" && c.url.endsWith("/v1/convai/tools"))!;
    expect(optout.body.tool_config.api_schema.request_headers["x-agent-secret"]).toBe("s3cret");
    expect(incident.body.tool_config.name).toBe("flag_incident");
    const props = incident.body.tool_config.api_schema.request_body_schema.properties;
    expect(props.call_sid.dynamic_variable).toBe("system__call_sid");
    expect(props.incident_type.enum).toContain("seguridad");
    expect(incident.body.tool_config.pre_tool_speech).toBe("off");
    // nothing in the body lets the model choose the call or the order
    expect(JSON.stringify(incident.body)).not.toMatch(/order_id|order/);
  });

  it("creating an agent sends the voice once; creating without a voice id fails", async () => {
    const { f, calls } = fakeFetch();
    await new ElevenLabsVoiceProvider(cfg, f).syncAgent(config);
    const create = calls.find((c) => c.url.endsWith("/agents/create"))!;
    expect(create.body.conversation_config.tts.voice_id).toBe("voice_es");
    await expect(new ElevenLabsVoiceProvider({ ...cfg, voiceIds: {} }, f).syncAgent(config)).rejects.toThrow(/voice id/);
  });

  it("parses the backup LLM env", () => {
    expect(parseBackupLlm(undefined)).toEqual(["claude-sonnet-5-5"]);
    expect(parseBackupLlm("default")).toBe("default");
    expect(parseBackupLlm("disabled")).toBe("disabled");
    expect(parseBackupLlm("a, b")).toEqual(["a", "b"]);
  });
});

describe("findConversationByCallSid (list has no call_sid)", () => {
  it("matches through the conversation detail", async () => {
    
    const calls: string[] = [];
    const fetchFn = (async (url: string) => {
      calls.push(url);
      if (url.includes("/conversations?")) return new Response(JSON.stringify({ conversations: [{ conversation_id: "conv_a" }, { conversation_id: "conv_b" }] }));
      return new Response(JSON.stringify({ metadata: { phone_call: { call_sid: url.endsWith("conv_b") ? "CAx" : "CAy" } } }));
    }) as unknown as typeof fetch;
    const p = new ElevenLabsVoiceProvider(cfg as any, fetchFn);
    expect(await p.findConversationByCallSid("CAx", { agentId: "agent_1", after: new Date(1_000_000) })).toBe("conv_b");
    expect(calls[0]).toContain("agent_id=agent_1");
    expect(calls[0]).toContain("call_start_time_after_unix=");
  });
});
