import type { AgentDecision } from './types';

export interface RawAgentResponse {
  action?: string;
  target?: number;
  confidence?: number;
  summary?: string[];
}

const ALLOWED_ACTIONS = new Set([
  'speech', 'vote', 'kill', 'check', 'protect', 'save', 'poison', 'pass',
]);

export function parseAgentDecision(raw: string): AgentDecision {
  try {
    const parsed = JSON.parse(raw) as RawAgentResponse;
    if (!parsed.action || !ALLOWED_ACTIONS.has(parsed.action)) {
      return { action: 'pass', confidence: 0, summary: ['invalid_agent_action'] };
    }
    return {
      action: parsed.action,
      target: parsed.target,
      confidence: parsed.confidence ?? 0,
      summary: parsed.summary ?? [],
    };
  } catch {
    return { action: 'pass', confidence: 0, summary: ['unparseable_agent_response'] };
  }
}

export const parseDecision = parseAgentDecision;
