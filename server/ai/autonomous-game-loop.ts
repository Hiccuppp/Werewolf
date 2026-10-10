import type { AIGameEngineAdapter } from './game-engine-adapter';

export interface AutonomousLoopOptions {
  maxRounds?: number;
  stopWhenFinished?: () => boolean;
}

/**
 * Coordinates AI turns without embedding game rules.
 * The rule engine remains responsible for phase transitions and victory checks.
 */
export class AutonomousGameLoop {
  constructor(private readonly adapter: AIGameEngineAdapter) {}

  async run(options: AutonomousLoopOptions = {}) {
    const maxRounds = options.maxRounds ?? 100;
    const results = [];

    for (let round = 0; round < maxRounds; round += 1) {
      if (options.stopWhenFinished?.()) break;

      results.push(await this.adapter.runNight());
      if (options.stopWhenFinished?.()) break;

      results.push(await this.adapter.runDaySpeech());
      if (options.stopWhenFinished?.()) break;

      results.push(await this.adapter.runVote());
    }

    return results;
  }
}
