import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TherapistPastBooking from '../screens/therapist/TherapistPastBooking';
import TherapistUpcomingBooking from '../screens/therapist/TherapistUpcomingBooking';
import colors from '../config/colors';



const Tab = createMaterialTopTabNavigator();

function TherapistNavigator() {
    return (
        <Tab.Navigator initialRouteName="PastBooking" screenOptions={{
            tabBarActiveTintColor: colors.secondary,
            tabBarInactiveTintColor: colors.primary,
            tabBarIndicatorStyle: {
                backgroundColor: colors.primary,
                height: '99%',
                borderRadius: 30,
                marginLeft: 5,
                width: '50%'
            },
            tabBarLabelStyle: { fontSize: 14 },
          }}>
            <Tab.Screen name="PastBooking" component={TherapistPastBooking} options={{ tabBarLabel: 'Past' }}></Tab.Screen>
            <Tab.Screen name="UpcomingBooking" component={TherapistUpcomingBooking} options={{ tabBarLabel: 'Upcoming' }}></Tab.Screen>
        </Tab.Navigator>
    );
}

export default TherapistNavigator;