import type { PlayerAgent, PlayerAgentContext, AgentDecision } from './types';

/**
 * Bridge between GameFlow and PlayerAgent.
 * Engine owns legality; agents only suggest actions.
 */
export class GameActionController {
  constructor(private readonly agents: Map<string, PlayerAgent>) {}

  async requestAction(
    playerId: string,
    context: PlayerAgentContext,
  ): Promise<AgentDecision> {
    const agent = this.agents.get(playerId);
    if (!agent) {
      return { action: 'pass', summary: 'agent_missing' };
    }

    return agent.decide(context);
  }
}
