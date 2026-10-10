# AI Agent Architecture V2

## Goal
Transform the game from scripted AI calls into rule-driven multi-agent simulation.

## Layers

Game Engine
- owns rules
- owns hidden information
- owns phase transitions

Player Agent
- owns reasoning
- owns memory
- owns belief state
- outputs actions only

LLM Provider
- OpenAI compatible API
- thinking/reasoning parameters
- retry and fallback

## Player reasoning pipeline

Observation -> Memory -> Belief Update -> Strategy -> Action

The system must not store private chain-of-thought. Store structured reasoning artifacts:

- suspicion
- evidence
- confidence
- planned action

## Information isolation

Agents only receive information available to their role.

Observer agents receive public events only.
