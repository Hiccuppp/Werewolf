# Player Agent Runtime

## Pipeline

Game Event
 -> ObservationBuilder
 -> Memory
 -> BeliefUpdater
 -> PromptBuilder
 -> LLM Provider
 -> ActionParser
 -> Engine

## Information isolation

Each player receives:

- public events
- own role
- own private night information

Players do not receive:

- other players private state
- hidden roles
- observer analysis

## Belief state

The agent stores structured beliefs:

- suspicion
- confidence
- evidence
- relationship changes

Do not store raw chain of thought.
