export type ReasoningMode = "off" | "standard" | "deep";

export interface ProviderRuntimeConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  reasoning?: ReasoningMode;
}

export interface ProviderRequest {
  system: string;
  prompt: string;
  config: ProviderRuntimeConfig;
}

export interface ProviderResponse {
  content: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface LLMProvider {
  complete(request: ProviderRequest): Promise<ProviderResponse>;
}

export class ProviderRuntime {
  constructor(
    private readonly providers: Record<string, LLMProvider>,
    private readonly defaultConfig: ProviderRuntimeConfig,
  ) {}

  async complete(
    request: Omit<ProviderRequest, "config"> & {
      config?: Partial<ProviderRuntimeConfig>;
    },
  ): Promise<ProviderResponse> {
    const config = {
      ...this.defaultConfig,
      ...request.config,
    };

    const provider = this.providers[config.provider];
    if (!provider) {
      throw new Error(`Unsupported provider: ${config.provider}`);
    }

    return provider.complete({
      system: request.system,
      prompt: request.prompt,
      config,
    });
  }
}
