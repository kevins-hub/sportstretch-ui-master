import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AthleteForm from "../screens/athlete/AthleteSignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import TherapistRegistrationPending from "../screens/therapist/TherapistRegistrationPending";
import TherapistForm from "../screens/therapist/TherapistSignUpScreen";

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterAthlete" component={AthleteForm} />
      <Stack.Screen name="RegisterTherapist" component={TherapistForm} />
      <Stack.Screen name="TherapistRegistrationPending" component={TherapistRegistrationPending} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
