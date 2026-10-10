import { executeNightActions } from './night-action-runtime';
import type { NightActionResult } from './night-action-runtime';

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

export async function resolveNightPhase(
  context: NightPhaseContext,
  actions: Array<{
    playerId: string;
    action: 'wolf_kill' | 'seer_check' | 'witch_save' | 'witch_poison' | 'guard_protect';
    targetId?: string;
  }>,
): Promise<NightResolutionResult> {
  const results: NightActionResult[] = await executeNightActions(actions);

  const deaths = results
    .filter((result) => result.action === 'wolf_kill' && result.success)
    .map((result) => result.targetId)
    .filter((id): id is string => Boolean(id));

  return {
    actionsResolved: results.length,
    deaths,
  };
}
