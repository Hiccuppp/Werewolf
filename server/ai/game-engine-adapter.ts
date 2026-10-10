import type { AIGameRunner, AIGameSnapshot } from './ai-game-runner';

export interface EnginePhaseBridge {
  snapshot(): Promise<AIGameSnapshot>;
  applyIntent(intent: unknown): Promise<void>;
}

/**
 * Boundary between autonomous AI orchestration and the rule engine.
 * AI produces intents; the engine remains the only component allowed to mutate game state.
 */
export class AIGameEngineAdapter {
  constructor(
    private readonly runner: AIGameRunner,
    private readonly bridge: EnginePhaseBridge,
  ) {}

  async runDaySpeech() {
    const snapshot = await this.bridge.snapshot();
    const intents = await this.runner.runDaySpeech(snapshot);
    await this.bridge.applyIntent(intents);
    return intents;
  }

  async runVote() {
    const snapshot = await this.bridge.snapshot();
    const intents = await this.runner.runVote(snapshot);
    await this.bridge.applyIntent(intents);
    return intents;
  }

  async runNight() {
    const snapshot = await this.bridge.snapshot();
    const intents = await this.runner.runNight(snapshot);
    await this.bridge.applyIntent(intents);
    return intents;
  }
}
