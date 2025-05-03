'use client';

import React, { createContext, useContext, useCallback, useReducer, useEffect, useState } from 'react';
import { GameState, LetterState, StatusMessage } from '@/types/game';
import { Dictionary } from '@/utils/dictionary';

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
  | { type: 'REMOVE_STATUS_MESSAGE'; payload: number }
  | { type: 'INITIALIZE'; payload: GameState };

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

const createEmptyInitialState = (): GameState => ({
  board: createEmptyBoard(),
  currentRow: 0,
  currentTile: 0,
  isGameOver: false,
  hasWon: false,
  targetWord: '',
  keyboardState: createEmptyKeyboardState(),
  statusMessages: [],
});

const dictionary = new Dictionary();

const getRandomWord = async () => {
  return await dictionary.getRandomWord();
};

const createInitialState = async (): Promise<GameState> => {
  await dictionary.initialize();
  const targetWord = await getRandomWord();
  return {
    board: createEmptyBoard(),
    currentRow: 0,
    currentTile: 0,
    isGameOver: false,
    hasWon: false,
    targetWord,
    keyboardState: createEmptyKeyboardState(),
    statusMessages: [],
  };
};

const evaluateGuess = (guess: string, target: string): LetterState[] => {
  console.log('Evaluating guess:', guess, 'against target:', target);
  const result: LetterState[] = Array(5).fill('absent');
  const targetLetters = target.toLowerCase().split('');
  const guessLetters = guess.toLowerCase().split('');
  
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
  
  console.log('Evaluation result:', result);
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
    case 'INITIALIZE': {
      return action.payload;
    }

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
      
      const newKeyboardState = updateKeyboardState(
        state.keyboardState,
        currentGuess,
        evaluation
      );
      
      const hasWon = evaluation.every(state => state === 'correct');
      const isGameOver = hasWon || state.currentRow === 5;
      
      if (hasWon) {
        return {
          ...state,
          board: newBoard,
          currentRow: state.currentRow + 1,
          currentTile: 0,
          isGameOver,
          hasWon,
          keyboardState: newKeyboardState,
          statusMessages: [
            ...state.statusMessages,
            {
              text: 'Congratulations! You won!',
              type: 'success',
              id: Date.now(),
            },
          ],
        };
      }
      
      if (isGameOver) {
        return {
          ...state,
          board: newBoard,
          currentRow: state.currentRow + 1,
          currentTile: 0,
          isGameOver,
          keyboardState: newKeyboardState,
          statusMessages: [
            ...state.statusMessages,
            {
              text: `Game Over! The word was ${state.targetWord}`,
              type: 'info',
              id: Date.now(),
            },
          ],
        };
      }
      
      return {
        ...state,
        board: newBoard,
        currentRow: state.currentRow + 1,
        currentTile: 0,
        keyboardState: newKeyboardState,
      };
    }
    
    case 'START_NEW_GAME': {
      return createEmptyInitialState();
    }
    
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, createEmptyInitialState());
  const [isInvalidWord, setIsInvalidWord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const initialState = await createInitialState();
        dispatch({ type: 'INITIALIZE', payload: initialState });
      } catch (error) {
        console.error('Failed to initialize game:', error);
        // Fallback to a default word if initialization fails
        dispatch({ 
          type: 'INITIALIZE', 
          payload: {
            ...createEmptyInitialState(),
            targetWord: 'APPLE' // Fallback word
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  const handleKeyPress = useCallback(async (key: string) => {
    if (state.isGameOver) return;
    
    if (key === 'ENTER') {
      const currentGuess = state.board[state.currentRow]
        .map(tile => tile.letter)
        .join('');
      
      console.log('Current guess:', currentGuess);
      console.log('Target word:', state.targetWord);
      
      if (state.currentTile === 5) {
        const isValid = await dictionary.isValidWord(currentGuess);
        console.log('Is valid word:', isValid);
        
        if (!isValid) {
          setIsInvalidWord(true);
          setTimeout(() => setIsInvalidWord(false), 500);
          dispatch({
            type: 'ADD_STATUS_MESSAGE',
            payload: {
              text: 'Not in word list',
              type: 'error',
            },
          });
          return;
        }
      }
      dispatch({ type: 'SUBMIT_GUESS' });
    } else if (key === 'BACKSPACE') {
      dispatch({ type: 'REMOVE_LETTER' });
    } else if (/^[A-Z]$/.test(key)) {
      dispatch({ type: 'ADD_LETTER', payload: key });
    }
  }, [state]);

  const startNewGame = useCallback(() => {
    dispatch({ type: 'START_NEW_GAME' });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.statusMessages.length > 0) {
        dispatch({
          type: 'REMOVE_STATUS_MESSAGE',
          payload: state.statusMessages[0].id,
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.statusMessages]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <GameContext.Provider
      value={{
        gameState: state,
        handleKeyPress,
        startNewGame,
        isInvalidWord,
      }}
    >
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