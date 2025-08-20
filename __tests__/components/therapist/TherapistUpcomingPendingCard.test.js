import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import TherapistUpcomingPendingCard from '../../../app/components/therapist/TherapistUpcomingPendingCard';

// Mock dependencies
jest.mock('../../../app/api/bookings', () => ({
  approveBooking: jest.fn(() => Promise.resolve({ 
    data: { confirmation_status: 1, athlete_id: 'athlete123' } 
  })),
}));

jest.mock('../../../app/api/notifications', () => ({
  notifyAthlete: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../app/lib/error', () => ({
  handleError: jest.fn(() => false),
}));

jest.mock('../../../app/components/therapist/TherapistAppointmentDeclineModal', () => {
  const { View, Text } = require('react-native');
  return ({ visible, item }) => 
    visible ? <View testID="decline-modal"><Text>Decline Modal</Text></View> : null;
});

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('TherapistUpcomingPendingCard', () => {
  const mockData = {
    booking_day: 15,
    booking_day_of_week: 'Monday',
    booking_month: 'January',
    bookings_id: 'BOOK123',
    first_name: 'John',
    athlete_location: '123 Main St, New York, NY 10001',
    booking_time: '10:00 AM',
    profile_picture_url: 'https://example.com/profile.jpg',
  };

  const mockLoadUpcomingBookings = jest.fn();

  const defaultProps = {
    therapistData: mockData,
    loadUpcomingBookings: mockLoadUpcomingBookings,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert.mockClear();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<TherapistUpcomingPendingCard {...defaultProps} />);
    expect(getByText('John')).toBeTruthy();
  });
});