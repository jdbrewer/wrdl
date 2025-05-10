import React, { useEffect, useState } from 'react';
import { GameBoard } from './GameBoard';
import { Keyboard } from './Keyboard';
import { StatusMessages } from './StatusMessage';
import { Confetti } from './Confetti';
import { useGame } from '@/context/GameContext';

const Game: React.FC = () => {
  const { gameState, handleKeyPress, isInvalidWord } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (gameState.hasWon) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Hide confetti after 5 seconds
      return () => clearTimeout(timer);
    } else {
      // Stop confetti immediately if game is no longer won
      setShowConfetti(false);
    }
  }, [gameState.hasWon]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <Confetti 
        isActive={showConfetti}
        height={0.1} // Appears from top third of screen
        pieces={300} // More pieces
        gravity={0.2} // Slower falling
        velocity={8} // Higher initial velocity
        colors={[
          '#FF6B6B', // Coral
          '#4ECDC4', // Turquoise
          '#45B7D1', // Sky blue
          '#96CEB4', // Sage
          '#FFEEAD', // Cream
        ]}
      />
      <header className="w-full text-center py-4">
        <h1 className="text-4xl font-bold uppercase">WRDL</h1>
      </header>
      <main className="flex flex-col items-center w-full gap-4">
        <StatusMessages
          messages={gameState.statusMessages}
        />
        <GameBoard 
          board={gameState.board} 
          isInvalidWord={isInvalidWord}
        />
        <Keyboard
          onKeyPress={handleKeyPress}
          keyboardState={gameState.keyboardState}
        />
      </main>
    </div>
  );
};

export default Game; 