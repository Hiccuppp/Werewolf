export type AIPhase =
  | 'DAY_SPEECH'
  | 'FREE_DISCUSSION'
  | 'VOTE'
  | 'NIGHT_ACTION';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  thinking?: boolean;
  reasoningEffort?: 'low' | 'medium' | 'high';
}

export interface LLMProvider {
  chat(messages: LLMMessage[], options?: LLMOptions): Promise<string>;
}

export interface PlayerObservation {
  playerId: number;
  phase: AIPhase;
  publicEvents: unknown[];
  privateEvents: unknown[];
  selfRole?: string;
}

export interface AgentDecision {
  action: string;
  target?: number;
  confidence?: number;
  summary?: string[];
}
