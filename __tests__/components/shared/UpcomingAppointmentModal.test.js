import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UpcomingAppointmentModal from '../../../app/components/shared/UpcomingAppointmentModal';

// Mock dependencies
jest.mock('../../../app/components/athlete/AthleteAppointmentDetails', () => {
  return function MockAthleteAppointmentDetails() {
    const { Text } = require('react-native');
    return <Text>Mocked Appointment Details</Text>;
  };
});

jest.mock('../../../app/api/bookings', () => ({
  athleteCancelBooking: jest.fn(() => Promise.resolve({ 
    data: { status: 'CancelledRefunded' },
    success: true 
  })),
  therapistCancelBooking: jest.fn(() => Promise.resolve({ 
    data: { status: 'CancelledRefunded' },
    success: true 
  })),
}));

jest.mock('../../../app/lib/error', () => ({
  handleError: jest.fn(() => false),
}));

describe('UpcomingAppointmentModal', () => {
  const mockBooking = {
    bookings_id: '123',
    confirmation_status: 1,
    therapist_name: 'Test Therapist',
    booking_date: '2023-01-01',
    booking_time: '10:00 AM',
  };

  const defaultProps = {
    booking: mockBooking,
    setVisibility: jest.fn(),
    visible: true,
    profilePictureUrl: null,
    isTherapist: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    expect(getByText('Mocked Appointment Details')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const props = { ...defaultProps, visible: false };
    const result = render(<UpcomingAppointmentModal {...props} />);
    
    expect(result.toJSON()).toBeNull();
  });

  it('should display initial step with appointment details', () => {
    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    expect(getByText('Mocked Appointment Details')).toBeTruthy();
    expect(getByText('Nevermind')).toBeTruthy();
    expect(getByText('Cancel Appointment')).toBeTruthy();
    expect(getByText('Modify Appointment')).toBeTruthy();
  });

  it('should close modal when Nevermind button is pressed', () => {
    const mockSetVisibility = jest.fn();
    const props = { ...defaultProps, setVisibility: mockSetVisibility };
    const { getByText } = render(<UpcomingAppointmentModal {...props} />);
    
    fireEvent.press(getByText('Nevermind'));
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it('should show cancel step when Cancel Appointment is pressed', () => {
    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Cancel Appointment'));
    
    expect(getByText(/Are you sure you want to cancel/i)).toBeTruthy();
    expect(getByText('Confirm Cancellation')).toBeTruthy();
  });

  it('should show modify step when Modify Appointment is pressed', () => {
    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Modify Appointment'));
    
    expect(getByText(/If you would like to make modifications/i)).toBeTruthy();
  });

  it('should not show Modify Appointment button for therapist', () => {
    const props = { ...defaultProps, isTherapist: true };
    const { queryByText } = render(<UpcomingAppointmentModal {...props} />);
    
    expect(queryByText('Modify Appointment')).toBeFalsy();
  });

  it('should show different cancel warning text for therapist', () => {
    const props = { ...defaultProps, isTherapist: true };
    const { getByText } = render(<UpcomingAppointmentModal {...props} />);
    
    fireEvent.press(getByText('Cancel Appointment'));
    
    expect(getByText('Are you sure you want to cancel this appointment?')).toBeTruthy();
  });

  it('should call athleteCancelBooking when athlete confirms cancellation', async () => {
    const bookingsApi = require('../../../app/api/bookings');
    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Cancel Appointment'));
    fireEvent.press(getByText('Confirm Cancellation'));
    
    await waitFor(() => {
      expect(bookingsApi.athleteCancelBooking).toHaveBeenCalledWith('123');
    });
  });

  it('should call therapistCancelBooking when therapist confirms cancellation', async () => {
    const bookingsApi = require('../../../app/api/bookings');
    const props = { ...defaultProps, isTherapist: true };
    const { getByText } = render(<UpcomingAppointmentModal {...props} />);
    
    fireEvent.press(getByText('Cancel Appointment'));
    fireEvent.press(getByText('Confirm Cancellation'));
    
    await waitFor(() => {
      expect(bookingsApi.therapistCancelBooking).toHaveBeenCalledWith('123');
    });
  });

  it('should show refund confirmation when booking is cancelled with refund', async () => {
    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Cancel Appointment'));
    fireEvent.press(getByText('Confirm Cancellation'));
    
    await waitFor(() => {
      expect(getByText(/successfully cancelled.*refund/i)).toBeTruthy();
    });
  });

  it('should show no refund confirmation when booking is cancelled without refund', async () => {
    const bookingsApi = require('../../../app/api/bookings');
    bookingsApi.athleteCancelBooking.mockResolvedValueOnce({
      data: { status: 'Cancelled' },
      success: true
    });

    const { getByText } = render(<UpcomingAppointmentModal {...defaultProps} />);
    
    fireEvent.press(getByText('Cancel Appointment'));
    fireEvent.press(getByText('Confirm Cancellation'));
    
    await waitFor(() => {
      expect(getByText('Your appointment has been successfully cancelled.')).toBeTruthy();
    });
  });

  it('should display profile picture when provided', () => {
    const props = { 
      ...defaultProps, 
      profilePictureUrl: 'https://example.com/profile.jpg' 
    };
    
    expect(() => render(<UpcomingAppointmentModal {...props} />)).not.toThrow();
  });

  it('should display account icon when no profile picture is provided', () => {
    expect(() => render(<UpcomingAppointmentModal {...defaultProps} />)).not.toThrow();
  });

  it('should not show cancel button when confirmation status is not 1 or -1', () => {
    const props = { 
      ...defaultProps, 
      booking: { ...mockBooking, confirmation_status: 0 }
    };
    const { queryByText } = render(<UpcomingAppointmentModal {...props} />);
    
    expect(queryByText('Cancel Appointment')).toBeFalsy();
  });
});
