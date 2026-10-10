export interface VoteCandidate {
  playerId: string;
  alive: boolean;
}

export interface VoteDecision {
  voterId: string;
  targetId: string;
  reason?: string;
}

export interface VoteResult {
  votes: Record<string, number>;
  eliminatedPlayerId?: string;
}

/**
 * Resolves the public voting phase.
 *
 * AI decision generation stays outside this boundary. This module only
 * aggregates decisions and applies elimination rules.
 */
export class VoteRuntime {
  resolve(
    players: VoteCandidate[],
    decisions: VoteDecision[],
  ): VoteResult {
    const alive = new Set(
      players.filter((player) => player.alive).map((player) => player.playerId),
    );

    const votes: Record<string, number> = {};

    for (const decision of decisions) {
      if (!alive.has(decision.voterId)) continue;
      if (!alive.has(decision.targetId)) continue;

      votes[decision.targetId] = (votes[decision.targetId] ?? 0) + 1;
    }

    const eliminatedPlayerId = Object.entries(votes).reduce<string | undefined>(
      (current, [playerId, count]) => {
        if (!current) return playerId;
        return count > (votes[current] ?? 0) ? playerId : current;
      },
      undefined,
    );

    return {
      votes,
      eliminatedPlayerId,
    };
  }
}
