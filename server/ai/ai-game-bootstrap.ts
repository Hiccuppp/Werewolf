import { AutonomousGameLoop } from './autonomous-game-loop';
import { GameSessionFactory } from './game-session-factory';
import type { AIGameEngineAdapter } from './game-engine-adapter';

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
  constructor(private readonly factory: GameSessionFactory) {}

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
