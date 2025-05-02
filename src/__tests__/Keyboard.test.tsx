import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Keyboard } from '../components/Keyboard';
import { LetterState } from '../types/game';

describe('Keyboard', () => {
  const mockKeyboardState: { [key: string]: LetterState } = {
    'A': 'correct',
    'B': 'present',
    'C': 'absent',
    'D': 'empty'
  };

  const mockOnKeyPress = jest.fn();

  beforeEach(() => {
    mockOnKeyPress.mockClear();
  });

  test('renders all keyboard rows', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    const rows = screen.getAllByTestId('keyboard-row');
    expect(rows).toHaveLength(3);
  });

  test('renders special keys correctly', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    const enterKey = screen.getByText('ENTER');
    expect(enterKey).toBeInTheDocument();
    
    const backspaceKey = screen.getByText('←');
    expect(backspaceKey).toBeInTheDocument();
  });

  test('applies correct styles based on key state', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    const keyA = screen.getByTestId('key-A');
    expect(keyA).toHaveClass('correct');
    
    const keyB = screen.getByTestId('key-B');
    expect(keyB).toHaveClass('present');
    
    const keyC = screen.getByTestId('key-C');
    expect(keyC).toHaveClass('absent');
  });

  test('calls onKeyPress with correct key when clicked', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    const keyA = screen.getByTestId('key-A');
    fireEvent.click(keyA);
    expect(mockOnKeyPress).toHaveBeenCalledWith('A');
    
    const enterKey = screen.getByText('ENTER');
    fireEvent.click(enterKey);
    expect(mockOnKeyPress).toHaveBeenCalledWith('ENTER');
  });

  test('handles physical keyboard letter key presses', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    act(() => {
      fireEvent.keyDown(document, { key: 'A' });
    });
    expect(mockOnKeyPress).toHaveBeenCalledWith('A');
    
    act(() => {
      fireEvent.keyDown(document, { key: 'a' }); // Lowercase should work too
    });
    expect(mockOnKeyPress).toHaveBeenCalledWith('A');
  });

  test('handles physical keyboard special key presses', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Enter' });
    });
    expect(mockOnKeyPress).toHaveBeenCalledWith('ENTER');
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Backspace' });
    });
    expect(mockOnKeyPress).toHaveBeenCalledWith('BACK');
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Delete' });
    });
    expect(mockOnKeyPress).toHaveBeenCalledWith('BACK');
  });

  test('ignores non-game keys', () => {
    render(<Keyboard onKeyPress={mockOnKeyPress} keyboardState={mockKeyboardState} />);
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Shift' });
    });
    expect(mockOnKeyPress).not.toHaveBeenCalled();
    
    act(() => {
      fireEvent.keyDown(document, { key: 'Control' });
    });
    expect(mockOnKeyPress).not.toHaveBeenCalled();
    
    act(() => {
      fireEvent.keyDown(document, { key: '1' });
    });
    expect(mockOnKeyPress).not.toHaveBeenCalled();
  });
}); 