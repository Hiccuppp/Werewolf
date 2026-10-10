import type { PlayerObservation } from './types';
import type { PlayerController } from './player-controller';

export interface GameLoopAdapter {
  speak(playerId: number, observation: PlayerObservation): Promise<string | undefined>;
  decide(playerId: number, observation: PlayerObservation): Promise<number | undefined>;
}

/**
 * Minimal adapter used by GameFlow.
 * Concrete engine mutation remains inside the game domain layer.
 */
export class AIGameLoopAdapter implements GameLoopAdapter {
  constructor(private readonly controllers: Map<number, PlayerController>) {}

  async speak(playerId: number, observation: PlayerObservation) {
    const controller = this.controllers.get(playerId);
    if (!controller) return undefined;

    const result = await controller.act(observation);
    return result.accepted ? result.decision.summary?.join('\n') : undefined;
  }

  async decide(playerId: number, observation: PlayerObservation) {
    const controller = this.controllers.get(playerId);
    if (!controller) return undefined;

    const result = await controller.act(observation);
    return result.accepted ? result.decision.target : undefined;
  }
}
