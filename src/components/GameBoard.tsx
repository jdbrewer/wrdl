import React, { useEffect, useState } from 'react';
import styles from '../styles/GameBoard.module.css';
import { LetterState } from '../types/game';

interface GameBoardProps {
  board: Array<Array<{ letter: string; state: LetterState }>>;
  isInvalidWord?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, isInvalidWord }) => {
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set());
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isInvalidWord) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isInvalidWord]);

  useEffect(() => {
    // Track tiles that need to be animated
    const newAnimatingTiles = new Set<string>();
    board.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        if (tile.letter && tile.state !== 'empty') {
          newAnimatingTiles.add(`${rowIndex}-${tileIndex}`);
        }
      });
    });
    setAnimatingTiles(newAnimatingTiles);
  }, [board]);

  return (
    <div className={`${styles.board} ${isShaking ? styles.shake : ''}`} data-testid="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row} data-testid="row">
          {row.map((tile, tileIndex) => {
            const tileKey = `${rowIndex}-${tileIndex}`;
            const isAnimating = animatingTiles.has(tileKey);
            return (
              <div
                key={tileIndex}
                className={`${styles.tile} ${styles[tile.state]} ${
                  isAnimating ? styles.flip : ''
                }`}
                data-testid="tile"
              >
                {tile.letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}; 