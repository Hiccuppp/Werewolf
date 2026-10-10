import type { AIGameRunner } from './ai-game-runner';
import type { AIGameSnapshot } from './ai-game-runner';

export interface AutonomousGameHooks {
  onSpeeches?: (speeches: unknown) => Promise<void>;
  onVotes?: (votes: unknown) => Promise<void>;
  onNightActions?: (actions: unknown) => Promise<void>;
}

/**
 * Coordinates AI intentions for a full turn.
 * This class intentionally does not mutate game state; the engine remains the
 * only authority for resolving votes, deaths and skills.
 */
export class AutonomousGameSession {
  constructor(
    private readonly runner: AIGameRunner,
    private readonly hooks: AutonomousGameHooks = {},
  ) {}

  async runDay(snapshot: AIGameSnapshot) {
    const speeches = await this.runner.runDaySpeech(snapshot);
    await this.hooks.onSpeeches?.(speeches);

    const votes = await this.runner.runVote(snapshot);
    await this.hooks.onVotes?.(votes);

    return { speeches, votes };
  }

  async runNight(snapshot: AIGameSnapshot) {
    const actions = await this.runner.runNight(snapshot);
    await this.hooks.onNightActions?.(actions);

    return actions;
  }
}
