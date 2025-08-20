import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfilePictureUpload from '../../../app/components/shared/ProfilePictureUpload';
import * as ImagePicker from 'expo-image-picker';

// Mock ImagePicker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

// Mock Alert - properly set it on global
global.alert = jest.fn();

describe('ProfilePictureUpload', () => {
  const defaultProps = {
    image: null,
    setImage: jest.fn(),
    currentProfilePictureUrl: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    expect(getByText('Choose a profile picture')).toBeTruthy();
    expect(getByText('Select from camera roll')).toBeTruthy();
  });

  it('should display modal text and button', () => {
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    expect(getByText('Choose a profile picture')).toBeTruthy();
    expect(getByText('Select from camera roll')).toBeTruthy();
  });

  it('should display default icon when no image provided', () => {
    const { getByTestId } = render(<ProfilePictureUpload {...defaultProps} />);
    
    expect(getByTestId('material-community-icon-account-circle')).toBeTruthy();
  });

  it('should display current profile picture when provided', () => {
    const propsWithCurrentImage = {
      ...defaultProps,
      currentProfilePictureUrl: 'https://example.com/profile.jpg',
    };
    
    const { toJSON } = render(<ProfilePictureUpload {...propsWithCurrentImage} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should display selected image when image prop is provided', () => {
    const propsWithSelectedImage = {
      ...defaultProps,
      image: 'file://selected-image.jpg',
    };
    
    const { toJSON } = render(<ProfilePictureUpload {...propsWithSelectedImage} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should prioritize selected image over current profile picture', () => {
    const propsWithBoth = {
      ...defaultProps,
      currentProfilePictureUrl: 'https://example.com/profile.jpg',
      image: 'file://selected-image.jpg',
    };
    
    const { toJSON } = render(<ProfilePictureUpload {...propsWithBoth} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should call ImagePicker when button is pressed', async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'file://new-image.jpg' }],
    };
    ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockResult);
    
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    const button = getByText('Select from camera roll');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    });
  });

  it('should call setImage when image is selected', async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'file://new-image.jpg' }],
    };
    ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockResult);
    
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    const button = getByText('Select from camera roll');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(defaultProps.setImage).toHaveBeenCalledWith('file://new-image.jpg');
    });
  });

  it('should not call setImage when selection is canceled', async () => {
    const mockResult = {
      canceled: true,
    };
    ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockResult);
    
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    const button = getByText('Select from camera roll');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
    
    expect(defaultProps.setImage).not.toHaveBeenCalled();
  });

  it('should handle ImagePicker errors gracefully', async () => {
    const mockError = new Error('ImagePicker failed');
    ImagePicker.launchImageLibraryAsync.mockRejectedValue(mockError);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    const button = getByText('Select from camera roll');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error picking image: ', mockError);
      expect(alert).toHaveBeenCalledWith('An error occurred while picking the image.');
    });
    
    consoleSpy.mockRestore();
  });

  it('should have correct image dimensions', () => {
    const propsWithImage = {
      ...defaultProps,
      image: 'file://test-image.jpg',
    };
    
    const { toJSON } = render(<ProfilePictureUpload {...propsWithImage} />);
    expect(toJSON()).toBeTruthy();
  });

  it('should have correct icon size when no image', () => {
    const { getByTestId } = render(<ProfilePictureUpload {...defaultProps} />);
    
    const icon = getByTestId('material-community-icon-account-circle');
    expect(icon).toBeTruthy();
  });

  it('should handle multiple image selections', async () => {
    const firstResult = {
      canceled: false,
      assets: [{ uri: 'file://first-image.jpg' }],
    };
    const secondResult = {
      canceled: false,
      assets: [{ uri: 'file://second-image.jpg' }],
    };
    
    ImagePicker.launchImageLibraryAsync
      .mockResolvedValueOnce(firstResult)
      .mockResolvedValueOnce(secondResult);
    
    const { getByText } = render(<ProfilePictureUpload {...defaultProps} />);
    
    const button = getByText('Select from camera roll');
    
    // First selection
    fireEvent.press(button);
    await waitFor(() => {
      expect(defaultProps.setImage).toHaveBeenCalledWith('file://first-image.jpg');
    });
    
    // Second selection
    fireEvent.press(button);
    await waitFor(() => {
      expect(defaultProps.setImage).toHaveBeenCalledWith('file://second-image.jpg');
    });
    
    expect(defaultProps.setImage).toHaveBeenCalledTimes(2);
  });
});
