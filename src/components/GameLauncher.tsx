import { useState } from "react";

export function GameLauncher({
  onStarted,
}: {
  onStarted?: (gameId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startGame() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/games/ai/start", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          boardId: "pre_woman_hunter_guard_wolfking",
        }),
      });

      if (!response.ok) {
        throw new Error("failed to start game");
      }

      const result = (await response.json()) as { gameId: string };
      onStarted?.(result.gameId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>AI Werewolf</h1>
      <button disabled={loading} onClick={startGame}>
        {loading ? "Starting..." : "Start AI Game"}
      </button>
      {error ? <p>{error}</p> : null}
    </section>
  );
}
