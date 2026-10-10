import React from 'react';

export type GameStatusPanelProps = {
  phase?: string;
  round?: number;
  aliveCount?: number;
};

export function GameStatusPanel({
  phase = 'WAITING',
  round = 0,
  aliveCount = 0,
}: GameStatusPanelProps) {
  return (
    <section className="game-status-panel">
      <div>
        <span>Phase</span>
        <strong>{phase}</strong>
      </div>
      <div>
        <span>Round</span>
        <strong>{round}</strong>
      </div>
      <div>
        <span>Alive</span>
        <strong>{aliveCount}</strong>
      </div>
    </section>
  );
}
