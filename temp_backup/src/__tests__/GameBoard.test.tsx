import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../components/GameBoard';
import { GameState } from '../types/game';

describe('GameBoard', () => {
  const mockGameState: GameState = {
    board: [
      [
        { letter: 'H', state: 'correct' },
        { letter: 'E', state: 'present' },
        { letter: 'L', state: 'absent' },
        { letter: 'L', state: 'empty' },
        { letter: 'O', state: 'empty' }
      ],
      ...Array(5).fill(Array(5).fill({ letter: '', state: 'empty' }))
    ],
    currentRow: 0,
    currentTile: 0,
    isGameOver: false,
    hasWon: false,
    targetWord: 'HELLO',
    keyboardState: {},
    statusMessages: []
  };

  test('renders game board', () => {
    render(<GameBoard board={mockGameState.board} />);
    const board = screen.getByTestId('game-board');
    expect(board).toBeInTheDocument();
  });

  test('renders correct number of rows', () => {
    render(<GameBoard board={mockGameState.board} />);
    const rows = screen.getAllByTestId('row');
    expect(rows).toHaveLength(6);
  });

  test('renders correct number of tiles per row', () => {
    render(<GameBoard board={mockGameState.board} />);
    const firstRow = screen.getAllByTestId('row')[0];
    const tiles = firstRow.querySelectorAll('[data-testid="tile"]');
    expect(tiles).toHaveLength(5);
  });

  test('displays letters in tiles', () => {
    render(<GameBoard board={mockGameState.board} />);
    const firstRow = screen.getAllByTestId('row')[0];
    const tiles = firstRow.querySelectorAll('[data-testid="tile"]');
    expect(tiles[0]).toHaveTextContent('H');
    expect(tiles[1]).toHaveTextContent('E');
    expect(tiles[2]).toHaveTextContent('L');
  });

  test('applies correct CSS classes based on tile state', () => {
    render(<GameBoard board={mockGameState.board} />);
    const firstRow = screen.getAllByTestId('row')[0];
    const tiles = firstRow.querySelectorAll('[data-testid="tile"]');
    
    expect(tiles[0]).toHaveClass('correct');
    expect(tiles[1]).toHaveClass('present');
    expect(tiles[2]).toHaveClass('absent');
    expect(tiles[3]).toHaveClass('empty');
  });

  test('applies flip animation to tiles with letters', () => {
    render(<GameBoard board={mockGameState.board} />);
    const firstRow = screen.getAllByTestId('row')[0];
    const tiles = firstRow.querySelectorAll('[data-testid="tile"]');
    
    expect(tiles[0]).toHaveClass('flip');
    expect(tiles[1]).toHaveClass('flip');
    expect(tiles[2]).toHaveClass('flip');
    expect(tiles[3]).not.toHaveClass('flip');
  });

  test('applies shake animation when word is invalid', () => {
    render(<GameBoard board={mockGameState.board} isInvalidWord={true} />);
    const board = screen.getByTestId('game-board');
    expect(board).toHaveClass('shake');
  });
}); 