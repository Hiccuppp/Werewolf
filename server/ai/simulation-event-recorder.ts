export type SimulationEventType =
  | "phase"
  | "speech"
  | "vote"
  | "night_action"
  | "elimination"
  | "result";

export interface SimulationEvent {
  id: string;
  type: SimulationEventType;
  round: number;
  playerId?: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface SimulationRecord {
  gameId: string;
  events: SimulationEvent[];
}

export class SimulationEventRecorder {
  private readonly records = new Map<string, SimulationRecord>();

  create(gameId: string): SimulationRecord {
    const record: SimulationRecord = {
      gameId,
      events: [],
    };

    this.records.set(gameId, record);
    return record;
  }

  append(
    gameId: string,
    event: Omit<SimulationEvent, "id" | "timestamp">,
  ): SimulationEvent {
    const record = this.records.get(gameId) ?? this.create(gameId);

    const entry: SimulationEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    record.events.push(entry);
    return entry;
  }

  get(gameId: string): SimulationRecord | undefined {
    return this.records.get(gameId);
  }
}
