import React from 'react';
import { render } from '@testing-library/react-native';
import AthleteAppointmentDetails from '../../../app/components/athlete/AthleteAppointmentDetails';
import AuthContext from '../../../app/auth/context';

describe('AthleteAppointmentDetails', () => {
  const mockUser = {
    userObj: { first_name: 'John' },
    authorization_id: 'auth123',
  };

  const mockBooking = {
    first_name: 'Dr. Smith',
    booking_date: '2024-03-15T10:00:00Z',
    booking_time: '2:00 PM',
    duration: 2.5,
    athlete_location: '123 Main St, City, State',
    total_cost: 250,
  };

  const renderWithAuthContext = (component) => {
    return render(
      <AuthContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
        {component}
      </AuthContext.Provider>
    );
  };

  it('should render without crashing', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Your appointment with Dr. Smith')).toBeTruthy();
  });

  it('should display appointment title with therapist name', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Your appointment with Dr. Smith')).toBeTruthy();
  });

  it('should display formatted booking date', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Date:')).toBeTruthy();
    // Date formatting may vary by locale, but should contain the date
    expect(getByText(/3\/15\/2024|15\/3\/2024|2024/)).toBeTruthy();
  });

  it('should display booking time', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Time:')).toBeTruthy();
    expect(getByText('2:00 PM')).toBeTruthy();
  });

  it('should display formatted duration', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Duration:')).toBeTruthy();
    expect(getByText('2h 30m')).toBeTruthy();
  });

  it('should display athlete location', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Location:')).toBeTruthy();
    expect(getByText('123 Main St, City, State')).toBeTruthy();
  });

  it('should display total cost', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Total Cost:')).toBeTruthy();
    expect(getByText('$250')).toBeTruthy();
  });

  it('should handle whole hour duration', () => {
    const bookingWithWholeHour = { ...mockBooking, duration: 3.0 };
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={bookingWithWholeHour} />
    );
    
    expect(getByText('3h 0m')).toBeTruthy();
  });

  it('should handle fractional hour duration', () => {
    const bookingWithFraction = { ...mockBooking, duration: 1.25 };
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={bookingWithFraction} />
    );
    
    expect(getByText('1h 15m')).toBeTruthy();
  });

  it('should display all field labels', () => {
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={mockBooking} />
    );
    
    expect(getByText('Date:')).toBeTruthy();
    expect(getByText('Time:')).toBeTruthy();
    expect(getByText('Duration:')).toBeTruthy();
    expect(getByText('Location:')).toBeTruthy();
    expect(getByText('Total Cost:')).toBeTruthy();
  });

  it('should handle different therapist names', () => {
    const differentBooking = { ...mockBooking, first_name: 'Dr. Johnson' };
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={differentBooking} />
    );
    
    expect(getByText('Your appointment with Dr. Johnson')).toBeTruthy();
  });

  it('should handle different cost formats', () => {
    const expensiveBooking = { ...mockBooking, total_cost: 1000 };
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={expensiveBooking} />
    );
    
    expect(getByText('$1000')).toBeTruthy();
  });

  it('should handle zero cost', () => {
    const freeBooking = { ...mockBooking, total_cost: 0 };
    const { getByText } = renderWithAuthContext(
      <AthleteAppointmentDetails booking={freeBooking} />
    );
    
    expect(getByText('$0')).toBeTruthy();
  });
});
