import type { AgentAction } from './AgentController';

export function parseAgentAction(input: string): AgentAction {
  try {
    const value = JSON.parse(input);
    return {
      type: value.type ?? 'pass',
      target: value.target,
      summary: value.summary
    };
  } catch {
    return {
      type: 'pass',
      summary: 'invalid model output'
    };
  }
}
