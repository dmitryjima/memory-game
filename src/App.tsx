import GameStateContextProvider from './contexts/gameStateContext';

import Game from './components/game';

import './App.css';

function App() {
  return (
    <GameStateContextProvider>
      <Game />
    </GameStateContextProvider>
  );
}

export default App;
