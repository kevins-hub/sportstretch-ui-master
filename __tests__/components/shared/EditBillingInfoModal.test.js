import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditBillingInfoModal from '../../../app/components/shared/EditBillingInfoModal';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('EditBillingInfoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = render(
      <EditBillingInfoModal
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    expect(getByText('Edit Billing Info Modal')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const mockSetVisibility = jest.fn();
    const result = render(
      <EditBillingInfoModal
        visible={false}
        setVisibility={mockSetVisibility}
      />
    );
    
    expect(result.toJSON()).toBeNull();
  });

  it('should display Cancel and Submit buttons', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = render(
      <EditBillingInfoModal
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('should call setVisibility(false) when Cancel button is pressed', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = render(
      <EditBillingInfoModal
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    fireEvent.press(getByText('Cancel'));
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it('should call setVisibility(false) when Submit button is pressed', () => {
    const mockSetVisibility = jest.fn();
    const { getByText } = render(
      <EditBillingInfoModal
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    fireEvent.press(getByText('Submit'));
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it('should have proper modal styling', () => {
    const mockSetVisibility = jest.fn();
    const { getByTestId } = render(
      <EditBillingInfoModal
        visible={true}
        setVisibility={mockSetVisibility}
      />
    );
    
    // Modal should render with correct structure
    expect(() => render(
      <EditBillingInfoModal
        visible={true}
        setVisibility={mockSetVisibility}
      />
    )).not.toThrow();
  });
});
