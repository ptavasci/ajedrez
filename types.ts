// Add chessboard.js and jQuery to the window object for TypeScript
declare global {
  interface Window {
    jQuery: any;
    $: any;
    Chessboard: (containerElOrId: string | HTMLElement, config: BoardConfig) => any;
  }
}

export type Player = 'w' | 'b';
export enum PlayerType {
  Human = 'human',
  AI = 'ai',
}
export type Orientation = 'white' | 'black';

export type GameStatus = 'in-progress' | 'checkmate' | 'draw' | 'stalemate' | 'threefold-repetition' | 'insufficient-material';

export type CapturedPieces = {
  w: { [key: string]: number }; // e.g., { 'p': 5, 'n': 1 }
  b: { [key: string]: number };
};

// Simplified types for chessboard.js configuration
export type BoardPosition = { [square: string]: string };

export type BoardConfig = {
  position?: string | BoardPosition;
  orientation?: Orientation;
  draggable?: boolean;
  dropOffBoard?: 'snapback' | 'trash';
  pieceTheme?: string | ((piece: string) => string);
  onDragStart?: (source: string, piece: string, position: BoardPosition, orientation: Orientation) => boolean;
  onDrop?: (source: string, target: string, piece: string, newPos: BoardPosition, oldPos: BoardPosition, orientation: Orientation) => 'snapback' | void;
  onSnapEnd?: () => void;
  onSquareClick?: (square: string) => void; // Add onSquareClick
  sparePieces?: boolean;
  showNotation?: boolean;
};