import type { GameEvent } from "./GameObserver";

export type PlayerSeat = {
  id: string;
  alive?: boolean;
};

export function GameTable({
  players,
  events,
}: {
  players: PlayerSeat[];
  events: GameEvent[];
}) {
  return (
    <section>
      <h2>Players</h2>
      <div>
        {players.map((player) => (
          <div key={player.id}>
            Player {player.id} {player.alive === false ? "(dead)" : ""}
          </div>
        ))}
      </div>

      <h2>Public Timeline</h2>
      <div>
        {events.map((event, index) => (
          <article key={index}>
            {event.playerId ? `Player ${event.playerId}: ` : ""}
            {event.content ?? event.type}
          </article>
        ))}
      </div>
    </section>
  );
}
