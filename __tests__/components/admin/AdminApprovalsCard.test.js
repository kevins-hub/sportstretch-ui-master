import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AdminApprovalsCard from '../../../app/components/admin/AdminApprovalsCard';

// Mock dependencies
jest.mock('../../../app/api/therapists', () => ({
  approveTherapist: jest.fn(() => Promise.resolve({ success: true })),
  denyTherapist: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../../../app/lib/error', () => ({
  handleError: jest.fn(() => false),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('AdminApprovalsCard', () => {
  const mockTherapistData = {
    TherapistId: 'therapist123',
    FirstName: 'John',
    LastName: 'Smith',
    Email: 'john.smith@example.com',
    Mobile: '555-0123',
    License: 'LIC123456',
    Address: '123 Therapy St, Medical City, MC 12345',
    Services: 'Physical Therapy, Massage',
    Bio: 'Experienced therapist with 10 years of practice.',
    Profession: 'Physical Therapist',
  };

  const mockLoadAllRequests = jest.fn();

  const defaultProps = {
    ...mockTherapistData,
    loadAllRequests: mockLoadAllRequests,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert.mockClear();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<AdminApprovalsCard {...defaultProps} />);
    expect(getByText('John Smith')).toBeTruthy();
  });
});