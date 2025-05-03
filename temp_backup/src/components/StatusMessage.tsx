import React from 'react';
import styles from '../styles/StatusMessage.module.css';
import { StatusMessage as StatusMessageType } from '../types/game';

interface StatusMessageProps {
  message: StatusMessageType;
  onDismiss?: (id: number) => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message, onDismiss }) => {
  return (
    <div 
      className={`${styles.message} ${styles[message.type]}`}
      role="alert"
      data-testid={`status-message-${message.id}`}
    >
      <span>{message.text}</span>
      {onDismiss && (
        <button
          onClick={() => onDismiss(message.id)}
          className={styles.dismiss}
          aria-label="Dismiss message"
          data-testid={`dismiss-message-${message.id}`}
        >
          ×
        </button>
      )}
    </div>
  );
};

export const StatusMessages: React.FC<{
  messages: StatusMessageType[];
  onDismiss?: (id: number) => void;
}> = ({ messages, onDismiss }) => {
  return (
    <div className={styles.container} role="log" aria-live="polite" data-testid="status-messages">
      {messages.map((message) => (
        <StatusMessage
          key={message.id}
          message={message}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}; 