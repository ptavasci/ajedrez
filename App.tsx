
import React, { useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { ChessboardComponent } from './components/ChessboardComponent';
import { GameInfoPanel } from './components/GameInfoPanel';
import { NewGameIcon } from './components/icons/NewGameIcon';
import { RotateIcon } from './components/icons/RotateIcon';
import { PlayerType, Orientation } from './types';
import { GameModeSelection } from './components/GameModeSelection';
import { Footer } from './components/Footer';
import { useDeviceDetection } from './hooks/useDeviceDetection'; // Import useDeviceDetection

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human' | null>(null);
  const { isMobile, isTV } = useDeviceDetection(); // Use the hook

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

  const appContainerClasses = `
    bg-night-sky text-star-white flex flex-col items-center justify-center font-sans
    ${(isMobile || isTV) ? 'h-screen w-screen p-0' : 'h-screen p-6'}
  `;

  const mainContentClasses = `
    flex justify-center
    ${(isMobile || isTV)
      ? 'flex-grow flex-col landscape:flex-row landscape:items-start landscape:gap-4 portrait:gap-4'
      : 'w-full max-w-6xl mx-auto flex-col lg:flex-row gap-8 lg:items-start'
    }
  `;

  const chessboardContainerClasses = `
    relative shadow-2xl rounded-lg overflow-hidden
    ${(isMobile || isTV)
      ? 'aspect-square landscape:flex-none landscape:h-[calc(100vh-120px)] landscape:w-[calc(100vh-120px)] portrait:max-w-[90vw] portrait:max-h-[90vw] portrait:w-full'
      : 'w-full max-w-2xl lg:max-w-3xl'
    }
  `;

  const controlsAndInfoPanelClasses = `
    flex flex-col items-center
    ${(isMobile || isTV)
      ? 'landscape:flex-1 landscape:h-[calc(100vh-120px)] landscape:overflow-y-auto portrait:w-full portrait:px-4'
      : ''
    }
  `;

  return (
    <div className={appContainerClasses}>
      <header className={`mb-6 text-center ${(isMobile || isTV) ? 'pt-4' : ''}`}>
        <h1 className="text-5xl font-bold tracking-wider text-star-white">Ajedrez</h1>
        <p className="text-xl text-lavender-mist">
          {gameMode === 'human-vs-ai' ? 'Juega contra un oponente de IA avanzado' : 'Juega contra un amigo en el mismo dispositivo'}
        </p>
      </header>

      <div className={mainContentClasses}>
        <div className={chessboardContainerClasses}>
          {isAiThinking && gameMode === 'human-vs-ai' && (
            <div className="absolute inset-0 bg-night-sky bg-opacity-80 flex flex-col items-center justify-center z-20 rounded-lg">
              <div className="w-20 h-20 border-4 border-t-transparent border-vibrant-violet rounded-full animate-spin"></div>
              <p className="mt-6 text-xl text-star-white">Tu oponente está pensando...</p>
            </div>
          )}
          <ChessboardComponent
            fen={fen}
            onMove={handleMove}
            orientation={orientation}
            game={game}
          />
        </div>
        <div className={controlsAndInfoPanelClasses}> {/* New container for buttons and info panel */}
          <div className="flex justify-center space-x-6 mb-6 w-full"> {/* Buttons side-by-side */}
            <button
              onClick={() => {
                resetGame();
                setGameMode(null); // Go back to mode selection
              }}
              className="px-6 py-3 bg-vibrant-violet hover:bg-hover-violet rounded-lg shadow-md flex items-center justify-center gap-3 transition-colors duration-200 text-star-white font-semibold text-lg flex-1"
            >
              <NewGameIcon />
              Nueva Partida
            </button>
            <button
              onClick={flipBoard}
              className="px-6 py-3 bg-dusk-purple hover:bg-vibrant-violet rounded-lg shadow-md flex items-center justify-center gap-3 transition-colors duration-200 text-star-white font-semibold text-lg flex-1"
            >
              <RotateIcon />
              Girar Tablero
            </button>
          </div>

          <GameInfoPanel
            status={status}
            capturedPieces={capturedPieces}
            isMobileOrTV={isMobile || isTV} // Pass prop to GameInfoPanel
            className="flex-grow w-full" // Ensure it takes full width of its parent
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
