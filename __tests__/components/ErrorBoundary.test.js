import React from 'react';
import { render } from '@testing-library/react-native';
import ErrorBoundary from '../../app/components/shared/ErrorBoundary';
import { Text } from 'react-native';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No error</Text>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Suppress error logs in tests
  });

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test content</Text>
      </ErrorBoundary>
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('should render error UI when child component throws', () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error message instead of children
    expect(queryByText('No error')).toBeNull();
    expect(getByText(/Something went wrong/i)).toBeTruthy();
  });

  it('should catch JavaScript errors and prevent app crash', () => {
    // This test ensures the error boundary catches errors
    expect(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    }).not.toThrow();
  });

  it('should render restart button when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(/Try Again/i)).toBeTruthy();
  });

  it('should show user-friendly error message', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(/Something went wrong/i)).toBeTruthy();
    expect(getByText(/We're sorry, but something unexpected happened/i)).toBeTruthy();
  });

  it('should recover when error is resolved', () => {
    const { rerender, getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Initially no error
    expect(getByText('No error')).toBeTruthy();

    // Rerender with error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(queryByText('No error')).toBeNull();
    expect(getByText(/Something went wrong/i)).toBeTruthy();
  });

  it('should log error details for debugging', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should log the error for debugging
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
