import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ApproveButton from '../../../app/components/admin/ApproveButton';

describe('ApproveButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with provided title', () => {
    const { getByText } = render(
      <ApproveButton title="Approve" onPress={mockOnPress} />
    );
    
    expect(getByText('Approve')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByText } = render(
      <ApproveButton title="Approve Therapist" onPress={mockOnPress} />
    );
    
    const button = getByText('Approve Therapist');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should handle different title texts', () => {
    const { getByText } = render(
      <ApproveButton title="Accept Application" onPress={mockOnPress} />
    );
    
    expect(getByText('Accept Application')).toBeTruthy();
  });

  it('should be pressable', () => {
    const { getByText } = render(
      <ApproveButton title="Confirm" onPress={mockOnPress} />
    );
    
    const button = getByText('Confirm');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should handle empty title', () => {
    const { getByText } = render(
      <ApproveButton title="" onPress={mockOnPress} />
    );
    
    expect(getByText('')).toBeTruthy();
  });

  it('should handle missing onPress gracefully', () => {
    const { getByText } = render(
      <ApproveButton title="No Handler" />
    );
    
    const button = getByText('No Handler');
    
    expect(() => fireEvent.press(button)).not.toThrow();
  });

  it('should handle long titles', () => {
    const longTitle = 'This is a very long approval button title';
    const { getByText } = render(
      <ApproveButton title={longTitle} onPress={mockOnPress} />
    );
    
    expect(getByText(longTitle)).toBeTruthy();
  });

  it('should call onPress multiple times when pressed multiple times', () => {
    const { getByText } = render(
      <ApproveButton title="Multi Press" onPress={mockOnPress} />
    );
    
    const button = getByText('Multi Press');
    
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });
});
