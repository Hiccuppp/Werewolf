export interface PlayerBelief {
  targetId: string;
  suspicion: number;
  reason: string;
}

export interface AgentBeliefState {
  playerId: string;
  beliefs: PlayerBelief[];
  notes: string[];
}

export function createBeliefState(playerId: string): AgentBeliefState {
  return {
    playerId,
    beliefs: [],
    notes: [],
  };
}

export function updateBelief(
  state: AgentBeliefState,
  belief: PlayerBelief,
): AgentBeliefState {
  const filtered = state.beliefs.filter((item) => item.targetId !== belief.targetId);

  return {
    ...state,
    beliefs: [...filtered, belief],
  };
}
