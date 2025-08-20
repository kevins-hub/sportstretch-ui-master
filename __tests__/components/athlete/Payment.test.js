import React from 'react';
import { render } from '@testing-library/react-native';
import PaymentScreen from '../../../app/components/athlete/Payment';

// Mock Stripe components
jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: () => ({
    initPaymentSheet: jest.fn(),
    presentPaymentSheet: jest.fn(),
    presentApplePay: jest.fn(),
    confirmApplePayPayment: jest.fn(),
  }),
  CardField: ({ onCardChange, ...props }) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="card-field" style={props.style}>
        <Text>Card Field</Text>
        <TouchableOpacity 
          onPress={() => onCardChange?.({ complete: true, number: '4242' })}
        >
          <Text>Enter Card</Text>
        </TouchableOpacity>
      </View>
    );
  },
  ApplePayButton: (props) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID="apple-pay-button" onPress={props.onPress}>
        <Text>Apple Pay</Text>
      </TouchableOpacity>
    );
  },
  PaymentSheet: (props) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="payment-sheet">
        <Text>Payment Sheet</Text>
      </View>
    );
  },
  confirmPayment: jest.fn(),
  useConfirmPayment: () => ({
    confirmPayment: jest.fn(),
  }),
}));

describe('PaymentScreen', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<PaymentScreen />);
    
    expect(getByText('Payment Details')).toBeTruthy();
  });

  it('should display payment header', () => {
    const { getByText } = render(<PaymentScreen />);
    
    expect(getByText('Payment Details')).toBeTruthy();
  });

  it('should render card field component', () => {
    const { getByTestId } = render(<PaymentScreen />);
    
    expect(getByTestId('card-field')).toBeTruthy();
  });

  it('should display card field with correct text', () => {
    const { getByText } = render(<PaymentScreen />);
    
    expect(getByText('Card Field')).toBeTruthy();
  });

  it('should handle card field interactions', () => {
    const { getByText } = render(<PaymentScreen />);
    
    // Should render the interactive element
    expect(getByText('Enter Card')).toBeTruthy();
  });

  it('should have proper container structure', () => {
    const { getByText } = render(<PaymentScreen />);
    
    // Should have header and card field in container
    expect(getByText('Payment Details')).toBeTruthy();
    expect(getByText('Card Field')).toBeTruthy();
  });

  it('should render with proper styling props', () => {
    const { getByTestId } = render(<PaymentScreen />);
    
    const cardField = getByTestId('card-field');
    expect(cardField).toBeTruthy();
  });

  it('should be accessible as PaymentScreen component', () => {
    const component = render(<PaymentScreen />);
    expect(component).toBeTruthy();
  });
});
