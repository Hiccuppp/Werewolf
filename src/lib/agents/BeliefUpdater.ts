export interface Belief {
  playerId: number;
  roleProbability: Record<string, number>;
  evidence: string[];
}

export class BeliefUpdater {
  update(current: Belief[], evidence: string[]) {
    return current.map(item => ({
      ...item,
      evidence: [...item.evidence, ...evidence],
    }));
  }
}
