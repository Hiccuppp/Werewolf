export interface StoredGameSession<T = unknown> {
  id: string;
  createdAt: number;
  state: T;
  events: unknown[];
}

export class GameSessionStore<T = unknown> {
  private readonly sessions = new Map<string, StoredGameSession<T>>();

  create(id: string, state: T): StoredGameSession<T> {
    const session: StoredGameSession<T> = {
      id,
      createdAt: Date.now(),
      state,
      events: [],
    };

    this.sessions.set(id, session);
    return session;
  }

  get(id: string): StoredGameSession<T> | undefined {
    return this.sessions.get(id);
  }

  appendEvent(id: string, event: unknown): void {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Unknown game session: ${id}`);
    }

    session.events.push(event);
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }
}

export const gameSessionStore = new GameSessionStore();
