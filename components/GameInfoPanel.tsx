
import React, { useEffect, useRef } from 'react';
import { Player, CapturedPieces } from '../types';


interface GameInfoPanelProps {
  status: {
    displayMessage: string;
    winner: Player | null;
    isCheck: boolean;
  };
  capturedPieces: CapturedPieces;
  className?: string;
  isMobileOrTV?: boolean; // New prop
}

export const GameInfoPanel: React.FC<GameInfoPanelProps> = ({ status, capturedPieces, className, isMobileOrTV }) => {
  const statusColor = status.winner
    ? 'text-green-400'
    : status.isCheck
      ? 'text-accent-pink'
      : 'text-star-white';

  const panelClasses = `
    bg-mountain-shadow p-6 rounded-lg shadow-xl border border-ridge-border flex flex-col
    ${isMobileOrTV
      ? 'w-full landscape:w-auto landscape:flex-1 landscape:max-h-full text-sm landscape:text-xs portrait:h-auto portrait:max-h-[40vh]' // Adjusted for mobile/TV portrait
      : 'w-full lg:w-96 h-[50vh] lg:h-auto lg:max-h-[calc(100vh-200px)]'
    }
    ${className || ''}
  `;

  const titleClasses = `
    font-bold mb-4 border-b border-ridge-border pb-3 text-star-white
    ${isMobileOrTV ? 'text-xl landscape:text-lg' : 'text-3xl'}
  `;

  const textClasses = `
    font-semibold text-lavender-mist
    ${isMobileOrTV ? 'text-base landscape:text-sm' : 'text-xl'}
  `;

  const messageClasses = `
    font-bold transition-colors duration-300 ${statusColor}
    ${isMobileOrTV ? 'text-lg landscape:text-base' : 'text-2xl'}
  `;

  const imageClasses = `
    ${isMobileOrTV ? 'w-6 h-6' : 'w-8 h-8'}
  `;

  return (
    <div className={panelClasses}>
      <h2 className={titleClasses}>Información de la Partida</h2>

      <div className="mb-5">
        <p className={textClasses}>Estado</p>
        <p className={messageClasses}>{status.displayMessage}</p>
      </div>

      <div className="flex-grow overflow-y-auto">
        <p className={`${textClasses} mb-2`}>Piezas Capturadas</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(capturedPieces.b).map(([pieceType, count]) => (
            Array.from({ length: count }).map((_, i) => (
              <img
                key={`b${pieceType}${i}`}
                src={`/img/chesspieces/wikipedia/b${pieceType.toUpperCase()}.png`}
                alt={`Black ${pieceType}`}
                className={imageClasses}
              />
            ))
          ))}
          {Object.entries(capturedPieces.w).map(([pieceType, count]) => (
            Array.from({ length: count }).map((_, i) => (
              <img
                key={`w${pieceType}${i}`}
                src={`/img/chesspieces/wikipedia/w${pieceType.toUpperCase()}.png`}
                alt={`White ${pieceType}`}
                className={imageClasses}
              />
            ))
          ))}
        </div>
      </div>
    </div>
  );
};
