# P2.3 GameFlow Agent Runtime Integration

## Goal

Replace placeholder controllers with independent AI player agents.

## Flow

```
GameFlow
  -> ObservationBuilder
  -> GameActionController
  -> PlayerAgent
  -> ActionParser
  -> Engine validation
  -> Resolve
```

## Rules

- Engine remains the authority for legal actions.
- Agent output is only a proposal.
- Invalid model output becomes pass or retry, never bypasses rules.
- Each player owns independent memory and belief state.

## Information isolation

Player context contains only:

- own role
- public events
- private events allowed by role
- own historical belief

It must not contain:

- other roles
- observer analysis
- hidden game state
