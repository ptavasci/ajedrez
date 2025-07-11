import React from 'react';
import { Footer } from './Footer';

interface GameModeSelectionProps {
    onSelectMode: (mode: 'human-vs-ai' | 'human-vs-human') => void;
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelectMode }) => {
    return (
        <div className="h-screen w-full bg-night-sky text-star-white flex flex-col items-center justify-center p-8 font-sans flex-grow">
            <header className="mb-8 text-center">
                <h1 className="text-7xl sm:text-8xl font-extrabold tracking-wider text-star-white mb-8">Ajedrez</h1>
                <p className="text-3xl sm:text-4xl text-lavender-mist">Elige tu modo de juego</p>
            </header>

            <div className="flex flex-col sm:flex-row gap-10">
                <button
                    onClick={() => onSelectMode('human-vs-ai')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSelectMode('human-vs-ai');
                        } else if (e.key === 'ArrowRight') {
                            (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                        }
                    }}
                    tabIndex={0}
                    className="px-16 py-8 bg-vibrant-violet hover:bg-hover-violet rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-6 transition-all duration-300 text-star-white font-bold text-2xl sm:text-3xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 w-full"
                >
                    <span className="text-6xl sm:text-7xl">🤖</span>
                    Jugar contra IA
                </button>

                <button
                    onClick={() => onSelectMode('human-vs-human')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSelectMode('human-vs-human');
                        } else if (e.key === 'ArrowLeft') {
                            (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
                        }
                    }}
                    tabIndex={0}
                    className="px-16 py-8 bg-dusk-purple hover:bg-vibrant-violet rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-6 transition-all duration-300 text-star-white font-bold text-2xl sm:text-3xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 w-full"
                >
                    <span className="text-6xl sm:text-7xl">🤝</span>
                    2 Jugadores (Local)
                </button>
            </div>

            <Footer />
        </div>
    );
};