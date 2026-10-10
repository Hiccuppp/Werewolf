import { useEffect, useState } from 'react';
import { GameObserver } from './GameObserver';
import { GameLauncher } from './GameLauncher';

interface GamePageControllerProps {
  gameId?: string;
}

export function GamePageController({ gameId }: GamePageControllerProps) {
  const [activeGameId, setActiveGameId] = useState<string | undefined>(gameId);

  useEffect(() => {
    setActiveGameId(gameId);
  }, [gameId]);

  if (activeGameId) {
    return <GameObserver gameId={activeGameId} />;
  }

  return <GameLauncher onStarted={setActiveGameId} />;
}
