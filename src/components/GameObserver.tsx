import { useEffect, useState } from "react";

export type GameEvent = {
  type: string;
  content?: string;
  playerId?: string;
};

export function GameObserver({ gameId }: { gameId: string }) {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [phase, setPhase] = useState("WAITING");

  useEffect(() => {
    const source = new EventSource(`/api/games/${gameId}/events/stream`);

    source.onmessage = (message) => {
      const event = JSON.parse(message.data) as GameEvent;
      setEvents((current) => [...current, event]);
      if (event.type) {
        setPhase(event.type);
      }
    };

    return () => source.close();
  }, [gameId]);

  return (
    <main>
      <h1>AI Werewolf</h1>
      <section>Phase: {phase}</section>
      <section>
        {events.map((event, index) => (
          <article key={index}>
            {event.playerId ? `Player ${event.playerId}: ` : ""}
            {event.content ?? event.type}
          </article>
        ))}
      </section>
    </main>
  );
}
