import type { LLMProvider } from '../llm/provider';
import { buildPlayerPrompt } from './PromptBuilder';
import type { AgentDecision, PlayerAgentContext } from './types';

export class LLMPlayerAgent {
  constructor(private provider: LLMProvider) {}

  async decide(context: PlayerAgentContext): Promise<AgentDecision> {
    const result = await this.provider.chat({
      messages: [
        {
          role: 'system',
          content: buildPlayerPrompt(context),
        },
      ],
    });

    return {
      action: result.text,
      summary: result.text,
      confidence: 0.5,
    };
  }
}
