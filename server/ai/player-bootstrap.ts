import type { PlayerController } from './player-controller';

export interface AIPlayerBootstrapConfig {
  playerIds: string[];
  controllers: Map<string, PlayerController>;
}

export interface AIPlayerRuntime {
  playerId: string;
  controller: PlayerController;
}

/**
 * Creates the AI-controlled player runtime set.
 *
 * Role assignment and rules remain owned by the game engine.
 * This layer only binds seats to AI controllers.
 */
export class AIPlayerBootstrap {
  create(config: AIPlayerBootstrapConfig): AIPlayerRuntime[] {
    return config.playerIds.map((playerId) => {
      const controller = config.controllers.get(playerId);

      if (!controller) {
        throw new Error(`Missing AI controller for player ${playerId}`);
      }

      return {
        playerId,
        controller,
      };
    });
  }
}
