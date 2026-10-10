# AI Agent Runtime Integration

## Current transition

Before:

GameFlow -> Provider -> LLM

After:

GameFlow -> AgentController -> PlayerAgent -> Provider

## Rules

- Game engine owns truth.
- Agent receives observation only.
- Each player has isolated context.
- Model output must be parsed and validated.

## Next implementation

1. Replace existing AI call sites with AgentController.
2. Add role private context generation.
3. Add memory update after every event.
4. Add vote/speech/action loops.
