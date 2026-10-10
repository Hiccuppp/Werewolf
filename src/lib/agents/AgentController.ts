export interface AgentControllerContext {
  playerId: number;
  role: string;
  visibleEvents: unknown[];
  privateInfo?: unknown;
}

export interface AgentAction {
  type: string;
  target?: number;
  summary?: string;
}

export interface AgentController {
  decide(context: AgentControllerContext): Promise<AgentAction>;
}
