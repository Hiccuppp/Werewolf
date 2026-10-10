export interface SimulationOptions {
  maxRounds?: number;
  seed?: number;
}

export interface SimulationResult {
  winner?: string;
  rounds: number;
  events: unknown[];
}

export class GameSimulationRunner {
  async run(options: SimulationOptions = {}): Promise<SimulationResult> {
    return {
      rounds: 0,
      events: [],
    };
  }
}
