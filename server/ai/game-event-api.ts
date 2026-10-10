import { gameSessionStore } from './game-session-store.ts';
import { gameEventStream } from './game-event-stream.ts';

export function getGameState(gameId: string) {
  return gameSessionStore.get(gameId) ?? null;
}

export function getGameEvents(gameId: string) {
  return gameEventStream.replay(gameId);
}

export function subscribeGameEvents(gameId: string, listener: (event: unknown) => void) {
  return gameEventStream.subscribe(gameId, listener);
}
