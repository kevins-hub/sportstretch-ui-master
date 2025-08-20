import React from 'react';
import { render } from '@testing-library/react-native';
import TherapistUpcomingCard from '../../../app/components/therapist/TherapistUpcomingCard';

describe('TherapistUpcomingCard', () => {
  const mockTherapistData = {
    booking_day: '15',
    booking_day_of_week: 'Monday',
    booking_month: 'January',
    first_name: 'John',
    bookings_id: 'BOOK123',
    athlete_location: '123 Main St, New York, NY 10001',
    confirmation_status: 1,
    booking_time: '10:00 AM',
    status: 'Confirmed',
    profile_picture_url: 'https://example.com/profile.jpg',
  };

  it('should render without crashing', () => {
    expect(() => 
      render(<TherapistUpcomingCard therapistData={mockTherapistData} />)
    ).not.toThrow();
  });

  it('should display athlete name', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('John')).toBeTruthy();
  });

  it('should display booking date correctly', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('Monday, Jan 15')).toBeTruthy();
  });

  it('should display booking time', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('10:00 AM')).toBeTruthy();
  });

  it('should display booking ID', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('BOOK123')).toBeTruthy();
  });

  it('should display athlete location when provided', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('NY 10001')).toBeTruthy();
  });

  it('should display clinic location when no athlete location', () => {
    const dataWithoutLocation = {
      ...mockTherapistData,
      athlete_location: null,
    };

    const { getByText } = render(
      <TherapistUpcomingCard therapistData={dataWithoutLocation} />
    );
    
    expect(getByText('Your clinic.')).toBeTruthy();
  });

  it('should display approved status for confirmed bookings', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('Approved')).toBeTruthy();
  });

  it('should display declined status for declined bookings', () => {
    const declinedData = {
      ...mockTherapistData,
      confirmation_status: 0,
    };

    const { getByText } = render(
      <TherapistUpcomingCard therapistData={declinedData} />
    );
    
    expect(getByText('Declined')).toBeTruthy();
  });

  it('should handle cancelled refunded status', () => {
    const cancelledData = {
      ...mockTherapistData,
      status: 'CancelledRefunded',
    };

    const { getByText } = render(
      <TherapistUpcomingCard therapistData={cancelledData} />
    );
    
    expect(getByText('Cancelled (Refunded)')).toBeTruthy();
  });

  it('should handle cancelled no refund status', () => {
    const cancelledData = {
      ...mockTherapistData,
      status: 'CancelledNoRefund',
    };

    const { getByText } = render(
      <TherapistUpcomingCard therapistData={cancelledData} />
    );
    
    expect(getByText('Cancelled')).toBeTruthy();
  });

  it('should display default profile icon when no profile picture', () => {
    const dataWithoutPicture = {
      ...mockTherapistData,
      profile_picture_url: null,
    };

    expect(() => 
      render(<TherapistUpcomingCard therapistData={dataWithoutPicture} />)
    ).not.toThrow();
  });

  it('should display all required section labels', () => {
    const { getByText } = render(
      <TherapistUpcomingCard therapistData={mockTherapistData} />
    );
    
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Time (local)')).toBeTruthy();
    expect(getByText('Booking Id')).toBeTruthy();
    expect(getByText('Location')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
  });
});
