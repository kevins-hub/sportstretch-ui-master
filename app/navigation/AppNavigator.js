// navigation for app between main experience and profile settings
import React from "react";
//import { createMaterialBottomTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AthleteBookNow from "../screens/athlete/AthleteBookNow";
import AthletePastBooking from "../screens/athlete/AthletePastBooking";
import AthleteUpcomingBooking from "../screens/athlete/AthleteUpcomingBooking";
import colors from "../config/colors";
import ChangePasswordForm from "../screens/password/ChangePasswordModal";
import ProfileSettings from "../screens/ProfileSettings";
import { NavigationContainer } from "@react-navigation/native";
// import AthleteBookNow from '../screens/athlete/AthleteBookNow';
import GeneralHeader from "../components/shared/GeneralHeader";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TherapistAvailability from "../components/therapist/TherapistAvailability";
import TherapistPastBooking from "../screens/therapist/TherapistPastBooking";
import TherapistUpcomingBooking from "../screens/therapist/TherapistUpcomingBooking";

const appTabs = createBottomTabNavigator();

function AppNavigator({ user }) {
  const pastBookingComponent =
    user.role === "therapist" ? TherapistPastBooking : AthletePastBooking;
  const upcomingBookingComponent =
    user.role === "therapist"
      ? TherapistUpcomingBooking
      : AthleteUpcomingBooking;

  return (
    <>
      <GeneralHeader />
      {user.role === "therapist" && <TherapistAvailability />}
      <appTabs.Navigator
        initialRouteName={user.role === "athlete" ? "Make an Appointment" : "Upcoming Appointments"}
        screenOptions={({ route }) => ({
          // tabBarActiveTintColor: colors.secondary,
          tabBarInactiveTintColor: colors.primary,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: "99%",
            borderRadius: 30,
            marginLeft: 5,
            width: "31%",
          },
          tabBarLabelStyle: { fontSize: 14 },
          tabBarIcon: ({ color, size }) => {
            const icons = {
              "Make an Appointment": "calendar",
              "Past Appointments": "history",
              "Upcoming Appointments": "calendar-clock",
              Profile: "account-circle",
            };
            return (
              <MaterialCommunityIcons
                name={icons[route.name]}
                color={color}
                size={size}
              />
            );
          },
        })}
      >
        {user.role === "athlete" && (
          <appTabs.Screen
            name="Make an Appointment"
            component={AthleteBookNow}
            options={{ tabBarLabel: "Search" }}
          ></appTabs.Screen>
        )}
        <appTabs.Screen
          name="Past Appointments"
          component={pastBookingComponent}
          options={{ tabBarLabel: "History" }}
        ></appTabs.Screen>
        <appTabs.Screen
          name="Upcoming Appointments"
          component={upcomingBookingComponent}
          options={{ tabBarLabel: "Upcoming" }}
        ></appTabs.Screen>
        <appTabs.Screen
          name="Profile"
          component={ProfileSettings}
          initialParams={{ user: user }}
          options={{ tabBarLabel: "Profile" }}
        ></appTabs.Screen>
      </appTabs.Navigator>
    </>
  );
}

export default AppNavigator;
