import React from 'react';
import { NewGameIcon } from './icons/NewGameIcon';
import { RotateIcon } from './icons/RotateIcon';

interface ControlsProps {
  newGameButtonRef: React.RefObject<HTMLButtonElement | null>;
  flipBoardButtonRef: React.RefObject<HTMLButtonElement | null>;
  resetGame: () => void;
  setGameMode: (mode: 'human-vs-ai' | 'human-vs-human' | null) => void;
  flipBoard: () => void;
  isTV: boolean;
  setCurrentFocusArea: (area: 'board' | 'buttons' | null) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  newGameButtonRef,
  flipBoardButtonRef,
  resetGame,
  setGameMode,
  flipBoard,
  isTV,
  setCurrentFocusArea,
}) => {
  return (
    <div className="flex justify-center space-x-4 w-full mb-4">
      <button
        ref={newGameButtonRef}
        onClick={() => {
          resetGame();
          setGameMode(null); // Go back to mode selection
        }}
        onFocus={() => isTV && setCurrentFocusArea('buttons')}
        tabIndex={isTV ? 0 : -1}
        className="px-4 py-3 bg-vibrant-violet hover:bg-hover-violet rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors duration-200 text-star-white font-semibold text-xs"
      >
        <NewGameIcon />
        Nueva Partida
      </button>
      <button
        ref={flipBoardButtonRef}
        onClick={flipBoard}
        onFocus={() => isTV && setCurrentFocusArea('buttons')}
        tabIndex={isTV ? 0 : -1}
        className="px-4 py-3 bg-dusk-purple hover:bg-vibrant-violet rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors duration-200 text-star-white font-semibold text-xs"
      >
        <RotateIcon />
        Girar Tablero
      </button>
    </div>
  );
};
