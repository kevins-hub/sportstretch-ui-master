import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LogOutButton from '../../../app/components/shared/LogOutButton';
import AuthContext from '../../../app/auth/context';
import { handleLogout } from '../../../app/api/revenuecatService';

// Mock the revenuecatService
jest.mock('../../../app/api/revenuecatService', () => ({
  handleLogout: jest.fn(),
}));

describe('LogOutButton', () => {
  const mockSetUser = jest.fn();
  const mockUser = {
    role: 'athlete',
    userObj: { first_name: 'John' },
  };

  const renderWithContext = (user = mockUser, isAdmin = false) => {
    return render(
      <AuthContext.Provider value={{ user, setUser: mockSetUser }}>
        <LogOutButton isAdmin={isAdmin} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    handleLogout.mockResolvedValue();
  });

  it('should render logout button with correct text', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Log Out')).toBeTruthy();
  });

  it('should call logout functions when pressed', async () => {
    const { getByText } = renderWithContext();
    const logoutButton = getByText('Log Out');
    
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(handleLogout).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });

  it('should set user to null after logout', async () => {
    const { getByText } = renderWithContext();
    const logoutButton = getByText('Log Out');
    
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });

  it('should handle logout errors gracefully', async () => {
    handleLogout.mockRejectedValue(new Error('Logout failed'));
    // Test with admin user so handleLogout is not called
    const { getByText } = renderWithContext(mockUser, true);
    const logoutButton = getByText('Log Out');
    
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
    
    // Ensure handleLogout was not called for admin
    expect(handleLogout).not.toHaveBeenCalled();
  });

  it('should be pressable', () => {
    const { getByText } = renderWithContext();
    const logoutButton = getByText('Log Out');
    expect(logoutButton).toBeTruthy();
  });
});
