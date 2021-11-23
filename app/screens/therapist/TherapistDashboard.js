import React, { Component } from 'react';
import { StyleSheet,View} from 'react-native';
import Constants from "expo-constants";
import { NavigationContainer } from '@react-navigation/native';
import TherapistHeader from '../../components/therapist/TherapistHeader';
import TherapistAvailability from '../../components/therapist/TherapistAvailability';
import TherapistNavigator from '../../navigation/TherapistNavigator';

const TherapistDashboard = () => {
    return ( 
        <View style={styles.container}>
            <TherapistHeader name="David" phone="7167654321" avgRating="3.5"/>
            <TherapistAvailability/>
            <NavigationContainer>
                <TherapistNavigator/>
            </NavigationContainer>
        </View>
     );
}

const styles = StyleSheet.create({
    container:{
        paddingTop: Constants.statusBarHeight,
        flex:1,
    },
 })
export default TherapistDashboard;
