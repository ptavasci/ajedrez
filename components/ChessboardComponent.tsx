import React, { useEffect, useRef, useState } from 'react';
import { BoardConfig, Orientation } from '../types';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ChessboardComponentProps {
  fen: string;
  onMove: (move: { from: string; to: string; promotion?: string }) => boolean;
  orientation: Orientation;
  game: any; // The chess.js instance
}

export const ChessboardComponent: React.FC<ChessboardComponentProps> = ({
  fen,
  onMove,
  orientation,
  game,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInstance = useRef<any>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [focusedSquare, setFocusedSquare] = useState<string | null>(null); // New state for TV navigation
  const { isTouch, isTV } = useDeviceDetection();

  // onSquareClick handler for tap-to-move and D-pad selection
  const onSquareClick = (square: string) => {
    if (game.isGameOver()) return;

    if (selectedSquare) {
      // Second click: attempt to move the piece
      const moveSuccessful = onMove({
        from: selectedSquare,
        to: square,
        promotion: 'q', // NOTE: always promote to a queen for simplicity
      });

      if (moveSuccessful) {
        setSelectedSquare(null); // Clear selection on successful move
      } else {
        // If invalid move, check if the new click is on a piece of the same color
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square); // Select new piece
        } else {
          setSelectedSquare(null); // Deselect if invalid move to empty square or opponent's piece
        }
      }
    } else {
      // First click: select a piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      }
    }
  };

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
      draggable: !isTouch && !isTV, // Enable drag-and-drop only if not touchscreen and not TV
      position: fen,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
      showNotation: true,
      orientation: orientation,
      onSquareClick: isTouch || isTV ? onSquareClick : undefined, // Only add onSquareClick if touchscreen or TV
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
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (boardInstance.current && typeof boardInstance.current.destroy === 'function') {
        boardInstance.current.destroy();
        boardInstance.current = null;
      }
    };
  }, [fen, orientation, onMove, game, isTouch, isTV, onSquareClick]); // Updated dependencies

  // Effect for TV D-pad navigation
  useEffect(() => {
    if (!isTV || !boardInstance.current) {
      return;
    }

    // Initialize focused square if not set
    if (!focusedSquare) {
      setFocusedSquare(orientation === 'white' ? 'e2' : 'e7'); // Start at a common pawn square
    }

    const getSquareInDirection = (
      current: string,
      direction: 'up' | 'down' | 'left' | 'right',
    ): string => {
      const file = current.charCodeAt(0); // 'a' -> 97
      const rank = parseInt(current[1]); // '1' -> 1

      let newFile = file;
      let newRank = rank;

      switch (direction) {
        case 'up':
          newRank = orientation === 'white' ? rank + 1 : rank - 1;
          break;
        case 'down':
          newRank = orientation === 'white' ? rank - 1 : rank + 1;
          break;
        case 'left':
          newFile = orientation === 'white' ? file - 1 : file + 1;
          break;
        case 'right':
          newFile = orientation === 'white' ? file + 1 : file - 1;
          break;
      }

      // Ensure new square is within bounds
      if (
        newFile >= 'a'.charCodeAt(0) &&
        newFile <= 'h'.charCodeAt(0) &&
        newRank >= 1 &&
        newRank <= 8
      ) {
        return String.fromCharCode(newFile) + newRank;
      }
      return current; // Stay on current square if out of bounds
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!boardInstance.current) return;

      let nextSquare = focusedSquare;

      switch (event.key) {
        case 'ArrowUp':
          nextSquare = getSquareInDirection(
            focusedSquare || (orientation === 'white' ? 'e2' : 'e7'),
            'up',
          );
          break;
        case 'ArrowDown':
          nextSquare = getSquareInDirection(
            focusedSquare || (orientation === 'white' ? 'e2' : 'e7'),
            'down',
          );
          break;
        case 'ArrowLeft':
          nextSquare = getSquareInDirection(
            focusedSquare || (orientation === 'white' ? 'e2' : 'e7'),
            'left',
          );
          break;
        case 'ArrowRight':
          nextSquare = getSquareInDirection(
            focusedSquare || (orientation === 'white' ? 'e2' : 'e7'),
            'right',
          );
          break;
        case 'Enter':
          if (focusedSquare) {
            onSquareClick(focusedSquare);
          }
          break;
        default:
          return; // Do not prevent default for other keys
      }

      if (nextSquare && nextSquare !== focusedSquare) {
        setFocusedSquare(nextSquare);
        event.preventDefault(); // Prevent default scroll behavior
      } else if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action for Enter
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTV, focusedSquare, orientation, onSquareClick]); // Added onSquareClick to dependencies

  // Effect to highlight focused and selected squares
  useEffect(() => {
    if (boardInstance.current) {
      // Clear all existing highlights/markers
      // Assuming chessboard.js has a way to remove all markers or specific ones
      // If not, we'd need to manually remove classes from DOM elements.
      // For now, let's assume a 'clearMarkers' or similar method.
      // If not, we'll need to add a custom function to clear classes.
      const allSquares = [
        'a1',
        'a2',
        'a3',
        'a4',
        'a5',
        'a6',
        'a7',
        'a8',
        'b1',
        'b2',
        'b3',
        'b4',
        'b5',
        'b6',
        'b7',
        'b8',
        'c1',
        'c2',
        'c3',
        'c4',
        'c5',
        'c6',
        'c7',
        'c8',
        'd1',
        'd2',
        'd3',
        'd4',
        'd5',
        'd6',
        'd7',
        'd8',
        'e1',
        'e2',
        'e3',
        'e4',
        'e5',
        'e6',
        'e7',
        'e8',
        'f1',
        'f2',
        'f3',
        'f4',
        'f5',
        'f6',
        'f7',
        'f8',
        'g1',
        'g2',
        'g3',
        'g4',
        'g5',
        'g6',
        'g7',
        'g8',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'h7',
        'h8',
      ];
      allSquares.forEach((sq) => {
        const squareEl = boardRef.current?.querySelector(`.square-${sq}`);
        if (squareEl) {
          squareEl.classList.remove('highlight-focused', 'highlight-selected');
        }
      });

      if (focusedSquare && isTV) {
        const squareEl = boardRef.current?.querySelector(`.square-${focusedSquare}`);
        if (squareEl) {
          squareEl.classList.add('highlight-focused');
        }
      }

      if (selectedSquare) {
        const squareEl = boardRef.current?.querySelector(`.square-${selectedSquare}`);
        if (squareEl) {
          squareEl.classList.add('highlight-selected');
        }
      }
    }
  }, [focusedSquare, selectedSquare, isTV]);

  return <div ref={boardRef} className="w-full max-w-full aspect-square themed-board" />;
};
