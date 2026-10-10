export type DiscussionOrder = {
  playerId: string;
  seat: number;
};

export type DiscussionContext = {
  gameId: string;
  round: number;
  players: DiscussionOrder[];
};

export type DiscussionTurnResult = {
  playerId: string;
  speech: string;
};

export type DiscussionRuntimeDependencies = {
  runAgentTurn: (input: {
    gameId: string;
    playerId: string;
    phase: 'DAY_DISCUSSION';
  }) => Promise<DiscussionTurnResult>;
};

/**
 * Coordinates daytime public discussion.
 *
 * The runtime intentionally only handles orchestration:
 * - speaking order
 * - collecting public speeches
 * - delegating reasoning to individual agents
 *
 * Agent memory, belief updates and prompt construction stay inside AgentRunner.
 */
export class DayDiscussionRuntime {
  constructor(private readonly deps: DiscussionRuntimeDependencies) {}

  async runDiscussion(context: DiscussionContext): Promise<DiscussionTurnResult[]> {
    const results: DiscussionTurnResult[] = [];

    const orderedPlayers = [...context.players].sort(
      (a, b) => a.seat - b.seat,
    );

    for (const player of orderedPlayers) {
      results.push(
        await this.deps.runAgentTurn({
          gameId: context.gameId,
          playerId: player.playerId,
          phase: 'DAY_DISCUSSION',
        }),
      );
    }

    return results;
  }
}
