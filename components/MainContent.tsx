import React from 'react';
import { ChessboardComponent } from './ChessboardComponent';
import { GameInfoPanel } from './GameInfoPanel';
import { Controls } from './Controls';
import { AiThinkingIndicator } from './AiThinkingIndicator';
import { Chess } from 'chess.js';
import { CapturedPieces, Player } from '../types';

interface MainContentProps {
  isMobileOrTV: boolean;
  isAiThinking: boolean;
  gameMode: 'human-vs-ai' | 'human-vs-human' | null;
  fen: string;
  handleMove: (move: { from: string; to: string; promotion?: string }) => boolean;
  orientation: 'white' | 'black';
  game: Chess;
  isTV: boolean;
  currentFocusArea: 'board' | 'buttons' | null;
  setCurrentFocusArea: (area: 'board' | 'buttons' | null) => void;
  newGameButtonRef: React.RefObject<HTMLButtonElement | null>;
  flipBoardButtonRef: React.RefObject<HTMLButtonElement | null>;
  resetGame: () => void;
  setGameMode: (mode: 'human-vs-ai' | 'human-vs-human' | null) => void;
  flipBoard: () => void;
  status: { displayMessage: string; winner: Player | null; isCheck: boolean };
  capturedPieces: CapturedPieces;
  userAgent: string | undefined;
}

export const MainContent: React.FC<MainContentProps> = ({
  isMobileOrTV,
  isAiThinking,
  gameMode,
  fen,
  handleMove,
  orientation,
  game,
  isTV,
  currentFocusArea,
  setCurrentFocusArea,
  newGameButtonRef,
  flipBoardButtonRef,
  resetGame,
  setGameMode,
  flipBoard,
  status,
  capturedPieces,
  userAgent,
}) => {
  const mainContentClasses = `
    flex justify-center
    ${
      isMobileOrTV
        ? 'flex-grow flex-col landscape:flex-row landscape:items-start landscape:gap-4 portrait:gap-4 w-full mx-auto px-4'
        : 'w-full max-w-6xl mx-auto flex-col lg:flex-row gap-8 lg:items-start'
    }
  `;

  const chessboardContainerClasses = `
    relative shadow-2xl rounded-lg overflow-hidden
    ${
      isMobileOrTV
        ? 'flex flex-col items-center justify-center aspect-square landscape:flex-none landscape:w-[45vw] landscape:h-[45vw] landscape:max-h-[calc(100vh-150px)] landscape:max-w-[calc(100vh-150px)] portrait:w-[min(90vw,90vh)] portrait:h-[min(90vw,90vh)] mx-auto'
        : 'w-full max-w-2xl lg:max-w-3xl'
    }
    ${isMobileOrTV ? 'landscape:min-h-[250px] landscape:min-w-[250px]' : ''}
  `;

  const controlsAndInfoPanelClasses = `
    flex flex-col items-center
    ${isMobileOrTV ? 'landscape:flex-1 landscape:overflow-y-auto portrait:w-full portrait:px-4 landscape:justify-between' : ''}
    ${!isMobileOrTV ? 'flex-grow h-full' : ''}
  `;

  return (
    <div className={mainContentClasses}>
      <div className={chessboardContainerClasses}>
        {isAiThinking && gameMode === 'human-vs-ai' && <AiThinkingIndicator />}
        <ChessboardComponent
          fen={fen}
          onMove={handleMove}
          orientation={orientation}
          game={game}
          isTV={isTV}
          isFocused={currentFocusArea === 'board'}
          onExitBoardFocus={() => {
            setCurrentFocusArea('buttons');
            setTimeout(() => newGameButtonRef.current?.focus(), 0);
          }}
        />
      </div>
      <div className={controlsAndInfoPanelClasses}>
        <GameInfoPanel
          status={status}
          capturedPieces={capturedPieces}
          isMobileOrTV={isMobileOrTV}
          userAgent={userAgent}
          className={`flex-grow w-full ${!isMobileOrTV ? 'mb-4' : ''}`}
        />
        <Controls
          newGameButtonRef={newGameButtonRef}
          flipBoardButtonRef={flipBoardButtonRef}
          resetGame={resetGame}
          setGameMode={setGameMode}
          flipBoard={flipBoard}
          isTV={isTV}
          setCurrentFocusArea={setCurrentFocusArea}
        />
      </div>
    </div>
  );
};
