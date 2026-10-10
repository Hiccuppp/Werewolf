import { useEffect, useState } from 'react';
import { GameObserver } from './GameObserver';
import { GameLauncher } from './GameLauncher';

interface GamePageControllerProps {
  gameId?: string;
  god?: boolean;
}

export function GamePageController({ gameId, god }: GamePageControllerProps) {
  const [activeGameId, setActiveGameId] = useState<string | undefined>(gameId);

  useEffect(() => {
    setActiveGameId(gameId);
  }, [gameId]);

  if (activeGameId) {
    return <GameObserver gameId={activeGameId} god={god} />;
  }

  return <GameLauncher onStarted={setActiveGameId} />;
}
