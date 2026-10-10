export interface AgentObservation {
  round: number;
  phase: string;
  visibleEvents: unknown[];
  privateEvents: unknown[];
}

export class ObservationBuilder {
  build(input: AgentObservation) {
    return {
      facts: input.visibleEvents,
      privateFacts: input.privateEvents,
      phase: input.phase,
      round: input.round,
    };
  }
}
