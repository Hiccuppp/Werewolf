import { AutonomousGameLoop } from './autonomous-game-loop.ts';
import { GameSessionFactory } from './game-session-factory.ts';
import type { AIGameEngineAdapter } from './game-engine-adapter.ts';

export interface AIGameBootstrapConfig {
  boardId: string;
  playerCount: number;
  maxRounds?: number;
  adapter?: AIGameEngineAdapter;
}

export interface AIGameBootstrapResult {
  id: string;
  boardId: string;
  playerCount: number;
  session: unknown;
}

export class AIGameBootstrap {
  private readonly factory: GameSessionFactory;

  constructor(factory: GameSessionFactory) {
    this.factory = factory;
  }

  create(config: AIGameBootstrapConfig): AIGameBootstrapResult {
    const session = this.factory.create(
      {
        boardId: config.boardId,
        playerCount: config.playerCount,
      },
      config.adapter as AIGameEngineAdapter,
    );

    return {
      id: config.boardId,
      boardId: config.boardId,
      playerCount: config.playerCount,
      session,
    };
  }
}

export function createAIGameLoop(loop: AutonomousGameLoop) {
  return { run: () => loop.run() };
}
