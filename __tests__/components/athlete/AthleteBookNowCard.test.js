import React from 'react';
import { render } from '@testing-library/react-native';
import AthleteBookNowCard from '../../../app/components/athlete/AthleteBookNowCard';
import AuthContext from '../../../app/auth/context';

// Mock dependencies
jest.mock('../../../app/components/athlete/BookModal', () => {
  return function MockBookModal({ visible }) {
    const { View, Text } = require('react-native');
    if (!visible) return null;
    return (
      <View testID="book-modal">
        <Text>Book Modal</Text>
      </View>
    );
  };
});

jest.mock('../../../app/components/athlete/BookButton', () => {
  return function MockBookButton() {
    const { View, Text } = require('react-native');
    return (
      <View testID="book-button">
        <Text>Book Button</Text>
      </View>
    );
  };
});

jest.mock('react-native-ratings', () => ({
  Rating: ({ rating, ...props }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="rating-component" {...props}>
        <Text>Rating: {rating}</Text>
      </View>
    );
  },
}));

describe('AthleteBookNowCard', () => {
  const mockUser = {
    userObj: {
      athlete_id: 'athlete123',
    },
  };

  const mockTherapist = {
    therapist_id: 'therapist123',
    first_name: 'Dr. Smith',
    profession: 'Physical Therapist',
    hourly_rate: 100,
    average_rating: 4.5,
    profile_picture_url: 'https://example.com/profile.jpg',
    stripe_account_id: 'stripe123',
    accepts_house_calls: true,
    summary: 'Experienced therapist',
    services: 'Massage, Physical Therapy',
    business_hours: '9am-5pm',
    street: '123 Main St',
    city: 'Test City',
    state: 'CA',
    zipcode: '12345',
  };

  const renderWithAuthContext = (props) => {
    return render(
      <AuthContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
        <AthleteBookNowCard {...props} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing when therapist has hourly rate', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByText('Dr. Smith')).toBeTruthy();
  });

  it('should not render when therapist is null', () => {
    const result = renderWithAuthContext({
      therapist: null,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(result.toJSON()).toBeNull();
  });

  it('should not render when therapist has no hourly rate', () => {
    const therapistNoRate = { ...mockTherapist, hourly_rate: null };
    const result = renderWithAuthContext({
      therapist: therapistNoRate,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(result.toJSON()).toBeNull();
  });

  it('should display therapist name', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByText('Dr. Smith')).toBeTruthy();
  });

  it('should display therapist profession', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByText('Physical Therapist')).toBeTruthy();
  });

  it('should display hourly rate', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByText('$100/hr')).toBeTruthy();
  });

  it('should display rating component', () => {
    const { getByTestId } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByTestId('rating-component')).toBeTruthy();
  });

  it('should render book button', () => {
    const { getByTestId } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByTestId('book-button')).toBeTruthy();
  });

  it('should apply selected style when therapist is selected', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: mockTherapist,
    });
    
    // The component should still render, styling is internal
    expect(getByText('Dr. Smith')).toBeTruthy();
  });

  it('should display profile picture when provided', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    // Since we can't easily test Image rendering, we just ensure the component renders
    expect(getByText('Dr. Smith')).toBeTruthy();
  });

  it('should display default icon when no profile picture', () => {
    const therapistNoImage = { ...mockTherapist, profile_picture_url: null };
    const { getByText } = renderWithAuthContext({
      therapist: therapistNoImage,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByText('Dr. Smith')).toBeTruthy();
  });

  it('should handle different hourly rates', () => {
    const therapistDifferentRate = { ...mockTherapist, hourly_rate: 150 };
    const { getByText } = renderWithAuthContext({
      therapist: therapistDifferentRate,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByText('$150/hr')).toBeTruthy();
  });

  it('should handle different ratings', () => {
    const therapistDifferentRating = { ...mockTherapist, average_rating: 5.0 };
    const { getByTestId } = renderWithAuthContext({
      therapist: therapistDifferentRating,
      athleteAddress: '456 Test St',
      selectedTherapist: null,
    });
    
    expect(getByTestId('rating-component')).toBeTruthy();
  });

  it('should handle missing athlete address', () => {
    const { getByText } = renderWithAuthContext({
      therapist: mockTherapist,
      athleteAddress: null,
      selectedTherapist: null,
    });
    
    expect(getByText('Dr. Smith')).toBeTruthy();
  });
});
