import React, { useState, useRef, useEffect } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { PlayerType } from './types';
import { GameModeSelection } from './components/GameModeSelection';
import { Footer } from './components/Footer';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { useSound } from './hooks/useSound';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { App as CapacitorApp } from '@capacitor/app';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human' | null>(null);
  const { isMobile, isTV, userAgent } = useDeviceDetection();
  const [currentFocusArea, setCurrentFocusArea] = useState<'board' | 'buttons' | null>(
    isTV ? 'board' : null,
  );

  const newGameButtonRef = useRef<HTMLButtonElement>(null);
  const flipBoardButtonRef = useRef<HTMLButtonElement>(null);

  const playerConfig =
    gameMode === 'human-vs-ai'
      ? { player1: PlayerType.Human, player2: PlayerType.AI }
      : { player1: PlayerType.Human, player2: PlayerType.Human };

  const {
    game,
    fen,
    status,
    orientation,
    handleMove,
    resetGame,
    flipBoard,
    isAiThinking,
    capturedPieces,
  } = useChessGame(playerConfig);

  const gameStartSound = useSound('/sounds/game_start.mp3');

  const handleSelectMode = (mode: 'human-vs-ai' | 'human-vs-human') => {
    setGameMode(mode);
    gameStartSound.play();
    // Add a history entry to prevent the browser back button from leaving the page
    window.history.pushState({ page: 'game' }, '');
  };

  // Effect for browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (gameMode) {
        event.preventDefault();
        setGameMode(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [gameMode]);

  // Effect for Capacitor back button (Android)
  useEffect(() => {
    if (isMobile || isTV) {
      const listener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          // If there's no web history, we might exit the app
          if (window.confirm('¿Deseas abandonar la partida?')) {
            setGameMode(null);
          } else {
            // Do nothing, stay in the app
          }
        } else {
          // If there is web history, let the browser handle it
          window.history.back();
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, [isMobile, isTV]);

  useEffect(() => {
    if (isTV && currentFocusArea === 'buttons') {
      const handleButtonKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          if (document.activeElement === flipBoardButtonRef.current) {
            newGameButtonRef.current?.focus();
            event.preventDefault();
          }
        } else if (event.key === 'ArrowRight') {
          if (document.activeElement === newGameButtonRef.current) {
            flipBoardButtonRef.current?.focus();
            event.preventDefault();
          }
        } else if (event.key === 'Enter') {
            // When enter is pressed on a button, focus the board
            setCurrentFocusArea('board');
            event.preventDefault();
        } else if (event.key === 'Backspace' || event.key === 'Escape') {
          setCurrentFocusArea('board');
          event.preventDefault();
        }
      };

      window.addEventListener('keydown', handleButtonKeyDown);
      return () => window.removeEventListener('keydown', handleButtonKeyDown);
    }
  }, [isTV, currentFocusArea]);

  if (!gameMode) {
    return <GameModeSelection onSelectMode={handleSelectMode} />;
  }

  const appContainerClasses = `
    bg-night-sky text-star-white flex flex-col items-center justify-between font-sans
    ${isMobile || isTV ? 'h-screen w-screen p-0' : 'h-screen p-6'}
    ${isMobile || isTV ? 'landscape:justify-between' : ''}
  `;

  return (
    <div className={appContainerClasses}>
      <Header gameMode={gameMode} isMobileOrTV={isMobile || isTV} />
      <MainContent
        isMobileOrTV={isMobile || isTV}
        isAiThinking={isAiThinking}
        gameMode={gameMode}
        fen={fen}
        handleMove={handleMove}
        orientation={orientation}
        game={game}
        isTV={isTV}
        currentFocusArea={currentFocusArea}
        setCurrentFocusArea={setCurrentFocusArea}
        newGameButtonRef={newGameButtonRef}
        flipBoardButtonRef={flipBoardButtonRef}
        resetGame={resetGame}
        setGameMode={setGameMode}
        flipBoard={flipBoard}
        status={status}
        capturedPieces={capturedPieces}
        userAgent={userAgent}
      />
      <Footer />
    </div>
  );
};

export default App;