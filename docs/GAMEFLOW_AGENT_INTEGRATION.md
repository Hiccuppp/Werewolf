# GameFlow Agent Integration

## Goal

Replace placeholder AI decisions with independent PlayerAgent runtime.

Flow:

GameFlow
 -> ObservationBuilder
 -> AgentRuntime
 -> PromptBuilder
 -> LLMProvider
 -> ActionParser
 -> Game Action

## Isolation

Each player has:

- independent memory
- independent belief state
- private role information

The engine never sends full GameState to the model.

## Next steps

- connect vote action
- connect speech action
- connect night actions
- persist agent events
