import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import DeleteAccountModal from '../../../app/components/shared/DeleteAccountModal';
import AuthContext from '../../../app/auth/context';
import registerApi from '../../../app/api/register';
import authStorage from '../../../app/auth/storage';

// Mock dependencies
jest.mock('../../../app/api/register', () => ({
  deleteAccount: jest.fn(),
}));

jest.mock('../../../app/auth/storage', () => ({
  removeToken: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('DeleteAccountModal', () => {
  const mockSetUser = jest.fn();
  const mockSetVisibility = jest.fn();
  const mockUser = {
    role: 'athlete',
    userObj: { first_name: 'John' },
  };

  const defaultProps = {
    visible: true,
    setVisibility: mockSetVisibility,
    authId: '123',
    isTherapist: false,
  };

  const renderWithContext = (props = defaultProps, user = mockUser) => {
    return render(
      <NavigationContainer>
        <AuthContext.Provider value={{ user, setUser: mockSetUser }}>
          <DeleteAccountModal {...props} />
        </AuthContext.Provider>
      </NavigationContainer>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    registerApi.deleteAccount.mockResolvedValue();
    authStorage.removeToken.mockResolvedValue();
  });

  it('should not render when visible is false', () => {
    const { queryByText } = renderWithContext({ ...defaultProps, visible: false });
    expect(queryByText('Are you sure you want to delete your account?')).toBeNull();
  });

  it('should render modal when visible is true', () => {
    const { getByText } = renderWithContext();
    expect(getByText(/Are you sure you want to delete your account\?/i)).toBeTruthy();
  });

  it('should show therapist-specific message for therapists', () => {
    const { getByText } = renderWithContext({ 
      ...defaultProps, 
      isTherapist: true 
    });
    expect(getByText(/Deleting your account will not unsubscribe you/)).toBeTruthy();
  });

  it('should not show therapist message for non-therapists', () => {
    const { queryByText } = renderWithContext({ 
      ...defaultProps, 
      isTherapist: false 
    });
    expect(queryByText(/Deleting your account will not unsubscribe you/)).toBeNull();
  });

  it('should close modal when cancel button is pressed', () => {
    const { getByText } = renderWithContext();
    const cancelButton = getByText('Cancel');
    
    fireEvent.press(cancelButton);
    
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it('should handle text input changes', () => {
    const { getByDisplayValue } = renderWithContext();
    const textInput = getByDisplayValue('');
    
    fireEvent.changeText(textInput, 'delete');
    
    // Text input should handle the change
    expect(textInput).toBeTruthy();
  });

  it('should not delete account if input is not "delete"', async () => {
    const { getByPlaceholderText, getByText } = renderWithContext();
    const textInput = getByPlaceholderText('Type here');
    const deleteButton = getByText('Delete');
    
    fireEvent.changeText(textInput, 'wrong');
    fireEvent.press(deleteButton);
    
    expect(registerApi.deleteAccount).not.toHaveBeenCalled();
  });

  it('should delete account when "delete" is typed correctly', async () => {
    const { getByPlaceholderText, getByText } = renderWithContext();
    const textInput = getByPlaceholderText('Type here');
    const deleteButton = getByText('Delete');
    
    fireEvent.changeText(textInput, 'delete');
    fireEvent.press(deleteButton);
    
    await waitFor(() => {
      expect(registerApi.deleteAccount).toHaveBeenCalledWith('123');
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(authStorage.removeToken).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });

  it('should handle case insensitive delete confirmation', async () => {
    const { getByPlaceholderText, getByText } = renderWithContext();
    const textInput = getByPlaceholderText('Type here');
    const deleteButton = getByText('Delete');
    
    fireEvent.changeText(textInput, 'DELETE');
    fireEvent.press(deleteButton);
    
    await waitFor(() => {
      expect(registerApi.deleteAccount).toHaveBeenCalledWith('123');
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    registerApi.deleteAccount.mockRejectedValue(new Error('API Error'));
    
    const { getByPlaceholderText, getByText } = renderWithContext();
    const textInput = getByPlaceholderText('Type here');
    const deleteButton = getByText('Delete');
    
    fireEvent.changeText(textInput, 'delete');
    fireEvent.press(deleteButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting account', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('should render delete confirmation prompt', () => {
    const { getByText } = renderWithContext();
    expect(getByText("Type 'delete' to confirm")).toBeTruthy();
  });
});
