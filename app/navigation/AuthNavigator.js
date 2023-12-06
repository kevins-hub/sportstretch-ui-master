import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AthleteForm from "../screens/athlete/AthleteSignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import TherapistRegistrationPending from "../screens/therapist/TherapistRegistrationPending";
import TherapistForm from "../screens/therapist/TherapistSignUpScreen";
import ForgotPasswordVerifyEmailForm from "../screens/password/ForgotPasswordVerifyEmail";
import ForgotPasswordVerifyResetTokenForm from "../screens/password/ForgotPasswordVerifyResetToken";
import ResetPasswordForm from "../screens/password/ResetPassword";

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
      <Stack.Screen
        name="TherapistRegistrationPending"
        component={TherapistRegistrationPending}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordVerifyEmailForm}
      />
      <Stack.Screen
        name="ForgotPasswordVerifyToken"
        component={ForgotPasswordVerifyResetTokenForm}
      />
      <Stack.Screen name="ResetPassword" component={ResetPasswordForm} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
