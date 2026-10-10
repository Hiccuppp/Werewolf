import type { PlayerObservation } from './types';
import type { GameLoopAdapter } from './game-loop-adapter';

export interface PhaseActionResult {
  playerId: number;
  action: string;
  target?: number;
  speech?: string;
}

/**
 * Phase-level orchestration boundary.
 * It asks agents for intent but leaves resolution to the game engine.
 */
export class AIPhaseController {
  constructor(private readonly adapter: GameLoopAdapter) {}

  async collectSpeeches(players: number[], observations: Map<number, PlayerObservation>) {
    const results: PhaseActionResult[] = [];
    for (const playerId of players) {
      const speech = await this.adapter.speak(playerId, observations.get(playerId)!);
      results.push({ playerId, action: 'speech', speech });
    }
    return results;
  }

  async collectVotes(players: number[], observations: Map<number, PlayerObservation>) {
    const results: PhaseActionResult[] = [];
    for (const playerId of players) {
      const target = await this.adapter.decide(playerId, observations.get(playerId)!);
      results.push({ playerId, action: 'vote', target });
    }
    return results;
  }

  async collectNightActions(players: number[], observations: Map<number, PlayerObservation>) {
    const results: PhaseActionResult[] = [];
    for (const playerId of players) {
      const target = await this.adapter.decide(playerId, observations.get(playerId)!);
      results.push({ playerId, action: 'night_action', target });
    }
    return results;
  }
}
