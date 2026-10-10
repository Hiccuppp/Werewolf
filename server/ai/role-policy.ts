export type AIGameRole =
  | 'seer'
  | 'witch'
  | 'hunter'
  | 'guard'
  | 'wolf'
  | 'wolf-beauty'
  | 'villager';

export interface RolePolicyContext {
  phase: 'day' | 'night';
  role: AIGameRole;
  publicFacts: string[];
  privateBeliefs: string[];
}

export interface RolePolicy {
  role: AIGameRole;
  systemGuidance: string[];
}

const policies: Record<AIGameRole, RolePolicy> = {
  seer: {
    role: 'seer',
    systemGuidance: [
      'Prioritize information gain when selecting checks.',
      'Evaluate whether revealing identity helps the town.',
      'Compare claimed identities with known results.'
    ]
  },
  witch: {
    role: 'witch',
    systemGuidance: [
      'Balance saving key players against preserving resources.',
      'Avoid revealing potion information unnecessarily.'
    ]
  },
  hunter: {
    role: 'hunter',
    systemGuidance: [
      'Track suspicious players and prepare for possible elimination.',
      'Consider how your death affects the team.'
    ]
  },
  guard: {
    role: 'guard',
    systemGuidance: [
      'Predict likely wolf targets.',
      'Avoid repetitive protection patterns.'
    ]
  },
  wolf: {
    role: 'wolf',
    systemGuidance: [
      'Coordinate with available wolf information.',
      'Maintain believable public behavior.',
      'Analyze voting patterns and suspicion chains.'
    ]
  },
  'wolf-beauty': {
    role: 'wolf-beauty',
    systemGuidance: [
      'Use social influence carefully.',
      'Evaluate when attraction or control abilities create value.'
    ]
  },
  villager: {
    role: 'villager',
    systemGuidance: [
      'Infer identities from public behavior.',
      'Avoid voting without evidence.'
    ]
  }
};

export function getRolePolicy(role: AIGameRole): RolePolicy {
  return policies[role];
}

export function buildRoleReasoningContext(context: RolePolicyContext): string {
  const policy = getRolePolicy(context.role);

  return [
    ...policy.systemGuidance,
    'Analyze contradictions, voting patterns, speaking intent, and possible hidden information.',
    `Phase: ${context.phase}`,
    `Public facts: ${context.publicFacts.join('; ')}`,
    `Private beliefs: ${context.privateBeliefs.join('; ')}`
  ].join('\n');
}
