import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Move } from 'chess.js';
import { Player, PlayerType, Orientation, CapturedPieces } from '../types';
import { makeAiMove } from '../services/geminiService';
import { useSound } from './useSound';

interface ChessGameOptions {
  player1: PlayerType;
  player2: PlayerType;
}

export const useChessGame = (options: ChessGameOptions) => {
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(() => game.fen());
  const [orientation, setOrientation] = useState<Orientation>('white');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const captureSound = useSound('/sounds/capture.mp3');

  const playerTurn: Player = useMemo(() => game.turn(), [fen]);
  const players = useMemo(() => ({ w: options.player1, b: options.player2 }), [options]);

  const status = useMemo(() => {
    const isCheckmate = game.isCheckmate();
    const isDraw = game.isDraw();
    const isStalemate = game.isStalemate();
    const isThreefoldRepetition = game.isThreefoldRepetition();
    const isInsufficientMaterial = game.isInsufficientMaterial();

    let winner: Player | null = null;
    if (isCheckmate) {
      winner = playerTurn === 'w' ? 'b' : 'w';
    }

    let reason = '';
    if (isDraw) {
      if (isStalemate) reason = 'Rey ahogado';
      else if (isThreefoldRepetition) reason = 'Triple repetición';
      else if (isInsufficientMaterial) reason = 'Material insuficiente';
      else reason = 'Regla de los 50 movimientos';
    }

    let displayMessage = '';
    if (isCheckmate) {
      displayMessage = `¡Jaque mate! ${winner === 'w' ? 'Blancas' : 'Negras'} ganan.`;
    } else if (isDraw) {
      displayMessage = `¡Empate! (${reason})`;
    } else if (game.isCheck()) {
      displayMessage = `¡Jaque! Turno de las ${playerTurn === 'w' ? 'Blancas' : 'Negras'}`;
    } else {
      displayMessage = `Turno de las ${playerTurn === 'w' ? 'Blancas' : 'Negras'}`;
    }

    return {
      isCheckmate,
      isDraw: isDraw || isStalemate || isThreefoldRepetition || isInsufficientMaterial,
      isCheck: game.isCheck(),
      winner,
      reason,
      displayMessage, // New field
    };
  }, [game, playerTurn]);

  const capturedPieces = useMemo(() => {
    const history = game.history({ verbose: true });
    const captured: CapturedPieces = { w: {}, b: {} };

    history.forEach((move) => {
      if (move.captured) {
        const capturedColor = move.color === 'w' ? 'b' : 'w'; // If white moved, they captured a black piece
        captured[capturedColor][move.captured] = (captured[capturedColor][move.captured] || 0) + 1;
      }
    });
    return captured;
  }, [game, fen]); // Recalculate when game or fen changes

  const triggerAiMove = useCallback(async () => {
    if (status.isCheckmate || status.isDraw) return;

    setIsAiThinking(true);
    try {
      const currentFen = game.fen();
      const aiMove = await makeAiMove(currentFen);

      try {
        game.move(aiMove);
        setFen(game.fen());
      } catch (moveError) {
        console.error('AI made an invalid move:', aiMove, moveError);
        // Handle invalid move from AI, maybe try again or show an error
      }
    } catch (error) {
      console.error('Error getting AI move:', error);
      alert('Ocurrió un error al obtener el movimiento de la IA. Por favor, inténtalo de nuevo.');
    } finally {
      setIsAiThinking(false);
    }
  }, [game, status.isCheckmate, status.isDraw]);

  useEffect(() => {
    if (players[playerTurn] === 'ai' && !status.isCheckmate && !status.isDraw && !isAiThinking) {
      // Use a small timeout to make the AI's move feel more natural
      const timer = setTimeout(() => {
        triggerAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, status.isCheckmate, status.isDraw, players, isAiThinking, triggerAiMove]);

  const handleMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      try {
        const result: Move = game.move(move);
        setFen(game.fen());
        if (result.captured) {
          captureSound.play();
        }
        return true;
      } catch {
        // Invalid move, chess.js threw an error
        return false;
      }
    },
    [game, captureSound],
  );

  const resetGame = () => {
    game.reset();
    setFen(game.fen());
    setOrientation('white');
    setIsAiThinking(false);
  };

  const flipBoard = () => {
    setOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  return {
    game,
    fen,
    status,
    playerTurn,
    orientation,
    handleMove,
    resetGame,
    flipBoard,
    isAiThinking,
    capturedPieces, // Expose captured pieces
  };
};
