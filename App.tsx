
import React, { useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { ChessboardComponent } from './components/ChessboardComponent';
import { GameInfoPanel } from './components/GameInfoPanel';
import { NewGameIcon } from './components/icons/NewGameIcon';
import { RotateIcon } from './components/icons/RotateIcon';
import { PlayerType, Orientation } from './types';
import { GameModeSelection } from './components/GameModeSelection';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human' | null>(null);

  const playerConfig = gameMode === 'human-vs-ai'
    ? { player1: PlayerType.Human, player2: PlayerType.AI }
    : { player1: PlayerType.Human, player2: PlayerType.Human };

  const {
    game,
    fen,
    status,
    orientation,
    playerTurn,
    handleMove,
    resetGame,
    flipBoard,
    isAiThinking,
    capturedPieces // Add capturedPieces
  } = useChessGame(playerConfig);

  const handleSelectMode = (mode: 'human-vs-ai' | 'human-vs-human') => {
    setGameMode(mode);
  };

  if (!gameMode) {
    return <GameModeSelection onSelectMode={handleSelectMode} />;
  }

  return (
    <div className="h-screen bg-night-sky text-star-white flex flex-col items-center justify-center p-6 font-sans">
      <header className="mb-6 text-center">
        <h1 className="text-5xl font-bold tracking-wider text-star-white">Ajedrez</h1>
        <p className="text-xl text-lavender-mist">
          {gameMode === 'human-vs-ai' ? 'Juega contra un oponente de IA avanzado' : 'Juega contra un amigo en el mismo dispositivo'}
        </p>
      </header>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-start">
        <div className="relative">
          {isAiThinking && gameMode === 'human-vs-ai' && (
            <div className="absolute inset-0 bg-night-sky bg-opacity-80 flex flex-col items-center justify-center z-20 rounded-lg">
              <div className="w-20 h-20 border-4 border-t-transparent border-vibrant-violet rounded-full animate-spin"></div>
              <p className="mt-6 text-xl text-star-white">Tu oponente está pensando...</p>
            </div>
          )}
          <div className="w-full max-w-2xl lg:max-w-3xl shadow-2xl rounded-lg overflow-hidden">
            <ChessboardComponent
              fen={fen}
              onMove={handleMove}
              orientation={orientation}
              game={game}
            />
          </div>
          <div className="mt-6 flex justify-center space-x-6">
            <button
              onClick={() => {
                resetGame();
                setGameMode(null); // Go back to mode selection
              }}
              className="px-6 py-3 bg-vibrant-violet hover:bg-hover-violet rounded-lg shadow-md flex items-center gap-3 transition-colors duration-200 text-star-white font-semibold text-lg"
            >
              <NewGameIcon />
              Nueva Partida
            </button>
            <button
              onClick={flipBoard}
              className="px-6 py-3 bg-dusk-purple hover:bg-vibrant-violet rounded-lg shadow-md flex items-center gap-3 transition-colors duration-200 text-star-white font-semibold text-lg"
            >
              <RotateIcon />
              Girar Tablero
            </button>
          </div>
        </div>

        <GameInfoPanel
          status={status}
          capturedPieces={capturedPieces}
        />
      </div>

      <Footer />
    </div>
  );
};

export default App;
