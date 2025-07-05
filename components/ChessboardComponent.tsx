import React, { useEffect, useRef } from 'react';
import { BoardConfig, Orientation } from '../types';

interface ChessboardComponentProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => boolean;
  orientation: Orientation;
  game: any; // The chess.js instance
}

export const ChessboardComponent: React.FC<ChessboardComponentProps> = ({ fen, onMove, orientation, game }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInstance = useRef<any>(null);

  // Effect for initializing and managing the board instance
  useEffect(() => {
    // Safeguard to ensure the legacy script has loaded.
    if (!boardRef.current || typeof window.Chessboard !== 'function') {
      return;
    }

    const onDragStart = (source: string, piece: string) => {
      // Do not pick up pieces if the game is over
      if (game.isGameOver()) return false;
      // Only pick up pieces for the side to move
      if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
      }
      return true;
    };

    const onDrop = (source: string, target: string): 'snapback' | void => {
      const moveSuccessful = onMove({
        from: source,
        to: target,
        promotion: 'q', // NOTE: always promote to a queen for simplicity
      });

      // If the move was illegal (as determined by the parent hook), snap the piece back.
      if (!moveSuccessful) {
        return 'snapback';
      }
    };

    const onSnapEnd = () => {
      // Ensure the board is always in sync with the game state after a move.
      if (boardInstance.current) {
        boardInstance.current.position(game.fen());
      }
    };

    const config: BoardConfig = {
      draggable: true,
      position: fen,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
      showNotation: true,
      orientation: orientation,
    };

    // Initialize the board using the global Chessboard function from the script tag
    if (!boardInstance.current) {
      boardInstance.current = window.Chessboard(boardRef.current, config);
    } else {
      // If the board already exists, just update its orientation and position
      boardInstance.current.orientation(orientation);
      boardInstance.current.position(fen, true); // Use true for smooth animation
    }

    const handleResize = () => {
      if (boardInstance.current) {
        boardInstance.current.resize();
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (boardInstance.current && typeof boardInstance.current.destroy === 'function') {
        boardInstance.current.destroy();
        boardInstance.current = null;
      }
    }

  }, [fen, orientation, onMove, game]);

  return <div ref={boardRef} className="w-full max-w-full aspect-square themed-board" />;
};