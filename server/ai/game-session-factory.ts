import type { AIGameEngineAdapter } from './game-engine-adapter';

export interface AISessionConfig {
  playerCount: number;
  boardId: string;
}

export interface AISessionContext {
  adapter: AIGameEngineAdapter;
  config: AISessionConfig;
}

/**
 * Bootstrap boundary for creating autonomous AI games.
 *
 * Player creation, role assignment and provider wiring will be injected here.
 * The factory intentionally does not own game rules.
 */
export class AIGameSessionFactory {
  create(config: AISessionConfig, adapter: AIGameEngineAdapter): AISessionContext {
    return {
      config,
      adapter,
    };
  }
}

export { AIGameSessionFactory as GameSessionFactory };
