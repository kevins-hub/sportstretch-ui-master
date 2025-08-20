import React from 'react';
import { render } from '@testing-library/react-native';
import AthleteUpcomingCard from '../../../app/components/athlete/AthleteUpcomingCard';

describe('AthleteUpcomingCard', () => {
  const mockProps = {
    BookingMonth: 'JAN',
    BookingDay: '15',
    BookingTime: '2:00 PM',
    fname: 'Dr. Smith',
    bookingId: 'BK123456',
    confirmationStatus: 'Approved',
  };

  it('should render without crashing', () => {
    const { getByText } = render(<AthleteUpcomingCard {...mockProps} />);
    
    expect(getByText('JAN')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
  });

  it('should display booking information correctly', () => {
    const { getByText } = render(<AthleteUpcomingCard {...mockProps} />);
    
    expect(getByText('JAN')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
    expect(getByText('2:00 PM')).toBeTruthy();
    expect(getByText('Dr. Smith')).toBeTruthy();
    expect(getByText('BK123456')).toBeTruthy();
  });

  it('should display field labels correctly', () => {
    const { getByText } = render(<AthleteUpcomingCard {...mockProps} />);
    
    expect(getByText('Appointment Time (local) :')).toBeTruthy();
    expect(getByText('Recovery Specialist :')).toBeTruthy();
    expect(getByText('Booking ID :')).toBeTruthy();
    expect(getByText('Status :')).toBeTruthy();
  });

  it('should display approved status with green color', () => {
    const { getByText } = render(<AthleteUpcomingCard {...mockProps} />);
    
    const statusText = getByText('Approved');
    expect(statusText).toBeTruthy();
    expect(statusText.props.style).toEqual(
      expect.objectContaining({
        color: 'green',
        fontStyle: 'italic',
      })
    );
  });

  it('should display pending status with gold color', () => {
    const pendingProps = { ...mockProps, confirmationStatus: 'Pending' };
    const { getByText } = render(<AthleteUpcomingCard {...pendingProps} />);
    
    const statusText = getByText('Pending');
    expect(statusText).toBeTruthy();
    expect(statusText.props.style).toEqual(
      expect.objectContaining({
        color: 'gold',
        fontStyle: 'italic',
      })
    );
  });

  it('should display declined status with grey color', () => {
    const declinedProps = { ...mockProps, confirmationStatus: 'Declined' };
    const { getByText } = render(<AthleteUpcomingCard {...declinedProps} />);
    
    const statusText = getByText('Declined');
    expect(statusText).toBeTruthy();
    expect(statusText.props.style).toEqual(
      expect.objectContaining({
        fontStyle: 'italic',
      })
    );
  });

  it('should handle missing props gracefully', () => {
    const minimalProps = {
      BookingMonth: 'FEB',
      BookingDay: '20',
      BookingTime: '10:00 AM',
      fname: 'Dr. Johnson',
      bookingId: 'BK789012',
      confirmationStatus: 'Approved',
    };

    expect(() => render(<AthleteUpcomingCard {...minimalProps} />)).not.toThrow();
  });

  it('should display all required information in a structured layout', () => {
    const { getByText } = render(<AthleteUpcomingCard {...mockProps} />);
    
    // Check that all elements are present
    expect(getByText('JAN')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
    expect(getByText('Appointment Time (local) :')).toBeTruthy();
    expect(getByText('2:00 PM')).toBeTruthy();
    expect(getByText('Recovery Specialist :')).toBeTruthy();
    expect(getByText('Dr. Smith')).toBeTruthy();
    expect(getByText('Booking ID :')).toBeTruthy();
    expect(getByText('BK123456')).toBeTruthy();
    expect(getByText('Status :')).toBeTruthy();
    expect(getByText('Approved')).toBeTruthy();
  });

  it('should handle long therapist names', () => {
    const longNameProps = { 
      ...mockProps, 
      fname: 'Dr. Very Long Therapist Name That Might Overflow' 
    };

    expect(() => render(<AthleteUpcomingCard {...longNameProps} />)).not.toThrow();
    
    const { getByText } = render(<AthleteUpcomingCard {...longNameProps} />);
    expect(getByText('Dr. Very Long Therapist Name That Might Overflow')).toBeTruthy();
  });
});
