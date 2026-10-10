export interface MemoryEntry {
  timestamp: number;
  phase: 'day' | 'night';
  type: 'observation' | 'belief_update' | 'decision' | 'event';
  content: string;
}

export interface AgentMemory {
  playerId: string;
  entries: MemoryEntry[];
}

const memories = new Map<string, AgentMemory>();

export function createAgentMemory(playerId: string): AgentMemory {
  const memory: AgentMemory = {
    playerId,
    entries: []
  };

  memories.set(playerId, memory);
  return memory;
}

export function getAgentMemory(playerId: string): AgentMemory {
  return memories.get(playerId) ?? createAgentMemory(playerId);
}

export function appendMemory(
  playerId: string,
  entry: Omit<MemoryEntry, 'timestamp'>
): AgentMemory {
  const memory = getAgentMemory(playerId);

  memory.entries.push({
    ...entry,
    timestamp: Date.now()
  });

  return memory;
}

export function getRecentMemory(
  playerId: string,
  limit = 20
): MemoryEntry[] {
  return getAgentMemory(playerId).entries.slice(-limit);
}
