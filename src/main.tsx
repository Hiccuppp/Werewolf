import ReactDOM from 'react-dom/client';
import CreateGame from './components/create-game.tsx';
import GameView from './components/game-view.tsx';
import { AppHeader } from './components/app-header.tsx';
import './styles.css';
const match = window.location.pathname.match(/^\/game\/([a-f0-9-]+)(\/god)?\/?$/i);
ReactDOM.createRoot(document.getElementById('root')!).render(<><AppHeader/>{match ? <GameView id={match[1]} god={!!match[2]}/> : <CreateGame/>}</>);
