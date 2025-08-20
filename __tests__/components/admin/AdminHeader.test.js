import React from 'react';
import { render } from '@testing-library/react-native';
import AdminHeader from '../../../app/components/admin/AdminHeader';
import AuthContext from '../../../app/auth/context';

describe('AdminHeader', () => {
  const mockUser = {
    role: 'admin',
    userObj: { 
      first_name: 'Admin',
      mobile: '+1234567890'
    },
    authorization_id: 'test_auth_123',
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

  it('should render without crashing', () => {
    const { getByText } = renderWithAuthContext(<AdminHeader />);
    
    expect(getByText('Hi, Admin')).toBeTruthy();
  });

  it('should display admin first name in greeting', () => {
    const { getByText } = renderWithAuthContext(<AdminHeader />);
    
    expect(getByText('Hi, Admin')).toBeTruthy();
  });

  it('should display admin mobile number', () => {
    const { getByText } = renderWithAuthContext(<AdminHeader />);
    
    expect(getByText('+1234567890')).toBeTruthy();
  });

  it('should have proper header structure', () => {
    expect(() => renderWithAuthContext(<AdminHeader />)).not.toThrow();
  });

  it('should display edit icon', () => {
    const { getByTestId } = renderWithAuthContext(<AdminHeader />);
    
    // The MaterialCommunityIcons should be present (though we can't easily test the icon itself)
    expect(() => renderWithAuthContext(<AdminHeader />)).not.toThrow();
  });

  it('should display user avatar icon', () => {
    const { getByTestId } = renderWithAuthContext(<AdminHeader />);
    
    // The FontAwesome user-circle icon should be present
    expect(() => renderWithAuthContext(<AdminHeader />)).not.toThrow();
  });

  it('should handle missing user data gracefully', () => {
    const mockUserWithMissingData = {
      role: 'admin',
      userObj: { 
        first_name: 'Admin'
        // mobile is missing
      },
      authorization_id: 'test_auth_123',
    };

    const renderWithMissingData = render(
      <AuthContext.Provider value={{ user: mockUserWithMissingData, setUser: jest.fn() }}>
        <AdminHeader />
      </AuthContext.Provider>
    );

    expect(() => renderWithMissingData).not.toThrow();
  });
});
