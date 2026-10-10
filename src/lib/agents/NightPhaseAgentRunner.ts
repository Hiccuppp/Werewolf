import type { PlayerAgent } from './PlayerAgent';

export type NightActionType =
  | 'wolf_kill'
  | 'seer_check'
  | 'witch_save'
  | 'witch_poison'
  | 'guard_protect';

export interface NightDecision {
  playerId: string;
  type: NightActionType;
  targetId?: string;
}

export interface NightAgentContext {
  playerId: string;
  phase: string;
  visibleEvents: unknown[];
  privateInfo: unknown;
}

/**
 * Night phase adapter.
 * The engine validates permissions and resolves rules after decisions are returned.
 */
export class NightPhaseAgentRunner {
  constructor(private readonly agents: Map<string, PlayerAgent>) {}

  async requestDecision(context: NightAgentContext): Promise<NightDecision | null> {
    const agent = this.agents.get(context.playerId);
    if (!agent) return null;

    const decision = await agent.decide({
      role: context.playerId,
      visibleEvents: context.visibleEvents,
      memory: {},
      belief: {},
    });

    return {
      playerId: context.playerId,
      type: decision.action as NightActionType,
      targetId: decision.target,
    };
  }
}
