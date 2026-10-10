import ReactDOM from 'react-dom/client';
import { GamePageController } from './components/GamePageController.tsx';
import { AppHeader } from './components/app-header.tsx';
import './styles.css';

const match = window.location.pathname.match(/^\/game\/([a-f0-9-]+)(\/god)?\/?$/i);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AppHeader />
    <GamePageController gameId={match?.[1]} god={!!match?.[2]} />
  </>,
);
