export interface BeliefItem {
  subjectId: number;
  hypothesis: string;
  confidence: number;
  evidence: string[];
}

export interface AgentMemory {
  facts: string[];
  claims: string[];
  beliefs: BeliefItem[];
}

export interface PlayerAgentContext {
  role: string;
  visibleEvents: unknown[];
  memory: AgentMemory;
}

export interface AgentDecision {
  action: string;
  target?: number;
  summary: string;
  confidence: number;
}

export interface PlayerAgent {
  decide(context: PlayerAgentContext): Promise<AgentDecision>;
}
