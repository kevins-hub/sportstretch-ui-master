import React from "react";
import { View, Button, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import {
  useStripe,
  CardField,
  confirmPayment,
  ApplePayButton,
  PaymentSheet,
  useConfirmPayment
} from "@stripe/stripe-react-native";

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { presentApplePay, confirmApplePayPayment } = useStripe();

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch("YOUR_BACKEND_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1000, // Specify the amount here
      }),
    });
    const { clientSecret } = await response.json();
    return { clientSecret };
  };

  const handleApplePayPress = async () => {
    const { error, paymentMethod } = await presentApplePay({
      cartItems: [{ label: "Your Product", amount: "10.00" }],
      country: "US",
      currency: "usd",
    });

    if (error) {
      console.error(error);
    } else {
      const paymentIntentResult = await confirmApplePayPayment(clientSecret);
      if (paymentIntentResult.error) {
        console.error(paymentIntentResult.error);
      } else {
        // Success
      }
    }
  };

  const handlePayment = async () => {
    // Fetch the payment intent client secret from your backend
    const { clientSecret } = await fetchPaymentIntentClientSecret();

    // Initialize the payment sheet
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
    });

    if (error) {
      console.error(error);
    } else {
      // Present the payment sheet
      const result = await presentPaymentSheet();

      if (result.error) {
        console.error(result.error);
      } else {
        alert("Payment successful!");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Details</Text>
      {/* <PaymentSheet
        paymentIntentClientSecret={""}
        onPaymentSuccess={async () => {
          // Your logic goes here
        }}
        /> */}
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 10,
        }}
        onCardChange={(cardDetails) => {
          console.log(cardDetails);
        }}
      />
      {/* Billing Address Form */}
      {/* <TextInput style={styles.input} placeholder="Name" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
      />
      <TextInput style={styles.input} placeholder="Address" />
      <TextInput style={styles.input} placeholder="City" />
      <TextInput
        style={styles.input}
        placeholder="ZIP Code"
        keyboardType="numeric"
      /> */}

      {/* Apple Pay Button */}
      {/* <ApplePayButton
        type="plain"
        style={styles.applePayButton}
        onPress={handleApplePayPress}
      /> */}

      {/* Your existing payment method components */}
    </View>
//     <View>
//       {/* Display the card input field */}
//       <CardField
//         postalCodeEnabled={true}
//         placeholder={{
//           number: '4242 4242 4242 4242',
//         }}
//         cardStyle={{
//           backgroundColor: '#FFFFFF',
//           textColor: '#000000',
//         }}
//         style={{
//           width: '100%',
//           height: 50,
//           marginVertical: 30,
//         }}
//         onCardChange={(cardDetails) => {
//           console.log(cardDetails);
//         }}
//       />
//       <Button title="Pay" onPress={handlePayment} />
//     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 4,
    marginBottom: 10,
    borderRadius: 5,
  },
  applePayButton: {
    height: 44, // Adjust based on your needs
    marginTop: 20,
  },
});

export default PaymentScreen;
