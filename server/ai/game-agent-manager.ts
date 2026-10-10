import { PlayerAgent } from './player-agent';
import type { AgentDecision, LLMProvider, PlayerObservation } from './types';

/**
 * Manages one independent agent per seat.
 *
 * Important: agents never share memory. The game engine must provide an
 * already filtered PlayerObservation through ObserverBuilder.
 */
export class GameAgentManager {
  private readonly agents = new Map<number, PlayerAgent>();

  constructor(private readonly providerFactory: (playerId: number) => LLMProvider) {}

  registerPlayer(playerId: number): void {
    if (!this.agents.has(playerId)) {
      this.agents.set(
        playerId,
        new PlayerAgent(playerId, this.providerFactory(playerId)),
      );
    }
  }

  registerPlayers(playerIds: number[]): void {
    for (const playerId of playerIds) {
      this.registerPlayer(playerId);
    }
  }

  async decide(playerId: number, observation: PlayerObservation): Promise<AgentDecision> {
    const agent = this.agents.get(playerId);
    if (!agent) {
      throw new Error(`AI agent not registered: ${playerId}`);
    }

    return agent.decide(observation);
  }
}
