import { AutonomousGameLoop } from './autonomous-game-loop';
import { GameSessionFactory } from './game-session-factory';

export interface AIGameBootstrapConfig {
  boardId: string;
  playerCount: number;
  maxRounds?: number;
}

export interface AIGameBootstrapResult {
  boardId: string;
  playerCount: number;
  session: unknown;
}

/**
 * Creates the runtime boundary for an autonomous AI match.
 *
 * This layer intentionally does not contain rules or role logic.
 * Rules stay in the engine; AI only produces decisions.
 */
export class AIGameBootstrap {
  constructor(private readonly factory: GameSessionFactory) {}

  create(config: AIGameBootstrapConfig): AIGameBootstrapResult {
    const session = this.factory.create({
      boardId: config.boardId,
      playerCount: config.playerCount,
      maxRounds: config.maxRounds ?? 100,
    });

    return {
      boardId: config.boardId,
      playerCount: config.playerCount,
      session,
    };
  }
}

export function createAIGameLoop(loop: AutonomousGameLoop) {
  return {
    run: () => loop.run(),
  };
}
