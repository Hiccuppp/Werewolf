export interface AgentRuntime {
  playerId: string;
  runTurn(input: unknown): Promise<unknown>;
}

export interface AgentRuntimeRegistry {
  getAgent(playerId: string): AgentRuntime | undefined;
}

export interface MultiAgentRuntime {
  runPlayerTurn(playerId: string, input: unknown): Promise<unknown>;
  runAllTurns(playerIds: string[], inputFactory: (playerId: string) => unknown): Promise<unknown[]>;
}

export function createMultiAgentRuntime(
  registry: AgentRuntimeRegistry,
): MultiAgentRuntime {
  return {
    async runPlayerTurn(playerId, input) {
      const agent = registry.getAgent(playerId);

      if (!agent) {
        throw new Error(`Agent not found: ${playerId}`);
      }

      return agent.runTurn(input);
    },

    async runAllTurns(playerIds, inputFactory) {
      const results = [];

      for (const playerId of playerIds) {
        results.push(
          await this.runPlayerTurn(playerId, inputFactory(playerId)),
        );
      }

      return results;
    },
  };
}
