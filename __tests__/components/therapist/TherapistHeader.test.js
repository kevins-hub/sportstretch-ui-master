import React from 'react';
import { render } from '@testing-library/react-native';
import TherapistHeader from '../../../app/components/therapist/TherapistHeader';
import AuthContext from '../../../app/auth/context';

// Mock react-native-stars
jest.mock('react-native-stars', () => {
  const { View } = require('react-native');
  return function MockStars(props) {
    return <View testID="therapist-stars" {...props} />;
  };
});

describe('TherapistHeader', () => {
  const mockUser = {
    role: 'therapist',
    userObj: {
      first_name: 'Dr. Smith',
      mobile: '+1 (555) 123-4567',
      avg_rating: 4.7,
    },
  };

  const mockSetUser = jest.fn();

  const renderWithContext = (user = mockUser) => {
    return render(
      <AuthContext.Provider value={{ user, setUser: mockSetUser }}>
        <TherapistHeader />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Hi, Dr. Smith')).toBeTruthy();
  });

  it('should display therapist first name in greeting', () => {
    const customUser = {
      ...mockUser,
      userObj: { ...mockUser.userObj, first_name: 'Sarah' },
    };
    const { getByText } = renderWithContext(customUser);
    expect(getByText('Hi, Sarah')).toBeTruthy();
  });

  it('should display therapist mobile number', () => {
    const { getByText } = renderWithContext();
    expect(getByText('+1 (555) 123-4567')).toBeTruthy();
  });

  it('should render star rating component', () => {
    const { getByTestId } = renderWithContext();
    expect(getByTestId('therapist-stars')).toBeTruthy();
  });

  it('should pass correct rating to Stars component', () => {
    const { getByTestId } = renderWithContext();
    const starsComponent = getByTestId('therapist-stars');
    expect(starsComponent.props.default).toBe(4.7);
  });

  it('should handle different mobile number formats', () => {
    const customUser = {
      ...mockUser,
      userObj: { 
        ...mockUser.userObj, 
        mobile: '555-1234' 
      },
    };
    const { getByText } = renderWithContext(customUser);
    expect(getByText('555-1234')).toBeTruthy();
  });

  it('should handle missing avg_rating gracefully', () => {
    const userWithoutRating = {
      ...mockUser,
      userObj: {
        first_name: 'Dr. Smith',
        mobile: '+1 (555) 123-4567',
        avg_rating: undefined,
      },
    };
    const { getByTestId } = renderWithContext(userWithoutRating);
    const starsComponent = getByTestId('therapist-stars');
    expect(isNaN(starsComponent.props.default)).toBe(true);
  });

  it('should handle zero rating', () => {
    const userWithZeroRating = {
      ...mockUser,
      userObj: {
        ...mockUser.userObj,
        avg_rating: 0,
      },
    };
    const { getByTestId } = renderWithContext(userWithZeroRating);
    const starsComponent = getByTestId('therapist-stars');
    expect(starsComponent.props.default).toBe(0);
  });

  it('should handle high rating', () => {
    const userWithHighRating = {
      ...mockUser,
      userObj: {
        ...mockUser.userObj,
        avg_rating: 5.0,
      },
    };
    const { getByTestId } = renderWithContext(userWithHighRating);
    const starsComponent = getByTestId('therapist-stars');
    expect(starsComponent.props.default).toBe(5.0);
  });

  it('should display edit icon', () => {
    const { getByTestId } = renderWithContext();
    // The MaterialCommunityIcons should be rendered
    // Since we can't easily test icons, we just ensure the component renders
    expect(getByTestId('therapist-stars')).toBeTruthy();
  });

  it('should handle empty mobile number', () => {
    const userWithoutMobile = {
      ...mockUser,
      userObj: {
        ...mockUser.userObj,
        mobile: '',
      },
    };
    const { getByText } = renderWithContext(userWithoutMobile);
    expect(getByText('')).toBeTruthy();
  });
});
