import authStorage from '../../app/auth/storage';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

// Mock SecureStore
jest.mock('expo-secure-store');
jest.mock('jwt-decode');

const mockSecureStore = SecureStore;
const mockJwtDecode = jwtDecode;

describe('Auth Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('storeToken', () => {
    it('should store auth token successfully', async () => {
      const token = 'test-auth-token';
      mockSecureStore.setItemAsync.mockResolvedValue();

      await authStorage.storeToken(token);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('authToken', token);
    });

    it('should handle storage error', async () => {
      const error = new Error('Storage failed');
      mockSecureStore.setItemAsync.mockRejectedValue(error);

      await authStorage.storeToken('test-token');

      expect(console.log).toHaveBeenCalledWith('Error storing the auth token', error);
    });
  });

  describe('getToken', () => {
    it('should retrieve auth token successfully', async () => {
      const token = 'test-auth-token';
      mockSecureStore.getItemAsync.mockResolvedValue(token);

      const result = await authStorage.getToken();

      expect(result).toBe(token);
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('authToken');
    });

    it('should handle retrieval error', async () => {
      const error = new Error('Retrieval failed');
      mockSecureStore.getItemAsync.mockRejectedValue(error);

      const result = await authStorage.getToken();

      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting the auth token', error);
    });

    it('should return null when no token exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await authStorage.getToken();

      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should decode and return user from token', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const decodedUser = {
        id: '123',
        role: 'athlete',
        email: 'test@example.com',
      };

      mockSecureStore.getItemAsync.mockResolvedValue(token);
      mockJwtDecode.mockReturnValue(decodedUser);

      const result = await authStorage.getUser();

      expect(result).toEqual(decodedUser);
      expect(mockJwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return null when no token exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await authStorage.getUser();

      expect(result).toBeNull();
      expect(mockJwtDecode).not.toHaveBeenCalled();
    });

    it('should handle JWT decode error', async () => {
      const token = 'invalid-jwt-token';
      mockSecureStore.getItemAsync.mockResolvedValue(token);
      mockJwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authStorage.getUser()).rejects.toThrow('Invalid token');
    });
  });

  describe('removeToken', () => {
    it('should remove auth token successfully', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();

      await authStorage.removeToken();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('authToken');
    });

    it('should handle removal error', async () => {
      const error = new Error('Removal failed');
      mockSecureStore.deleteItemAsync.mockRejectedValue(error);

      await authStorage.removeToken();

      expect(console.log).toHaveBeenCalledWith('Error removing the auth token', error);
    });
  });

  describe('storeEmail', () => {
    it('should store user email successfully', async () => {
      const email = 'test@example.com';
      mockSecureStore.setItemAsync.mockResolvedValue();

      await authStorage.storeEmail(email);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('userEmail', email);
    });

    it('should handle email storage error', async () => {
      const error = new Error('Email storage failed');
      mockSecureStore.setItemAsync.mockRejectedValue(error);

      await authStorage.storeEmail('test@example.com');

      expect(console.log).toHaveBeenCalledWith('Error storing the user email', error);
    });
  });

  describe('getEmail', () => {
    it('should retrieve user email successfully', async () => {
      const email = 'test@example.com';
      mockSecureStore.getItemAsync.mockResolvedValue(email);

      const result = await authStorage.getEmail();

      expect(result).toBe(email);
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('userEmail');
    });

    it('should handle email retrieval error', async () => {
      const error = new Error('Email retrieval failed');
      mockSecureStore.getItemAsync.mockRejectedValue(error);

      const result = await authStorage.getEmail();

      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error getting the user email', error);
    });
  });
});
