import type { PlayerAgent, PlayerAgentContext, AgentDecision } from './types';

export class GameActionController {
  constructor(private readonly agents: Map<string, PlayerAgent>) {}

  async requestAction(
    playerId: string,
    context: PlayerAgentContext,
  ): Promise<AgentDecision> {
    const agent = this.agents.get(playerId);
    if (!agent) {
      return {
        action: 'pass',
        summary: 'agent_missing',
        confidence: 0,
      };
    }

    return agent.decide(context);
  }
}
