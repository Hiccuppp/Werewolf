export type GameStateSnapshot = {
  gameId: string;
  phase?: string;
  round?: number;
  players?: Array<{
    id: string;
    alive?: boolean;
    name?: string;
  }>;
};

export async function fetchGameState(id: string): Promise<GameStateSnapshot | null> {
  const response = await fetch(`/api/games/${id}/state`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}
