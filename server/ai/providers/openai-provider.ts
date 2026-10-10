import type { LLMProvider, ProviderRequest, ProviderResponse } from "../provider-runtime";

/**
 * OpenAI-compatible provider adapter.
 *
 * The actual HTTP client is injected so the AI layer does not depend on a
 * specific SDK. This keeps model vendors interchangeable.
 */
export class OpenAIProvider implements LLMProvider {
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
