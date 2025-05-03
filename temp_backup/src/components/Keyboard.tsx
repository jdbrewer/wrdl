import React, { useEffect, useCallback } from 'react';
import { KeyboardRow, LetterState } from '../types/game';
import styles from '../styles/Keyboard.module.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: { [key: string]: LetterState };
}

const KEYBOARD_LAYOUT: KeyboardRow[] = [
  [
    { key: 'Q' },
    { key: 'W' },
    { key: 'E' },
    { key: 'R' },
    { key: 'T' },
    { key: 'Y' },
    { key: 'U' },
    { key: 'I' },
    { key: 'O' },
    { key: 'P' },
  ],
  [
    { key: 'A' },
    { key: 'S' },
    { key: 'D' },
    { key: 'F' },
    { key: 'G' },
    { key: 'H' },
    { key: 'J' },
    { key: 'K' },
    { key: 'L' },
  ],
  [
    { key: 'ENTER', width: 1.5, isAction: true },
    { key: 'Z' },
    { key: 'X' },
    { key: 'C' },
    { key: 'V' },
    { key: 'B' },
    { key: 'N' },
    { key: 'M' },
    { key: 'BACK', width: 1.5, isAction: true },
  ],
];

// Map physical keys to game keys
const KEY_MAP: { [key: string]: string } = {
  'Enter': 'ENTER',
  'Backspace': 'BACK',
  'Delete': 'BACK',
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardState }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    
    // Check if it's a letter key
    if (key.length === 1 && /[A-Z]/.test(key)) {
      event.preventDefault();
      onKeyPress(key);
      return;
    }

    // Check if it's a special key
    const mappedKey = KEY_MAP[event.key];
    if (mappedKey) {
      event.preventDefault();
      onKeyPress(mappedKey);
    }
  }, [onKeyPress]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const getKeyClassName = (key: string): string => {
    const baseClass = styles.key;
    const state = keyboardState[key];
    if (!state || state === 'empty') return baseClass;

    return `${baseClass} ${styles[state]}`;
  };

  return (
    <div className={styles.keyboard} data-testid="keyboard">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row} data-testid="keyboard-row">
          {row.map(({ key, width = 1, isAction }) => (
            <button
              key={key}
              className={getKeyClassName(key)}
              style={{ flex: width }}
              onClick={() => onKeyPress(key)}
              data-testid={`key-${key}`}
              aria-label={key}
            >
              {key === 'BACK' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}; 