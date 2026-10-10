export type GameEvent = {
  id: string;
  type: string;
  payload: unknown;
  createdAt: number;
};

export type GameEventListener = (event: GameEvent) => void;

export class GameEventStream {
  private readonly events = new Map<string, GameEvent[]>();
  private readonly listeners = new Map<string, Set<GameEventListener>>();

  publish(gameId: string, event: GameEvent): void {
    const history = this.events.get(gameId) ?? [];
    history.push(event);
    this.events.set(gameId, history);

    for (const listener of this.listeners.get(gameId) ?? []) {
      listener(event);
    }
  }

  replay(gameId: string): GameEvent[] {
    return [...(this.events.get(gameId) ?? [])];
  }

  subscribe(gameId: string, listener: GameEventListener): () => void {
    const listeners = this.listeners.get(gameId) ?? new Set<GameEventListener>();
    listeners.add(listener);
    this.listeners.set(gameId, listeners);

    return () => {
      listeners.delete(listener);
    };
  }
}

export const gameEventStream = new GameEventStream();

export function subscribeGameEvents(gameId: string, listener: GameEventListener): () => void {
  return gameEventStream.subscribe(gameId, listener);
}
