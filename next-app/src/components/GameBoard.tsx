'use client';

import React from 'react';
import { Board, Tile } from '@/types/game';

interface GameBoardProps {
  board: Board;
  isInvalidWord: boolean;
}

const getTileColor = (state: Tile['state']) => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 text-white border-green-600 shadow-tile';
    case 'present':
      return 'bg-yellow-400 text-white border-yellow-500 shadow-tile';
    case 'absent':
      return 'bg-gray-400 text-white border-gray-500 shadow-tile';
    case 'empty':
      return 'bg-white text-black border-2 border-gray-300';
  }
};

export const GameBoard: React.FC<GameBoardProps> = ({ board, isInvalidWord }) => {
  console.log(board);
  return (
    <div className="mx-auto w-[420px] max-w-full flex flex-col items-center justify-center gap-2 py-8">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row gap-2 w-full justify-center">
          {row.map((tile, tileIndex) => (
            <div
              key={tileIndex}
              className={`
                flex items-center justify-center
                w-16 h-16
                rounded-xl border-2 font-extrabold text-3xl tracking-widest uppercase
                transition-all duration-300 ease-in-out
                ${getTileColor(tile.state)}
                ${isInvalidWord && rowIndex === board.length - 1 ? 'animate-shake' : ''}
                select-none
              `}
            >
              {tile.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}; 