import type { AIPhaseController } from './phase-controller';
import type { PlayerObservation } from './types';

export interface AIGameSnapshot {
  alivePlayers: number[];
  observations: Map<number, PlayerObservation>;
}

/**
 * Runtime bridge between the game flow and AI phase controller.
 * The runner only collects intentions. Game rules still resolve outcomes.
 */
export class AIGameRunner {
  constructor(private readonly phases: AIPhaseController) {}

  async runDaySpeech(snapshot: AIGameSnapshot) {
    return this.phases.collectSpeeches(
      snapshot.alivePlayers,
      snapshot.observations,
    );
  }

  async runVote(snapshot: AIGameSnapshot) {
    return this.phases.collectVotes(
      snapshot.alivePlayers,
      snapshot.observations,
    );
  }

  async runNight(snapshot: AIGameSnapshot) {
    return this.phases.collectNightActions(
      snapshot.alivePlayers,
      snapshot.observations,
    );
  }
}
