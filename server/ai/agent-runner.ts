export interface AgentRunnerContext {
  playerId: string;
  phase: string;
  observe: () => Promise<unknown>;
  updateMemory: (input: unknown) => Promise<void>;
  updateBelief: (input: unknown) => Promise<void>;
  buildReasoningPlan: (input: unknown) => Promise<unknown>;
  compilePrompt: (input: unknown) => Promise<unknown>;
  decide: (prompt: unknown) => Promise<unknown>;
  execute: (action: unknown) => Promise<void>;
}

export interface AgentRunResult {
  playerId: string;
  action: unknown;
  reasoningPlan: unknown;
}

/**
 * Coordinates one complete AI agent turn.
 *
 * The runner intentionally keeps each stage separated so different
 * implementations of memory, belief updates, planning and LLM providers
 * can be swapped without changing game orchestration.
 */
export async function runAgentTurn(
  context: AgentRunnerContext,
): Promise<AgentRunResult> {
  const observation = await context.observe();

  await context.updateMemory({
    phase: context.phase,
    observation,
  });

  await context.updateBelief({
    phase: context.phase,
    observation,
  });

  const reasoningPlan = await context.buildReasoningPlan({
    observation,
  });

  const prompt = await context.compilePrompt({
    observation,
    reasoningPlan,
  });

  const action = await context.decide(prompt);

  await context.execute(action);

  return {
    playerId: context.playerId,
    action,
    reasoningPlan,
  };
}
