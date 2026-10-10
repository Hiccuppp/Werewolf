# Day Phase Agent Integration

## Goal

Replace placeholder AI decisions in daytime flow with independent PlayerAgent calls.

## Flow

DAY_SPEECH

GameEvent -> ObservationBuilder -> PlayerAgent -> Speech Event

VOTE

GameEvent -> ObservationBuilder -> PlayerAgent -> Vote Action -> Engine validation

## Rules

- Agent cannot access hidden roles.
- Engine validates all actions.
- Speech and vote are persisted as events.
- Memory and belief remain private per player.

## Next

Implement concrete runner connection inside GameFlow.
