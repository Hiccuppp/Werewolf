import { getGameEvents } from './game-event-api.ts';
import { getGameState } from './game-event-api.ts';

export function getLiveGameState(gameId: string) {
  return {
    gameId,
    state: getGameState(gameId),
    events: getGameEvents(gameId),
  };
}

export function createEventReplay(gameId: string) {
  const events = getGameEvents(gameId);
  let cursor = 0;

  return {
    next() {
      if (cursor >= events.length) return null;
      return events[cursor++];
    },
    reset() {
      cursor = 0;
    },
  };
}
