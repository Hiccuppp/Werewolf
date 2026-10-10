import { AIGameBootstrap } from './ai-game-bootstrap';
import { GameSessionFactory } from './game-session-factory';

export interface StartAIGameOptions {
  boardId?: string;
  playerCount?: number;
  maxRounds?: number;
}

/**
 * Application-level entry boundary for starting an autonomous AI match.
 *
 * This intentionally only wires startup. The game engine remains the source
 * of truth for phases, validation, deaths and victory resolution.
 */
export function startAIGame(options: StartAIGameOptions = {}) {
  const factory = new GameSessionFactory();
  const bootstrap = new AIGameBootstrap(factory);

  return bootstrap.create({
    boardId: options.boardId ?? 'pre_woman_hunter_guard_wolfking',
    playerCount: options.playerCount ?? 12,
    maxRounds: options.maxRounds ?? 100,
  });
}
