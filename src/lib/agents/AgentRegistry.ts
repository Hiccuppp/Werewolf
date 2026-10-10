import type { AgentRuntime } from './AgentRuntime';

export class AgentRegistry {
  private agents = new Map<number, AgentRuntime>();

  register(playerId: number, agent: AgentRuntime) {
    this.agents.set(playerId, agent);
  }

  get(playerId: number) {
    return this.agents.get(playerId);
  }
}
