import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameProvider, useGame } from '../context/GameContext';

const TestComponent: React.FC = () => {
  const { gameState, handleKeyPress, startNewGame } = useGame();
  
  return (
    <div>
      <div data-testid="current-row">{gameState.currentRow}</div>
      <div data-testid="current-tile">{gameState.currentTile}</div>
      <div data-testid="is-game-over">{gameState.isGameOver.toString()}</div>
      <div data-testid="has-won">{gameState.hasWon.toString()}</div>
      <div data-testid="target-word">{gameState.targetWord}</div>
      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
        <button 
          key={letter} 
          onClick={() => handleKeyPress(letter)} 
          data-testid={`press-${letter.toLowerCase()}`}
        >
          Press {letter}
        </button>
      ))}
      <button onClick={() => handleKeyPress('BACK')} data-testid="press-back">Press Back</button>
      <button onClick={() => handleKeyPress('ENTER')} data-testid="press-enter">Press Enter</button>
      <button onClick={startNewGame} data-testid="new-game">New Game</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <GameProvider>
      <TestComponent />
    </GameProvider>
  );
};

describe('GameContext', () => {
  test('initializes with correct state', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('current-row')).toHaveTextContent('0');
    expect(screen.getByTestId('current-tile')).toHaveTextContent('0');
    expect(screen.getByTestId('is-game-over')).toHaveTextContent('false');
    expect(screen.getByTestId('has-won')).toHaveTextContent('false');
  });

  test('handles letter input correctly', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByTestId('press-a'));
    expect(screen.getByTestId('current-tile')).toHaveTextContent('1');
  });

  test('handles backspace correctly', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByTestId('press-a'));
    fireEvent.click(screen.getByTestId('press-back'));
    expect(screen.getByTestId('current-tile')).toHaveTextContent('0');
  });

  test('prevents adding more than 5 letters per row', () => {
    renderWithProvider();
    
    // Add 6 letters
    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByTestId('press-a'));
    }
    
    expect(screen.getByTestId('current-tile')).toHaveTextContent('5');
  });

  test('handles enter with incomplete word', () => {
    renderWithProvider();
    
    // Add 3 letters (incomplete word)
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByTestId('press-a'));
    }
    
    fireEvent.click(screen.getByTestId('press-enter'));
    expect(screen.getByTestId('current-row')).toHaveTextContent('0');
  });

  test('rejects invalid words', () => {
    renderWithProvider();
    
    // Type an invalid word (ABCDE)
    fireEvent.click(screen.getByTestId('press-a'));
    fireEvent.click(screen.getByTestId('press-b'));
    fireEvent.click(screen.getByTestId('press-c'));
    fireEvent.click(screen.getByTestId('press-d'));
    fireEvent.click(screen.getByTestId('press-e'));
    
    fireEvent.click(screen.getByTestId('press-enter'));
    expect(screen.getByTestId('current-row')).toHaveTextContent('0');
  });

  test('accepts valid words', () => {
    renderWithProvider();
    
    // Type a valid word (APPLE)
    fireEvent.click(screen.getByTestId('press-a'));
    fireEvent.click(screen.getByTestId('press-p'));
    fireEvent.click(screen.getByTestId('press-p'));
    fireEvent.click(screen.getByTestId('press-l'));
    fireEvent.click(screen.getByTestId('press-e'));
    
    fireEvent.click(screen.getByTestId('press-enter'));
    expect(screen.getByTestId('current-row')).toHaveTextContent('1');
  });

  test('handles winning game', () => {
    renderWithProvider();
    const targetWord = screen.getByTestId('target-word').textContent;
    
    // Type the target word
    for (const letter of targetWord!) {
      fireEvent.click(screen.getByTestId(`press-${letter.toLowerCase()}`));
    }
    
    fireEvent.click(screen.getByTestId('press-enter'));
    expect(screen.getByTestId('has-won')).toHaveTextContent('true');
    expect(screen.getByTestId('is-game-over')).toHaveTextContent('true');
  });

  test('starts new game correctly', () => {
    renderWithProvider();
    
    // Play some moves
    fireEvent.click(screen.getByTestId('press-a'));
    fireEvent.click(screen.getByTestId('press-a'));
    
    // Start new game
    fireEvent.click(screen.getByTestId('new-game'));
    
    expect(screen.getByTestId('current-row')).toHaveTextContent('0');
    expect(screen.getByTestId('current-tile')).toHaveTextContent('0');
    expect(screen.getByTestId('is-game-over')).toHaveTextContent('false');
    expect(screen.getByTestId('has-won')).toHaveTextContent('false');
  });
}); 