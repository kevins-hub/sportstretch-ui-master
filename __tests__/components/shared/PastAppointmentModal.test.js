import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PastAppointmentModal from '../../../app/components/shared/PastAppointmentModal';
import AuthContext from '../../../app/auth/context';

// Mock dependencies
jest.mock('../../../app/components/athlete/AthleteAppointmentDetails', () => {
  return function MockAthleteAppointmentDetails() {
    const { Text } = require('react-native');
    return <Text>Mocked Appointment Details</Text>;
  };
});

jest.mock('../../../app/api/report');
jest.mock('../../../app/api/notifications');

describe('PastAppointmentModal', () => {
  const mockUser = {
    role: 'athlete',
    userObj: { first_name: 'John' },
    authorization_id: 'test_auth_123',
  };

  const mockBooking = {
    bookings_id: '123',
    therapist_name: 'Test Therapist',
    booking_date: '2023-01-01',
    booking_time: '10:00 AM',
  };

  const renderWithAuthContext = (component) => {
    return render(
      <AuthContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
        {component}
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    expect(getByText('Mocked Appointment Details')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const mockSetVisibility = jest.fn();
    const result = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={false}
        setVisibility={mockSetVisibility}
      />
    );
    
    expect(result.toJSON()).toBeNull();
  });

  it('should display initial step with appointment details', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    expect(getByText('Mocked Appointment Details')).toBeTruthy();
    expect(getByText('Nevermind')).toBeTruthy();
    expect(getByText('Report an issue with this appointment')).toBeTruthy();
  });

  it('should close modal when Nevermind button is pressed', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    fireEvent.press(getByText('Nevermind'));
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it('should show report issue step when report button is pressed', () => {
    const mockSetVisibility = jest.fn();
    const { getByText, getByPlaceholderText } = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    fireEvent.press(getByText('Report an issue with this appointment'));
    
    expect(getByText(/Please describe the issue/i)).toBeTruthy();
    expect(getByPlaceholderText('Type here')).toBeTruthy();
    expect(getByText('Confirm Report')).toBeTruthy();
  });

  it('should display character count in report step', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    // Navigate to report step
    fireEvent.press(getByText('Report an issue with this appointment'));
    
    expect(getByText('0/500')).toBeTruthy();
  });

  it('should handle text input changes in report step', () => {
    const mockSetVisibility = jest.fn();
    const { getByPlaceholderText, getByText } = renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    // Navigate to report step
    fireEvent.press(getByText('Report an issue with this appointment'));
    
    const textInput = getByPlaceholderText('Type here');
    fireEvent.changeText(textInput, 'Test issue description');
    
    expect(getByText('22/500')).toBeTruthy();
  });

  it('should have proper modal structure', () => {
    const mockSetVisibility = jest.fn();
    
    expect(() => renderWithAuthContext(
      <PastAppointmentModal
        booking={mockBooking}
        visible={true}
        setVisibility={mockSetVisibility}
      />
    )).not.toThrow();
  });
});
