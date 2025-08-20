import React from 'react';
import { render } from '@testing-library/react-native';
import DoneIndicator from '../../../app/components/athlete/DoneIndicator';

// Mock LottieView
jest.mock('lottie-react-native', () => {
  const { View } = require('react-native');
  return function MockLottieView(props) {
    return <View testID="lottie-animation" {...props} />;
  };
});

describe('DoneIndicator', () => {
  it('should render animation when visible is true', () => {
    const { getByTestId } = render(<DoneIndicator visible={true} />);
    expect(getByTestId('lottie-animation')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { queryByTestId } = render(<DoneIndicator visible={false} />);
    expect(queryByTestId('lottie-animation')).toBeNull();
  });

  it('should not render when visible is undefined', () => {
    const { queryByTestId } = render(<DoneIndicator />);
    expect(queryByTestId('lottie-animation')).toBeNull();
  });

  it('should pass correct props to LottieView when visible', () => {
    const { getByTestId } = render(<DoneIndicator visible={true} />);
    const lottieView = getByTestId('lottie-animation');
    
    expect(lottieView.props.autoPlay).toBe(true);
    expect(lottieView.props.autoSize).toBe(true);
    expect(lottieView.props.loop).toBe(true);
    expect(lottieView.props.style).toEqual({ width: 150, height: 150 });
  });

  it('should handle boolean false correctly', () => {
    const { queryByTestId } = render(<DoneIndicator visible={false} />);
    expect(queryByTestId('lottie-animation')).toBeNull();
  });

  it('should handle truthy non-boolean values', () => {
    const { getByTestId } = render(<DoneIndicator visible="true" />);
    expect(getByTestId('lottie-animation')).toBeTruthy();
  });

  it('should handle falsy non-boolean values', () => {
    const { queryByTestId } = render(<DoneIndicator visible="" />);
    expect(queryByTestId('lottie-animation')).toBeNull();
  });
});
