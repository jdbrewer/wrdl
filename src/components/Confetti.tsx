'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

interface ConfettiProps {
  isActive: boolean;
  // Optional customization props
  height?: number; // 0-1, where 1 is full height
  pieces?: number;
  gravity?: number;
  velocity?: number;
  colors?: string[];
}

export const Confetti: React.FC<ConfettiProps> = ({ 
  isActive,
  height = 0.5,    // Default to middle of screen
  pieces = 200,
  gravity = 0.3,
  velocity = 5,
  colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
}) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isActive) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={pieces}
      gravity={gravity}
      initialVelocityY={velocity}
      colors={colors}
      confettiSource={{
        x: windowSize.width / 2,
        y: windowSize.height * height, // Use the height prop
        w: 0,
        h: 0,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  );
}; 