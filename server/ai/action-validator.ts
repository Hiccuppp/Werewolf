import type { AgentDecision } from './types';

export interface ActionValidationContext {
  alive: boolean;
  canVote?: boolean;
  allowedActions: string[];
  allowedTargets?: number[];
}

export interface ValidatedAgentAction {
  accepted: boolean;
  decision: AgentDecision;
  reason?: string;
}

export function validateAgentAction(
  decision: AgentDecision,
  context: ActionValidationContext,
): ValidatedAgentAction {
  if (!context.alive && decision.action !== 'pass') {
    return { accepted: false, decision, reason: 'player_not_alive' };
  }

  if (!context.allowedActions.includes(decision.action)) {
    return { accepted: false, decision, reason: 'action_not_allowed' };
  }

  if (decision.action === 'vote' && context.canVote === false) {
    return { accepted: false, decision, reason: 'no_vote_right' };
  }

  if (
    decision.target !== undefined &&
    context.allowedTargets &&
    !context.allowedTargets.includes(decision.target)
  ) {
    return { accepted: false, decision, reason: 'invalid_target' };
  }

  return { accepted: true, decision };
}
