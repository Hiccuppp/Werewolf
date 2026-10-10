export interface SimulationResult {
  gameId: string;
  winner: "wolf" | "villager" | "none";
  rounds: number;
  events: unknown[];
}

export interface SimulationContext {
  createGame(): Promise<{ gameId: string }>;
  runGame(gameId: string): Promise<SimulationResult>;
}

/**
 * Coordinates a complete AI-only simulation run.
 * The orchestrator remains responsible for lifecycle execution;
 * this layer only collects and exposes simulation results.
 */
export async function runSimulation(
  context: SimulationContext,
): Promise<SimulationResult> {
  const game = await context.createGame();
  return context.runGame(game.gameId);
}
