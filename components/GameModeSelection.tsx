import React, { useEffect, useRef } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { Footer } from './Footer';

interface GameModeSelectionProps {
  onSelectMode: (mode: 'human-vs-ai' | 'human-vs-human') => void;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelectMode }) => {
  const humanVsHumanButtonRef = useRef<HTMLButtonElement>(null);
  const { isTV } = useDeviceDetection();

  useEffect(() => {
    if (isTV) {
      onSelectMode('human-vs-human');
      humanVsHumanButtonRef.current?.focus();
    }
  }, [onSelectMode, isTV]);
  return (
    <div className="h-screen w-full bg-night-sky text-star-white flex flex-col items-center justify-center p-4 font-sans flex-grow">
      <header className="mb-6 text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-wider text-star-white mb-6">
          Ajedrez
        </h1>
        <p className="text-2xl sm:text-3xl text-lavender-mist">Elige tu modo de juego</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl px-2">
        <button
          onClick={() => onSelectMode('human-vs-ai')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSelectMode('human-vs-ai');
            } else if (isTV && e.key === 'ArrowRight') {
              /* No action for ArrowRight to restrict navigation in TV mode */
            } else if (!isTV && e.key === 'ArrowRight') {
              (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
            }
          }}
          tabIndex={0}
          className="px-6 py-4 bg-vibrant-violet hover:bg-hover-violet rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 text-star-white font-bold text-lg sm:text-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 flex-1"
        >
          <span className="text-4xl sm:text-5xl">🤖</span>
          Jugar contra IA
        </button>

        <button
          ref={humanVsHumanButtonRef}
          onClick={() => onSelectMode('human-vs-human')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSelectMode('human-vs-human');
            } else if (isTV && e.key === 'ArrowLeft') {
              /* No action for ArrowLeft to restrict navigation in TV mode */
            } else if (!isTV && e.key === 'ArrowLeft') {
              (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
            }
          }}
          tabIndex={0}
          className="px-6 py-4 bg-dusk-purple hover:bg-vibrant-violet rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 text-star-white font-bold text-lg sm:text-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 flex-1"
        >
          <span className="text-4xl sm:text-5xl">🤝</span>2 Jugadores (Local)
        </button>
      </div>

      <Footer />
    </div>
  );
};
