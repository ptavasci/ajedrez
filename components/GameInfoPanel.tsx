
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
}

export const GameInfoPanel: React.FC<GameInfoPanelProps> = ({ status, capturedPieces, className }) => {
  const statusColor = status.winner
    ? 'text-green-400'
    : status.isCheck
      ? 'text-accent-pink'
      : 'text-star-white';

  return (
    <div className={`w-full lg:w-96 bg-mountain-shadow p-6 rounded-lg shadow-xl border border-ridge-border flex flex-col h-[50vh] lg:h-auto lg:max-h-[calc(100vh-200px)] ${className}`}>
      <h2 className="text-3xl font-bold mb-4 border-b border-ridge-border pb-3 text-star-white">Información de la Partida</h2>

      <div className="mb-5">
        <p className="text-xl font-semibold text-lavender-mist">Estado</p>
        <p className={`text-2xl font-bold transition-colors duration-300 ${statusColor}`}>{status.displayMessage}</p>
      </div>

      <div className="flex-grow overflow-y-auto">
        <p className="text-xl font-semibold text-lavender-mist mb-2">Piezas Capturadas</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(capturedPieces.b).map(([pieceType, count]) => (
            Array.from({ length: count }).map((_, i) => (
              <img
                key={`b${pieceType}${i}`}
                src={`/img/chesspieces/wikipedia/b${pieceType.toUpperCase()}.png`}
                alt={`Black ${pieceType}`}
                className="w-8 h-8"
              />
            ))
          ))}
          {Object.entries(capturedPieces.w).map(([pieceType, count]) => (
            Array.from({ length: count }).map((_, i) => (
              <img
                key={`w${pieceType}${i}`}
                src={`/img/chesspieces/wikipedia/w${pieceType.toUpperCase()}.png`}
                alt={`White ${pieceType}`}
                className="w-8 h-8"
              />
            ))
          ))}
        </div>
      </div>
    </div>
  );
};
