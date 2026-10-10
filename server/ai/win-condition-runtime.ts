export type WinningSide = "villager" | "wolf" | "none";

export interface WinConditionPlayer {
  id: string;
  alive: boolean;
  role: string;
}

export interface WinConditionResult {
  winner: WinningSide;
  finished: boolean;
  reason?: string;
}

/**
 * Evaluates terminal game states.
 *
 * Kept independent from the game loop so different rule sets can reuse
 * the same runtime boundary.
 */
export function evaluateWinCondition(
  players: WinConditionPlayer[],
): WinConditionResult {
  const alivePlayers = players.filter((player) => player.alive);

  const aliveWolves = alivePlayers.filter((player) =>
    ["wolf", "wolf-beauty", "wolf_king"].includes(player.role),
  );

  const aliveVillagers = alivePlayers.filter(
    (player) => !["wolf", "wolf-beauty", "wolf_king"].includes(player.role),
  );

  if (aliveWolves.length === 0) {
    return {
      winner: "villager",
      finished: true,
      reason: "all wolves eliminated",
    };
  }

  if (aliveWolves.length >= aliveVillagers.length) {
    return {
      winner: "wolf",
      finished: true,
      reason: "wolves reached parity",
    };
  }

  return {
    winner: "none",
    finished: false,
  };
}
