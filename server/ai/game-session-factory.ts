import type { AIGameEngineAdapter } from './game-engine-adapter';

export interface AISessionConfig {
  playerCount: number;
  boardId: string;
}

export interface AISessionContext {
  adapter?: AIGameEngineAdapter;
  config: AISessionConfig;
}

export class AIGameSessionFactory {
  create(config: AISessionConfig, adapter?: AIGameEngineAdapter): AISessionContext {
    return { config, adapter };
  }
}

export { AIGameSessionFactory as GameSessionFactory };
