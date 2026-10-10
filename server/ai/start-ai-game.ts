import { AIGameBootstrap } from './ai-game-bootstrap';
import { GameSessionFactory } from './game-session-factory';
import type { AIGameEngineAdapter } from './game-engine-adapter';

export interface StartAIGameOptions {
  boardId?: string;
  playerCount?: number;
  maxRounds?: number;
  provider?: string;
  model?: string;
  reasoning?: 'off' | 'standard' | 'deep';
}

export function startAIGame(options: StartAIGameOptions = {}) {
  const factory = new GameSessionFactory();
  const bootstrap = new AIGameBootstrap(factory);
  const adapter = undefined as unknown as AIGameEngineAdapter;

  return bootstrap.create({
    boardId: options.boardId ?? 'pre_woman_hunter_guard_wolfking',
    playerCount: options.playerCount ?? 12,
    maxRounds: options.maxRounds ?? 100,
    adapter,
  });
}
