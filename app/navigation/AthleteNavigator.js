import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import AthleteBookNow from "../screens/athlete/AthleteBookNow";
import AthletePastBooking from "../screens/athlete/AthletePastBooking";
import AthleteUpcomingBooking from '../screens/athlete/AthleteUpcomingBooking';
import colors from '../config/colors';
import ChangePasswordForm from '../screens/password/ChangePassword';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function AthleteNavigator() {
    return (
        <>
            <Tab.Navigator initialRouteName="BookNow" screenOptions={{
                tabBarActiveTintColor: colors.secondary,
                tabBarInactiveTintColor: colors.primary,
                tabBarIndicatorStyle: {
                    backgroundColor: colors.primary,
                    height: '99%',
                    borderRadius: 30,
                    marginLeft: 5,
                    width: '31%'
                },
                tabBarLabelStyle: { fontSize: 14 },
            }}>
                <Tab.Screen name="BookNow" component={AthleteBookNow} options={{ tabBarLabel: 'Book Now'}}></Tab.Screen>
                <Tab.Screen name="PastBooking" component={AthletePastBooking} options={{ tabBarLabel: 'Past' }}></Tab.Screen>
                <Tab.Screen name="UpcomingBooking" component={AthleteUpcomingBooking} options={{ tabBarLabel: 'Upcoming' }}></Tab.Screen>
            </Tab.Navigator>
        </>
    );
}

export default AthleteNavigator;