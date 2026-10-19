import type { AgentConfig } from "../guardrails/config";
import type { AgentVariables } from "../guardrails/sanitize";

export interface RegisterCallInput {
  agentId: string;
  from: string;
  to: string;
  variables: AgentVariables;
}

export interface ConnectInfo {
  /** TwiML that bridges the live Twilio call to the agent. Null for non-Twilio transports. */
  twiml: string | null;
  conversationId: string | null;
}

export interface ConversationInfo {
  conversationId: string;
  durationSeconds: number;
  endedBy: "agent" | "user" | "timeout" | "error" | "unknown";
}

/** Voice agent provider (ElevenLabs real, mock). Swap with VOICE_PROVIDER. */
export interface VoiceProvider {
  readonly name: string;
  /** Creates or updates the agent so its config always matches the repository (guardrails as code). Returns the agent id. */
  syncAgent(config: AgentConfig, existingAgentId?: string): Promise<{ agentId: string }>;
  /** Connects a live telephony call to the agent. Must call assertAgentVariables before sending anything out. */
  registerCall(input: RegisterCallInput): Promise<ConnectInfo>;
  /** Metadata only (duration, who ended). Never transcripts. */
  getConversation(conversationId: string): Promise<ConversationInfo | null>;
  /** Looks up the conversation of a Twilio call, when the vendor does not hand the id back at connect time. */
  findConversationByCallSid?(callSid: string): Promise<string | null>;
  /** Deletes audio and transcript at the vendor (A-10), called after delivery. */
  deleteConversation(conversationId: string): Promise<void>;
  /** WebRTC / browser sessions (España "videollamada" option). */
  getSignedUrl?(agentId: string): Promise<string>;
}
