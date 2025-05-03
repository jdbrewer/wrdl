'use client';

import React from 'react';
import { LetterState } from '@/types/game';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: { [key: string]: LetterState };
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

const getKeyColor = (state: LetterState) => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 text-white border-green-600';
    case 'present':
      return 'bg-yellow-400 text-white border-yellow-500';
    case 'absent':
      return 'bg-gray-400 text-white border-gray-500';
    case 'empty':
      return 'bg-gray-200 text-black border-2 border-gray-300';
  }
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardState }) => {
  return (
    <div className="mx-auto w-[420px] max-w-full flex flex-col items-center gap-2 pb-4">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row gap-2 w-full justify-center">
          {row.map((key) => {
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
            const state = isSpecialKey ? 'empty' : keyboardState[key];
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  flex items-center justify-center
                  rounded-md border font-bold uppercase
                  transition-all duration-150 ease-in-out
                  select-none
                  ${isSpecialKey ? 'w-[56px] h-12 text-xs' : 'w-12 h-14 text-base'}
                  ${getKeyColor(state)}
                  active:scale-95
                `}
              >
                {key === 'BACKSPACE' ? <span className="text-lg">⌫</span> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}; 