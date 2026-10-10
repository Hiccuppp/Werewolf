import type { LLMRequest, LLMResponse } from './types';

export interface LLMProvider {
  chat(request: LLMRequest): Promise<LLMResponse>;
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}
