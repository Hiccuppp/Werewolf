import type { LLMProvider } from '../provider';
import type { LLMRequest, LLMResponse } from '../types';

export class OpenAICompatibleProvider implements LLMProvider {
  constructor(private config: {
    apiKey: string;
    baseUrl: string;
    model: string;
  }) {}

  async chat(request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: request.options?.model ?? this.config.model,
        messages: request.messages,
        temperature: request.options?.temperature,
        max_tokens: request.options?.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content ?? '',
      usage: data.usage,
    };
  }
}
