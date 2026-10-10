export interface SuspicionEntry {
  playerId: string;
  suspicion: number;
  evidence: string[];
}

export interface ClaimAnalysis {
  speakerId: string;
  claimType: string;
  reliability: number;
  contradictions: string[];
}

export interface VoteAnalysis {
  voterId: string;
  targetId: string;
  motivation: string;
}

export interface ReasoningPlan {
  suspicionMap: SuspicionEntry[];
  claimAnalysis: ClaimAnalysis[];
  votingAnalysis: VoteAnalysis[];
  socialIntentAnalysis: Array<{
    playerId: string;
    possibleIntent:
      | 'wolf_attack'
      | 'wolf_defense'
      | 'town_reasoning'
      | 'filler';
    confidence: number;
  }>;
  confidenceUpdate: Array<{
    targetId: string;
    delta: number;
    reason: string;
  }>;
  recommendedAction: string;
}

export interface ReasoningInput {
  phase: 'day' | 'night';
  role: string;
  publicFacts: string[];
  privateBeliefs: string[];
}

/**
 * Produces a structured reasoning scaffold before model decision making.
 * It intentionally stores analysis dimensions rather than raw chain-of-thought.
 */
export function createReasoningPlan(input: ReasoningInput): ReasoningPlan {
  return {
    suspicionMap: [],
    claimAnalysis: [],
    votingAnalysis: [],
    socialIntentAnalysis: [],
    confidenceUpdate: [],
    recommendedAction: `Analyze ${input.phase} phase as ${input.role} using contradictions, intent, votes and hidden-information signals.`
  };
}

export function reasoningPlannerPrompt(plan: ReasoningPlan): string {
  return [
    'Evaluate both sides of each hypothesis.',
    'Check whether behavior matches town or wolf incentives.',
    'Analyze speaking purpose, voting patterns, and possible information advantage.',
    'Avoid judging only by surface emotion or a single statement.',
    JSON.stringify(plan)
  ].join('\n');
}
