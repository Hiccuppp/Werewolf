export interface GamePageState {
  gameId: string;
  phase?: string;
  round?: number;
  players?: unknown[];
}

export interface GamePageControllerOptions {
  loadState: () => Promise<GamePageState>;
  onStateChange: (state: GamePageState) => void;
}

/**
 * Coordinates page-level game state refresh without coupling UI components
 * directly to API implementations.
 */
export function createGamePageController(options: GamePageControllerOptions) {
  let stopped = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  async function refresh() {
    if (stopped) return;

    const state = await options.loadState();
    if (!stopped) {
      options.onStateChange(state);
    }
  }

  return {
    async start(intervalMs = 5000) {
      await refresh();
      timer = setInterval(() => {
        void refresh();
      }, intervalMs);
    },

    stop() {
      stopped = true;
      if (timer) {
        clearInterval(timer);
      }
    },
  };
}
