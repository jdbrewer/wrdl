import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusMessage, StatusMessages } from '../components/StatusMessage';
import { StatusMessage as StatusMessageType } from '../types/game';

describe('StatusMessage', () => {
  const mockMessage: StatusMessageType = {
    id: 1,
    text: 'Test message',
    type: 'info',
  };

  test('renders message text correctly', () => {
    render(<StatusMessage message={mockMessage} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('applies correct CSS class based on message type', () => {
    render(<StatusMessage message={mockMessage} />);
    const messageElement = screen.getByTestId('status-message-1');
    expect(messageElement).toHaveClass('info');
  });

  test('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(<StatusMessage message={mockMessage} onDismiss={onDismiss} />);
    
    fireEvent.click(screen.getByTestId('dismiss-message-1'));
    expect(onDismiss).toHaveBeenCalledWith(1);
  });

  test('does not render dismiss button when onDismiss is not provided', () => {
    render(<StatusMessage message={mockMessage} />);
    expect(screen.queryByTestId('dismiss-message-1')).not.toBeInTheDocument();
  });
});

describe('StatusMessages', () => {
  const mockMessages: StatusMessageType[] = [
    { id: 1, text: 'First message', type: 'error' },
    { id: 2, text: 'Second message', type: 'success' },
    { id: 3, text: 'Third message', type: 'info' },
  ];

  test('renders multiple messages correctly', () => {
    render(<StatusMessages messages={mockMessages} />);
    
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.getByText('Third message')).toBeInTheDocument();
  });

  test('applies correct CSS classes to each message', () => {
    render(<StatusMessages messages={mockMessages} />);
    
    expect(screen.getByTestId('status-message-1')).toHaveClass('error');
    expect(screen.getByTestId('status-message-2')).toHaveClass('success');
    expect(screen.getByTestId('status-message-3')).toHaveClass('info');
  });

  test('handles empty messages array', () => {
    render(<StatusMessages messages={[]} />);
    const container = screen.getByTestId('status-messages');
    expect(container).toBeEmptyDOMElement();
  });

  test('calls onDismiss for individual messages', () => {
    const onDismiss = jest.fn();
    render(<StatusMessages messages={mockMessages} onDismiss={onDismiss} />);
    
    fireEvent.click(screen.getByTestId('dismiss-message-2'));
    expect(onDismiss).toHaveBeenCalledWith(2);
  });
}); 