import React from 'react';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { StatusMessages } from './components/StatusMessage';
import { useGame } from './context/GameContext';
import styles from './styles/App.module.css';

const App: React.FC = () => {
  const { gameState, handleKeyPress, isInvalidWord } = useGame();

  const handleDismissMessage = (id: number) => {
    // The message will be automatically removed by the cleanup effect in GameContext
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Wordle Clone</h1>
      </header>
      <main className={styles.main}>
        <StatusMessages
          messages={gameState.statusMessages}
          onDismiss={handleDismissMessage}
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

export default App; 