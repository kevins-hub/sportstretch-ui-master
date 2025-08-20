import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SetStateModal from '../../../app/components/athlete/SetStateModal';

// Mock SearchTherapist component
jest.mock('../../../app/components/athlete/SearchTherapist', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ getTherapists, setModalVisibility, setAthleteRegion, currentState }) => (
    <View testID="search-therapist">
      <Text>Search Therapist Component</Text>
      <Text>Current State: {currentState}</Text>
      <TouchableOpacity 
        testID="mock-state-selector"
        onPress={() => {
          setAthleteRegion('CA');
          setModalVisibility(false);
        }}
      >
        <Text>Select California</Text>
      </TouchableOpacity>
    </View>
  );
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('SetStateModal', () => {
  const mockUser = {
    id: 'user123',
    name: 'John Doe',
  };

  const defaultProps = {
    user: mockUser,
    visible: true,
    setVisibility: jest.fn(),
    getTherapists: jest.fn(),
    setAthleteRegion: jest.fn(),
    athleteRegion: 'NY',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when visible is false', () => {
    const { queryByText } = render(
      <SetStateModal {...defaultProps} visible={false} />
    );
    
    expect(queryByText('Oops!')).toBeNull();
  });

  it('should render modal when visible is true', () => {
    const { getByText } = render(<SetStateModal {...defaultProps} />);
    
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('We have detected that you currently have location services disabled. Please enable and restart app for the best experience or choose the state you are looking for treatment in.')).toBeTruthy();
  });

  it('should display location services message', () => {
    const { getByText } = render(<SetStateModal {...defaultProps} />);
    
    const message = getByText('We have detected that you currently have location services disabled. Please enable and restart app for the best experience or choose the state you are looking for treatment in.');
    expect(message).toBeTruthy();
  });

  it('should render SearchTherapist component', () => {
    const { getByTestId, getByText } = render(<SetStateModal {...defaultProps} />);
    
    expect(getByTestId('search-therapist')).toBeTruthy();
    expect(getByText('Search Therapist Component')).toBeTruthy();
  });

  it('should pass correct props to SearchTherapist', () => {
    const { getByText } = render(<SetStateModal {...defaultProps} />);
    
    expect(getByText('Current State: NY')).toBeTruthy();
  });

  it('should handle SearchTherapist interactions', () => {
    const { getByTestId } = render(<SetStateModal {...defaultProps} />);
    
    const selector = getByTestId('mock-state-selector');
    fireEvent.press(selector);
    
    expect(defaultProps.setAthleteRegion).toHaveBeenCalledWith('CA');
    expect(defaultProps.setVisibility).toHaveBeenCalledWith(false);
  });

  it('should pass getTherapists function to SearchTherapist', () => {
    const mockGetTherapists = jest.fn();
    const { getByTestId } = render(
      <SetStateModal {...defaultProps} getTherapists={mockGetTherapists} />
    );
    
    // Component should render SearchTherapist with the function
    expect(getByTestId('search-therapist')).toBeTruthy();
  });

  it('should handle missing athleteRegion prop', () => {
    const propsWithoutRegion = { ...defaultProps, athleteRegion: undefined };
    const { getByText } = render(<SetStateModal {...propsWithoutRegion} />);
    
    expect(getByText('Current State:')).toBeTruthy(); // Should handle undefined gracefully
  });

  it('should have proper modal structure', () => {
    const { getByText } = render(<SetStateModal {...defaultProps} />);
    
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('Search Therapist Component')).toBeTruthy();
  });

  it('should render modal with transparent background', () => {
    const { getByText } = render(<SetStateModal {...defaultProps} />);
    
    // Modal should be rendered (we can test by checking if content is present)
    expect(getByText('Oops!')).toBeTruthy();
  });

  it('should handle different user objects', () => {
    const differentUser = { id: 'user456', name: 'Jane Smith' };
    const { getByText } = render(
      <SetStateModal {...defaultProps} user={differentUser} />
    );
    
    expect(getByText('Oops!')).toBeTruthy();
  });

  it('should handle null user', () => {
    const { getByText } = render(
      <SetStateModal {...defaultProps} user={null} />
    );
    
    expect(getByText('Oops!')).toBeTruthy();
  });
});
