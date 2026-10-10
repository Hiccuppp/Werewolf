export interface PublicGameEvent {
  type: string;
  playerId?: string;
  content?: string;
  timestamp: number;
}

export interface PublicBlackboardState {
  gameId: string;
  events: PublicGameEvent[];
}

/**
 * Shared information visible to every AI player.
 *
 * This intentionally does not contain:
 * - role identity
 * - private night actions
 * - private belief state
 * - hidden reasoning
 */
export class PublicBlackboard {
  private readonly games = new Map<string, PublicBlackboardState>();

  create(gameId: string): PublicBlackboardState {
    const state: PublicBlackboardState = {
      gameId,
      events: [],
    };

    this.games.set(gameId, state);
    return state;
  }

  get(gameId: string): PublicBlackboardState | undefined {
    return this.games.get(gameId);
  }

  append(gameId: string, event: Omit<PublicGameEvent, 'timestamp'>): void {
    const state = this.games.get(gameId) ?? this.create(gameId);

    state.events.push({
      ...event,
      timestamp: Date.now(),
    });
  }

  snapshot(gameId: string): PublicGameEvent[] {
    return [...(this.games.get(gameId)?.events ?? [])];
  }
}

export const publicBlackboard = new PublicBlackboard();
