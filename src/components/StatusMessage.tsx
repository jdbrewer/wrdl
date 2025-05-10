'use client';

import React from 'react';
import { StatusMessage as StatusMessageType } from '@/types/game';

interface StatusMessagesProps {
  messages: StatusMessageType[];
}

const getMessageColor = (type: StatusMessageType['type']) => {
  switch (type) {
    case 'error':
      return 'bg-red-500';
    case 'success':
      return 'bg-green-500';
    case 'info':
      return 'bg-blue-500';
  }
};

export const StatusMessages: React.FC<StatusMessagesProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${getMessageColor(message.type)} text-white px-4 py-2 rounded shadow-lg mb-2 animate-fade-in`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}; 