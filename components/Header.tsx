import React from 'react';

interface HeaderProps {
  gameMode: 'human-vs-ai' | 'human-vs-human' | null;
  isMobileOrTV: boolean;
}

export const Header: React.FC<HeaderProps> = ({ gameMode, isMobileOrTV }) => {
  return (
    <header className={`text-center ${isMobileOrTV ? 'pt-4 mb-4' : 'mb-6'}`}>
      <h1 className="text-5xl font-bold tracking-wider text-star-white">Ajedrez</h1>
      <p className="text-xl text-lavender-mist">
        {gameMode === 'human-vs-ai'
          ? 'Juega contra un oponente de IA avanzado'
          : 'Juega contra un amigo en el mismo dispositivo'}
      </p>
    </header>
  );
};
