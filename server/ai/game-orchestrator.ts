export type GamePhase =
  | "NIGHT"
  | "DAY_DISCUSSION"
  | "VOTE"
  | "FINISHED";

export interface GameOrchestratorState {
  gameId: string;
  phase: GamePhase;
  round: number;
  finished: boolean;
  winner?: "wolf" | "villager";
}

export interface GameOrchestratorDeps {
  startNight: (state: GameOrchestratorState) => Promise<GameOrchestratorState>;
  startDiscussion: (state: GameOrchestratorState) => Promise<GameOrchestratorState>;
  startVote: (state: GameOrchestratorState) => Promise<GameOrchestratorState>;
  checkWin: (state: GameOrchestratorState) => Promise<GameOrchestratorState>;
}

/**
 * Coordinates the autonomous game lifecycle.
 *
 * The orchestrator intentionally does not own role logic or AI reasoning.
 * It only connects phase runtimes into a deterministic loop.
 */
export class GameOrchestrator {
  constructor(private readonly deps: GameOrchestratorDeps) {}

  async run(initial: GameOrchestratorState): Promise<GameOrchestratorState> {
    let state = initial;

    while (!state.finished) {
      state = await this.deps.startNight(state);
      state = await this.deps.checkWin(state);
      if (state.finished) break;

      state = await this.deps.startDiscussion(state);
      state = await this.deps.startVote(state);
      state = await this.deps.checkWin(state);

      if (!state.finished) {
        state = {
          ...state,
          phase: "NIGHT",
          round: state.round + 1,
        };
      }
    }

    return {
      ...state,
      phase: "FINISHED",
    };
  }
}
