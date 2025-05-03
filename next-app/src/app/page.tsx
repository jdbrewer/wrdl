'use client';

import { GameProvider } from '@/context/GameContext';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <GameProvider>
        <Game />
      </GameProvider>
    </main>
  );
}
