import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressIndicator from '../../../app/components/athlete/ProgressIndicator';

// Mock LottieView
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  return function MockLottieView(props) {
    return <View testID="progress-animation" {...props} />;
  };
});

describe('ProgressIndicator', () => {
  it('should render animation when visible is true', () => {
    const { getByTestId } = render(<ProgressIndicator visible={true} />);
    expect(getByTestId('progress-animation')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { queryByTestId } = render(<ProgressIndicator visible={false} />);
    expect(queryByTestId('progress-animation')).toBeNull();
  });

  it('should not render when visible is undefined', () => {
    const { queryByTestId } = render(<ProgressIndicator />);
    expect(queryByTestId('progress-animation')).toBeNull();
  });

  it('should pass correct props to LottieView when visible', () => {
    const { getByTestId } = render(<ProgressIndicator visible={true} />);
    const lottieView = getByTestId('progress-animation');
    
    expect(lottieView.props.autoPlay).toBe(true);
    expect(lottieView.props.autoSize).toBe(true);
    expect(lottieView.props.loop).toBe(true);
    expect(lottieView.props.style).toEqual({ width: 150, height: 150 });
  });

  it('should use correct animation source', () => {
    const { getByTestId } = render(<ProgressIndicator visible={true} />);
    const lottieView = getByTestId('progress-animation');
    
    // The source should be the BookingProgress.json animation
    expect(lottieView.props.source).toBeDefined();
  });

  it('should handle boolean false correctly', () => {
    const { queryByTestId } = render(<ProgressIndicator visible={false} />);
    expect(queryByTestId('progress-animation')).toBeNull();
  });

  it('should handle truthy values', () => {
    const { getByTestId } = render(<ProgressIndicator visible={1} />);
    expect(getByTestId('progress-animation')).toBeTruthy();
  });

  it('should handle falsy values', () => {
    const { queryByTestId } = render(<ProgressIndicator visible={0} />);
    expect(queryByTestId('progress-animation')).toBeNull();
  });
});
