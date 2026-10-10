export interface GameStateSnapshot {
  gameId: string;
  phase?: string;
  round?: number;
  players?: Array<{
    id: string;
    alive: boolean;
  }>;
}

export type StateListener = (state: GameStateSnapshot) => void;

/**
 * Minimal client-side state synchronizer.
 * Keeps polling/refresh logic out of view components.
 */
export class GameStateSync {
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(
    private readonly gameId: string,
    private readonly fetcher: (gameId: string) => Promise<GameStateSnapshot>,
  ) {}

  start(listener: StateListener, intervalMs = 3000) {
    const update = async () => {
      const state = await this.fetcher(this.gameId);
      listener(state);
    };

    void update();
    this.timer = setInterval(() => void update(), intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
