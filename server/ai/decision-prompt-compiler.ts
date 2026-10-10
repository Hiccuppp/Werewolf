export interface DecisionPromptContext {
  rolePolicy: string;
  publicContext: string;
  privateBelief: string;
  reasoningPlan: string;
  memory: string;
  phase: string;
}

export interface CompiledDecisionPrompt {
  system: string;
  context: string;
}

/**
 * Combines separated agent cognition layers into a controlled model input.
 * This intentionally keeps reasoning artifacts structured rather than exposing
 * private chain-of-thought.
 */
export function compileDecisionPrompt(
  input: DecisionPromptContext,
): CompiledDecisionPrompt {
  return {
    system: [
      'You are an AI player in a werewolf game.',
      'Follow your role policy and make decisions based on available information.',
      'Do not reveal hidden information unless allowed by your role.',
    ].join('\n'),
    context: [
      `Phase:\n${input.phase}`,
      `Role Policy:\n${input.rolePolicy}`,
      `Public Information:\n${input.publicContext}`,
      `Private Belief:\n${input.privateBelief}`,
      `Reasoning Summary:\n${input.reasoningPlan}`,
      `Memory:\n${input.memory}`,
    ].join('\n\n'),
  };
}
