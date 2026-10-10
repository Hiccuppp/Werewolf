import type { LLMProvider, ProviderRequest, ProviderResponse } from "../provider-runtime";

/**
 * DeepSeek-compatible adapter.
 *
 * Kept separate from OpenAIProvider because runtime configuration and future
 * reasoning controls may differ even when transport is OpenAI-compatible.
 */
export class DeepSeekProvider implements LLMProvider {
  constructor(
    private readonly client: {
      complete(input: {
        system: string;
        prompt: string;
        model: string;
        temperature?: number;
        maxTokens?: number;
        reasoning?: string;
      }): Promise<ProviderResponse>;
    },
  ) {}

  complete(request: ProviderRequest): Promise<ProviderResponse> {
    return this.client.complete({
      system: request.system,
      prompt: request.prompt,
      model: request.config.model,
      temperature: request.config.temperature,
      maxTokens: request.config.maxTokens,
      reasoning: request.config.reasoning,
    });
  }
}
