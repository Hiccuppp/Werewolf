# P2.6 Agent Simulation Loop

## Goal
Connect GameFlow with Agent Runtime for a complete autonomous simulation.

Flow:

GameFlow
 -> DayPhaseAgentRunner
 -> NightPhaseAgentRunner
 -> AgentRuntime
 -> PlayerAgent
 -> LLMProvider
 -> ActionParser
 -> Engine Resolve

## Requirements

- Every player owns independent memory.
- Engine remains the only rule authority.
- Every speech, vote and night action becomes an event.
- Replay must reconstruct the complete public game history.

## Next steps

- Replace placeholder controllers.
- Add persistent event store.
- Add Web replay UI.
