import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookButton from '../../../app/components/athlete/BookButton';

describe('BookButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with provided title', () => {
    const { getByText } = render(
      <BookButton title="Book Now" onPress={mockOnPress} />
    );
    
    expect(getByText('Book Now')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByText } = render(
      <BookButton title="Book Appointment" onPress={mockOnPress} />
    );
    
    const button = getByText('Book Appointment');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should handle different title texts', () => {
    const { getByText } = render(
      <BookButton title="Schedule Session" onPress={mockOnPress} />
    );
    
    expect(getByText('Schedule Session')).toBeTruthy();
  });

  it('should be pressable', () => {
    const { getByText } = render(
      <BookButton title="Test Button" onPress={mockOnPress} />
    );
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should handle empty title', () => {
    const { getByText } = render(
      <BookButton title="" onPress={mockOnPress} />
    );
    
    // Should still render the button structure even with empty title
    expect(getByText('')).toBeTruthy();
  });

  it('should handle missing onPress gracefully', () => {
    const { getByText } = render(
      <BookButton title="No Handler" />
    );
    
    const button = getByText('No Handler');
    
    // Should not crash when pressed without handler
    expect(() => fireEvent.press(button)).not.toThrow();
  });
});
