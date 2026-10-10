import type { PlayerObservation } from './types';
import type { GameLoopAdapter } from './game-loop-adapter';

export type PhaseActionKind =
  | 'speech'
  | 'vote'
  | 'wolf_kill'
  | 'seer_check'
  | 'witch_save'
  | 'witch_poison'
  | 'guard_protect';

export interface PhaseActionResult {
  playerId: number;
  action: PhaseActionKind;
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
      results.push({ playerId, action: 'wolf_kill', target });
    }
    return results;
  }

  async collectRoleAction(
    playerId: number,
    action: Extract<PhaseActionKind, 'wolf_kill' | 'seer_check' | 'witch_save' | 'witch_poison' | 'guard_protect'>,
    observation: PlayerObservation,
  ) {
    const target = await this.adapter.decide(playerId, observation);
    return {
      playerId,
      action,
      target,
    } satisfies PhaseActionResult;
  }
}
