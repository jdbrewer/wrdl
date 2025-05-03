import React, { createContext, useContext, useCallback, useReducer, useEffect, useState } from 'react';
import { GameState, LetterState, StatusMessage, StatusType } from '../types/game';
import { Dictionary } from '../utils/dictionary';

interface GameContextType {
  gameState: GameState;
  handleKeyPress: (key: string) => void;
  startNewGame: () => void;
  isInvalidWord: boolean;
}

type GameAction =
  | { type: 'ADD_LETTER'; payload: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'START_NEW_GAME' }
  | { type: 'ADD_STATUS_MESSAGE'; payload: Omit<StatusMessage, 'id'> }
  | { type: 'REMOVE_STATUS_MESSAGE'; payload: number };

const createEmptyBoard = () => Array(6).fill(null).map(() =>
  Array(5).fill(null).map(() => ({ letter: '', state: 'empty' as const }))
);

const createEmptyKeyboardState = () => {
  const state: { [key: string]: LetterState } = {};
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
    state[letter] = 'empty';
  });
  return state;
};

const dictionary = new Dictionary();

const getRandomWord = () => {
  const words = dictionary.getWords();
  return words[Math.floor(Math.random() * words.length)];
};

const createInitialState = (): GameState => ({
  board: createEmptyBoard(),
  currentRow: 0,
  currentTile: 0,
  isGameOver: false,
  hasWon: false,
  targetWord: getRandomWord(),
  keyboardState: createEmptyKeyboardState(),
  statusMessages: [],
});

const evaluateGuess = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  
  // First pass: mark correct letters
  guessLetters.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = '#'; // Mark as used
      guessLetters[i] = '*'; // Mark as processed
    }
  });
  
  // Second pass: mark present letters
  guessLetters.forEach((letter, i) => {
    if (letter === '*') return; // Skip processed letters
    const targetIndex = targetLetters.indexOf(letter);
    if (targetIndex !== -1) {
      result[i] = 'present';
      targetLetters[targetIndex] = '#'; // Mark as used
    }
  });
  
  return result;
};

const updateKeyboardState = (
  keyboardState: { [key: string]: LetterState },
  guess: string,
  evaluation: LetterState[]
): { [key: string]: LetterState } => {
  const newState = { ...keyboardState };
  
  guess.split('').forEach((letter, i) => {
    const currentState = newState[letter];
    const newEvaluation = evaluation[i];
    
    if (currentState === 'correct') return;
    if (currentState === 'present' && newEvaluation !== 'correct') return;
    
    newState[letter] = newEvaluation;
  });
  
  return newState;
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_STATUS_MESSAGE': {
      const newMessage: StatusMessage = {
        ...action.payload,
        id: Date.now(),
      };
      return {
        ...state,
        statusMessages: [...state.statusMessages, newMessage],
      };
    }

    case 'REMOVE_STATUS_MESSAGE': {
      return {
        ...state,
        statusMessages: state.statusMessages.filter(
          (msg) => msg.id !== action.payload
        ),
      };
    }

    case 'ADD_LETTER': {
      if (state.isGameOver) {
        return state;
      }
      if (state.currentTile >= 5) {
        return {
          ...state,
          statusMessages: [
            ...state.statusMessages,
            {
              text: 'Word must be 5 letters',
              type: 'error',
              id: Date.now(),
            },
          ],
        };
      }
      
      const newBoard = [...state.board];
      newBoard[state.currentRow] = [...newBoard[state.currentRow]];
      newBoard[state.currentRow][state.currentTile] = {
        letter: action.payload,
        state: 'empty'
      };
      
      return {
        ...state,
        board: newBoard,
        currentTile: state.currentTile + 1
      };
    }
    
    case 'REMOVE_LETTER': {
      if (state.isGameOver || state.currentTile <= 0) return state;
      
      const newBoard = [...state.board];
      newBoard[state.currentRow] = [...newBoard[state.currentRow]];
      newBoard[state.currentRow][state.currentTile - 1] = {
        letter: '',
        state: 'empty'
      };
      
      return {
        ...state,
        board: newBoard,
        currentTile: state.currentTile - 1
      };
    }
    
    case 'SUBMIT_GUESS': {
      if (state.isGameOver) return state;
      
      if (state.currentTile !== 5) {
        return {
          ...state,
          statusMessages: [
            ...state.statusMessages,
            {
              text: 'Not enough letters',
              type: 'error',
              id: Date.now(),
            },
          ],
        };
      }
      
      if (state.currentRow >= 6) return state;
      
      const currentGuess = state.board[state.currentRow]
        .map(tile => tile.letter)
        .join('');
      
      // Validate word
      if (!dictionary.isValidWord(currentGuess)) {
        return {
          ...state,
          statusMessages: [
            ...state.statusMessages,
            {
              text: 'Not in word list',
              type: 'error',
              id: Date.now(),
            },
          ],
        };
      }
      
      const evaluation = evaluateGuess(currentGuess, state.targetWord);
      const newBoard = [...state.board];
      newBoard[state.currentRow] = newBoard[state.currentRow].map((tile, i) => ({
        ...tile,
        state: evaluation[i]
      }));
      
      const hasWon = currentGuess === state.targetWord;
      const isGameOver = hasWon || state.currentRow === 5;
      
      let newStatusMessages = [...state.statusMessages];
      if (hasWon) {
        newStatusMessages.push({
          text: 'Magnificent!',
          type: 'success',
          id: Date.now(),
        });
      } else if (isGameOver) {
        newStatusMessages.push({
          text: `Game Over! The word was ${state.targetWord}`,
          type: 'info',
          id: Date.now(),
        });
      }
      
      return {
        ...state,
        board: newBoard,
        currentRow: state.currentRow + 1,
        currentTile: 0,
        isGameOver,
        hasWon,
        keyboardState: updateKeyboardState(
          state.keyboardState,
          currentGuess,
          evaluation
        ),
        statusMessages: newStatusMessages,
      };
    }
    
    case 'START_NEW_GAME':
      return {
        ...createInitialState(),
        statusMessages: [
          {
            text: 'New game started',
            type: 'info',
            id: Date.now(),
          },
        ],
      };
    
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [isInvalidWord, setIsInvalidWord] = useState(false);
  
  // Clean up expired messages
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    gameState.statusMessages.forEach((message) => {
      if (message.duration) {
        const timeout = setTimeout(() => {
          dispatch({ type: 'REMOVE_STATUS_MESSAGE', payload: message.id });
        }, message.duration);
        timeouts.push(timeout);
      }
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [gameState.statusMessages]);
  
  const handleKeyPress = useCallback((key: string) => {
    if (key === 'ENTER') {
      const currentGuess = gameState.board[gameState.currentRow]
        .map(tile => tile.letter)
        .join('');
      
      if (gameState.currentTile === 5 && !dictionary.isValidWord(currentGuess)) {
        setIsInvalidWord(true);
        setTimeout(() => setIsInvalidWord(false), 500);
      }
      dispatch({ type: 'SUBMIT_GUESS' });
    } else if (key === 'BACK') {
      dispatch({ type: 'REMOVE_LETTER' });
    } else if (/^[A-Z]$/.test(key)) {
      dispatch({ type: 'ADD_LETTER', payload: key });
    }
  }, [gameState]);
  
  const startNewGame = useCallback(() => {
    dispatch({ type: 'START_NEW_GAME' });
  }, []);
  
  return (
    <GameContext.Provider value={{ gameState, handleKeyPress, startNewGame, isInvalidWord }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 