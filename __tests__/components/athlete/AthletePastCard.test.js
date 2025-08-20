import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AthletePastCard from '../../../app/components/athlete/AthletePastCard';

// Mock dependencies
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

jest.mock('../../../app/components/shared/PastAppointmentModal', () => {
  const { View, Text } = require('react-native');
  return ({ visible, appointment }) => 
    visible ? <View testID="past-appointment-modal"><Text>Past Appointment Modal</Text></View> : null;
});

// Mock DevMenu
global.__DEV__ = false;

describe('AthletePastCard', () => {
  const mockAppointmentData = {
    BookingMonth: 'Mar',
    BookingDay: 15,
    fname: 'Dr. Smith',
    bookingId: 'BOOK123',
    therapistId: 'therapist123',
    starRating: 4.5,
  };

  const defaultProps = mockAppointmentData;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<AthletePastCard {...defaultProps} />);
    expect(getByText('Dr. Smith')).toBeTruthy();
  });
});