export interface AgentRuntimeContext {
  playerId: number;
  phase: string;
  observation: unknown;
  privateInfo?: unknown;
}

export interface AgentRuntime {
  decide(context: AgentRuntimeContext): Promise<unknown>;
}

export class DefaultAgentRuntime implements AgentRuntime {
  constructor(private readonly controller: { decide: (ctx: AgentRuntimeContext) => Promise<unknown> }) {}

  decide(context: AgentRuntimeContext) {
    return this.controller.decide(context);
  }
}
