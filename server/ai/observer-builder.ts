export type Visibility = 'public' | 'private';

export interface GameObservation {
  playerId: string;
  visibility: Visibility;
  phase: string;
  alivePlayers: Array<{ id: string; name?: string }>;
  publicEvents: unknown[];
  privateEvents: unknown[];
}

/**
 * Builds the context visible to an AI player.
 * The engine remains the source of truth; this layer only controls information exposure.
 */
export function buildPlayerObservation(input: {
  playerId: string;
  phase: string;
  players: Array<{ id: string; name?: string; alive: boolean }>;
  events: unknown[];
  privateEvents?: unknown[];
}): GameObservation {
  return {
    playerId: input.playerId,
    visibility: 'private',
    phase: input.phase,
    alivePlayers: input.players
      .filter((p) => p.alive)
      .map((p) => ({ id: p.id, name: p.name })),
    publicEvents: input.events,
    privateEvents: input.privateEvents ?? [],
  };
}
