export type LetterState = 'empty' | 'absent' | 'present' | 'correct';

export interface Tile {
  letter: string;
  state: LetterState;
}

export type Board = Tile[][];

export interface StatusMessage {
  id: number;
  text: string;
  type: 'error' | 'success' | 'info';
}

export interface GameState {
  board: Board;
  currentRow: number;
  currentTile: number;
  isGameOver: boolean;
  hasWon: boolean;
  targetWord: string;
  keyboardState: { [key: string]: LetterState };
  statusMessages: StatusMessage[];
} 