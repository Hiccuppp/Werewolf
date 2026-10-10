import type { AgentDecision, PlayerObservation } from './types';
import { PlayerAgent } from './player-agent';
import { parseDecision } from './decision-parser';
import { validateAgentAction } from './action-validator';

export interface ControllerResult {
  accepted: boolean;
  decision: AgentDecision;
  reason?: string;
}

export class PlayerController {
  constructor(private readonly agent: PlayerAgent) {}

  async act(observation: PlayerObservation): Promise<ControllerResult> {
    const raw = await this.agent.decide(observation);
    const decision = parseDecision(raw.summary?.join('\n') ?? '');
    const validation = validateAgentAction(decision, {
      alive: true,
      allowedActions: [decision.action],
    });

    if (!validation.ok) {
      return { accepted: false, decision, reason: validation.reason };
    }

    return { accepted: true, decision };
  }
}
