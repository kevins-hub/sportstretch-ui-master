import { StripeProvider } from '@stripe/stripe-react-native';
import { Elements } from '@stripe/stripe-react-native';
import { CardForm, CardField, PlatformPayButton } from '@stripe/stripe-react-native';
import { AddressSheet } from '@stripe/stripe-react-native';

import {
    View,
    StyleSheet,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Platform,
  } from "react-native";
import { Card } from 'react-native-paper';

function PaymentOld() {
  return (
    <StripeProvider
      publishableKey="pk_test_51OnV42DyUl485VKLZRnwkZn04TybrH3innsENQPR7WlE8MUy9Em0A5rP4TAixIG8QwoIWh031hJSPMOTtMc1cZQt00b9PAOcUb"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
        <View>
            <Text>Payment</Text>
            <PlatformPayButton></PlatformPayButton>
            <CardForm>
                <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                        number: '4242 4242  4242 4242', // Change this to test 3D Secure authentication on a card payment                                   
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 30,
                    }}
                    onCardChange={(cardDetails) => {
                        console.log('cardDetails', cardDetails);
                    }}
                    onFocus={(focusedField) => {
                        console.log('focusField', focusedField);
                    }}
                />
            </CardForm>
            
            {/* <form>
                <PaymentElement></PaymentElement>
            </form> */}
        </View>
    </StripeProvider>
  );
}

export default PaymentOld;