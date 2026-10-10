import { executeNightActions } from './night-action-runtime';

export interface NightPhaseContext {
  gameId: string;
  phase: 'NIGHT';
  players: Array<{
    id: string;
    role: string;
    alive: boolean;
  }>;
}

export interface NightResolutionResult {
  actionsResolved: number;
  deaths: string[];
}

/**
 * Connects AI night decisions with the game phase lifecycle.
 * The engine owns final state mutation; this layer only coordinates
 * collection and resolution of role actions.
 */
export async function resolveNightPhase(
  context: NightPhaseContext,
  actions: Array<{
    playerId: string;
    action: string;
    targetId?: string;
  }>,
): Promise<NightResolutionResult> {
  const results = await executeNightActions(actions);

  const deaths = results
    .filter((result) => result.action === 'wolf_kill' && result.success)
    .map((result) => result.targetId)
    .filter((id): id is string => Boolean(id));

  return {
    actionsResolved: results.length,
    deaths,
  };
}
