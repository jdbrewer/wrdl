export type LetterState = 'empty' | 'absent' | 'present' | 'correct';

export type StatusType = 'error' | 'success' | 'info';

export interface StatusMessage {
  text: string;
  type: StatusType;
  id: number; // For managing multiple messages
  duration?: number; // Optional duration in milliseconds
}

export interface Tile {
  letter: string;
  state: LetterState;
}

export type Row = Tile[];

export interface GameState {
  board: Array<Array<{ letter: string; state: LetterState }>>;
  currentRow: number;
  currentTile: number;
  isGameOver: boolean;
  hasWon: boolean;
  targetWord: string;
  keyboardState: { [key: string]: LetterState };
  statusMessages: StatusMessage[];
}

export type KeyboardKey = {
  key: string;
  width?: number; // Width multiplier for special keys
  isAction?: boolean; // For Enter and Backspace keys
};

export type KeyboardRow = KeyboardKey[]; 