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
  get ok(): boolean;
}

export function validateAgentAction(
  decision: AgentDecision,
  context: ActionValidationContext,
): ValidatedAgentAction {
  const result = (accepted: boolean, reason?: string): ValidatedAgentAction => ({
    accepted,
    decision,
    reason,
    get ok() { return accepted; },
  });

  if (!context.alive && decision.action !== 'pass') {
    return result(false, 'player_not_alive');
  }
  if (!context.allowedActions.includes(decision.action)) {
    return result(false, 'action_not_allowed');
  }
  if (decision.action === 'vote' && context.canVote === false) {
    return result(false, 'no_vote_right');
  }
  if (decision.target !== undefined && context.allowedTargets && !context.allowedTargets.includes(decision.target)) {
    return result(false, 'invalid_target');
  }
  return result(true);
}
