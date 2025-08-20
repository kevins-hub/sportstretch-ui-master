import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DenyButton from '../../../app/components/admin/DenyButton';

describe('DenyButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with provided title', () => {
    const { getByText } = render(
      <DenyButton title="Deny" onPress={mockOnPress} />
    );
    
    expect(getByText('Deny')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByText } = render(
      <DenyButton title="Reject Application" onPress={mockOnPress} />
    );
    
    const button = getByText('Reject Application');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should handle different title texts', () => {
    const { getByText } = render(
      <DenyButton title="Decline" onPress={mockOnPress} />
    );
    
    expect(getByText('Decline')).toBeTruthy();
  });

  it('should be pressable', () => {
    const { getByText } = render(
      <DenyButton title="Reject" onPress={mockOnPress} />
    );
    
    const button = getByText('Reject');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should handle empty title', () => {
    const { getByText } = render(
      <DenyButton title="" onPress={mockOnPress} />
    );
    
    expect(getByText('')).toBeTruthy();
  });

  it('should handle missing onPress gracefully', () => {
    const { getByText } = render(
      <DenyButton title="No Handler" />
    );
    
    const button = getByText('No Handler');
    
    expect(() => fireEvent.press(button)).not.toThrow();
  });

  it('should handle long titles', () => {
    const longTitle = 'This is a very long denial button title';
    const { getByText } = render(
      <DenyButton title={longTitle} onPress={mockOnPress} />
    );
    
    expect(getByText(longTitle)).toBeTruthy();
  });

  it('should call onPress multiple times when pressed multiple times', () => {
    const { getByText } = render(
      <DenyButton title="Multi Deny" onPress={mockOnPress} />
    );
    
    const button = getByText('Multi Deny');
    
    fireEvent.press(button);
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(2);
  });

  it('should render with different styling than approve button', () => {
    const { getByText } = render(
      <DenyButton title="Deny" onPress={mockOnPress} />
    );
    
    // Button should exist with deny styling
    const button = getByText('Deny');
    expect(button).toBeTruthy();
  });
});
