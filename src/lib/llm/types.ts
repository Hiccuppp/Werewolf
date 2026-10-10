export interface LLMChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  thinkingEnabled?: boolean;
  reasoningEffort?: 'low' | 'medium' | 'high';
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  options?: LLMChatOptions;
}

export interface LLMResponse {
  text: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}
