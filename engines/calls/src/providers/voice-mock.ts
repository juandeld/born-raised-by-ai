import { createHash } from "node:crypto";
import type { AgentConfig } from "../guardrails/config";
import { assertAgentVariables } from "../guardrails/sanitize";
import type { ConnectInfo, ConversationInfo, RegisterCallInput, VoiceProvider } from "./voice";

/** Scripted voice agent for tests and development. Records what it was sent so tests can assert guardrail A-05. */
export class MockVoiceProvider implements VoiceProvider {
  readonly name = "mock";
  readonly syncedConfigs: AgentConfig[] = [];
  readonly registered: RegisterCallInput[] = [];
  readonly deleted: string[] = [];
  private conversations = new Map<string, ConversationInfo>();
  private seq = 0;
  /** Seconds the scripted agent talks. */
  agentSeconds = 240;

  async syncAgent(config: AgentConfig, existingAgentId?: string): Promise<{ agentId: string }> {
    this.syncedConfigs.push(config);
    return { agentId: existingAgentId ?? `mock_agent_${createHash("sha1").update(config.name).digest("hex").slice(0, 8)}` };
  }

  async registerCall(input: RegisterCallInput): Promise<ConnectInfo> {
    assertAgentVariables(input.variables as unknown as Record<string, string>);
    this.registered.push(input);
    const conversationId = `mock_conv_${++this.seq}`;
    this.conversations.set(conversationId, { conversationId, durationSeconds: this.agentSeconds, endedBy: "agent" });
    return { twiml: "<Response><Say>[mock agent]</Say></Response>", conversationId };
  }

  async getConversation(conversationId: string): Promise<ConversationInfo | null> {
    return this.conversations.get(conversationId) ?? null;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    this.deleted.push(conversationId);
    this.conversations.delete(conversationId);
  }

  async getSignedUrl(agentId: string): Promise<string> {
    return `mock://signed-url/${agentId}`;
  }
}
