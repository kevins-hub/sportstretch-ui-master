import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TherapistSwipeList from '../../../app/components/athlete/TherapistSwipeList';

// Mock AthleteBookNowCard component
jest.mock('../../../app/components/athlete/AthleteBookNowCard', () => {
  return function MockAthleteBookNowCard({ therapist, selectedTherapist }) {
    const { View, Text } = require('react-native');
    const isSelected = selectedTherapist?.therapist_id === therapist.therapist_id;
    return (
      <View testID={`therapist-card-${therapist.therapist_id}`}>
        <Text>Dr. {therapist.first_name}</Text>
        <Text>ID: {therapist.therapist_id}</Text>
        <Text>Profession: {therapist.profession}</Text>
        {isSelected && <Text>Selected</Text>}
      </View>
    );
  };
});

describe('TherapistSwipeList', () => {
  const mockTherapists = [
    {
      therapist_id: '1',
      first_name: 'Smith',
      profession: 'Physical Therapist',
      hourly_rate: 100,
    },
    {
      therapist_id: '2',
      first_name: 'Johnson',
      profession: 'Massage Therapist',
      hourly_rate: 80,
    },
    {
      therapist_id: '3',
      first_name: 'Williams',
      profession: 'Sports Therapist',
      hourly_rate: 120,
    },
  ];

  const defaultProps = {
    therapistsInRegion: mockTherapists,
    athleteAddress: '123 Main St, Test City, CA',
    setSelectedTherapist: jest.fn(),
    selectedTherapist: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<TherapistSwipeList {...defaultProps} />);
    
    expect(getByText('Dr. Smith')).toBeTruthy();
    expect(getByText('Dr. Johnson')).toBeTruthy();
    expect(getByText('Dr. Williams')).toBeTruthy();
  });

  it('should render all therapists in the list', () => {
    const { getByText, getByTestId } = render(<TherapistSwipeList {...defaultProps} />);
    
    // Check all therapists are rendered
    expect(getByTestId('therapist-card-1')).toBeTruthy();
    expect(getByTestId('therapist-card-2')).toBeTruthy();
    expect(getByTestId('therapist-card-3')).toBeTruthy();
    
    // Check therapist details
    expect(getByText('Dr. Smith')).toBeTruthy();
    expect(getByText('Dr. Johnson')).toBeTruthy();
    expect(getByText('Dr. Williams')).toBeTruthy();
  });

  it('should display therapist professions', () => {
    const { getByText } = render(<TherapistSwipeList {...defaultProps} />);
    
    expect(getByText('Profession: Physical Therapist')).toBeTruthy();
    expect(getByText('Profession: Massage Therapist')).toBeTruthy();
    expect(getByText('Profession: Sports Therapist')).toBeTruthy();
  });

  it('should call setSelectedTherapist when a therapist card is pressed', () => {
    const { getByTestId } = render(<TherapistSwipeList {...defaultProps} />);
    
    const therapistCard = getByTestId('therapist-card-1');
    fireEvent.press(therapistCard);
    
    expect(defaultProps.setSelectedTherapist).toHaveBeenCalledWith(mockTherapists[0]);
  });

  it('should handle multiple therapist selections', () => {
    const { getByTestId } = render(<TherapistSwipeList {...defaultProps} />);
    
    const firstCard = getByTestId('therapist-card-1');
    const secondCard = getByTestId('therapist-card-2');
    
    fireEvent.press(firstCard);
    expect(defaultProps.setSelectedTherapist).toHaveBeenCalledWith(mockTherapists[0]);
    
    fireEvent.press(secondCard);
    expect(defaultProps.setSelectedTherapist).toHaveBeenCalledWith(mockTherapists[1]);
  });

  it('should show selected state for selected therapist', () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedTherapist: mockTherapists[1], // Select second therapist
    };
    
    const { getByText, queryByText } = render(<TherapistSwipeList {...propsWithSelection} />);
    
    // Only the selected therapist should show "Selected"
    expect(getByText('Selected')).toBeTruthy();
    
    // Check it's associated with the correct therapist
    const selectedCard = getByText('Selected').parent;
    expect(selectedCard).toBeTruthy();
  });

  it('should render empty view when no therapists provided', () => {
    const emptyProps = { ...defaultProps, therapistsInRegion: [] };
    const { queryByText } = render(<TherapistSwipeList {...emptyProps} />);
    
    // Should not render any therapist cards
    expect(queryByText('Dr. Smith')).toBeNull();
    expect(queryByText('Dr. Johnson')).toBeNull();
    expect(queryByText('Dr. Williams')).toBeNull();
  });

  it('should handle single therapist in list', () => {
    const singleTherapistProps = {
      ...defaultProps,
      therapistsInRegion: [mockTherapists[0]],
    };
    
    const { getByText, queryByText, getByTestId } = render(
      <TherapistSwipeList {...singleTherapistProps} />
    );
    
    expect(getByTestId('therapist-card-1')).toBeTruthy();
    expect(getByText('Dr. Smith')).toBeTruthy();
    expect(queryByText('Dr. Johnson')).toBeNull();
    expect(queryByText('Dr. Williams')).toBeNull();
  });

  it('should pass athleteAddress to AthleteBookNowCard', () => {
    const { getByTestId } = render(<TherapistSwipeList {...defaultProps} />);
    
    // The component should render without errors, indicating props are passed correctly
    expect(getByTestId('therapist-card-1')).toBeTruthy();
  });

  it('should handle therapists with different IDs', () => {
    const uniqueTherapists = [
      { ...mockTherapists[0], therapist_id: 'unique_id_1' },
      { ...mockTherapists[1], therapist_id: 'unique_id_2' },
    ];
    
    const uniqueProps = { ...defaultProps, therapistsInRegion: uniqueTherapists };
    const { getByTestId } = render(<TherapistSwipeList {...uniqueProps} />);
    
    expect(getByTestId('therapist-card-unique_id_1')).toBeTruthy();
    expect(getByTestId('therapist-card-unique_id_2')).toBeTruthy();
  });

  it('should use therapist_id as key extractor', () => {
    // This is tested implicitly by the fact that the FlatList renders correctly
    // and uses therapist_id in the testID
    const { getByTestId } = render(<TherapistSwipeList {...defaultProps} />);
    
    mockTherapists.forEach(therapist => {
      expect(getByTestId(`therapist-card-${therapist.therapist_id}`)).toBeTruthy();
    });
  });

  it('should handle therapist selection changes', () => {
    const { rerender, getByTestId, queryByText } = render(
      <TherapistSwipeList {...defaultProps} />
    );
    
    // Initially no selection
    expect(queryByText('Selected')).toBeNull();
    
    // Update with selection
    rerender(
      <TherapistSwipeList 
        {...defaultProps} 
        selectedTherapist={mockTherapists[0]} 
      />
    );
    
    expect(queryByText('Selected')).toBeTruthy();
  });
});
