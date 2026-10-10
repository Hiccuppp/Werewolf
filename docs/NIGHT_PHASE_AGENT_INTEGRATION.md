# Night Phase Agent Integration

## Goal
Connect AI players to night actions while keeping the engine authoritative.

## Flow

```
Night Phase
    |
ObservationBuilder
    |
PlayerAgent
    |
ActionParser
    |
Engine validation
    |
Night resolver
```

## Private information

Each role receives only allowed information:

- Werewolf: wolf team information
- Seer: own inspection result
- Witch: night kill information when available
- Guard: own protection state

The engine remains responsible for:

- target validation
- role permissions
- death resolution
- victory checking
