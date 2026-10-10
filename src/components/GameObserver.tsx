import { useEffect, useState } from "react";
import { GameTable, type PlayerSeat } from "./GameTable";

export type GameEvent = {
  type: string;
  content?: string;
  playerId?: string;
};

interface GameObserverProps {
  gameId: string;
  god?: boolean;
}

export function GameObserver({ gameId, god }: GameObserverProps) {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [phase, setPhase] = useState("WAITING");
  const [players, setPlayers] = useState<PlayerSeat[]>([]);

  useEffect(() => {
    fetch(`/api/games/${gameId}/state`)
      .then((response) => response.json())
      .then((state) => {
        if (Array.isArray(state.players)) {
          setPlayers(state.players);
        }
      })
      .catch(() => undefined);

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
      {god && <section>God Mode</section>}
      <section>Phase: {phase}</section>
      <GameTable players={players} events={events} />
    </main>
  );
}
