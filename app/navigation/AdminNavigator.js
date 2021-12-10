import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {StyleSheet, View} from 'react-native';
import AdminApprovals from "../screens/admin/AdminApprovals";
import AdminTherapistsScreen from "../screens/admin/AdminTherapistsScreen";
import AdminBookings from '../screens/admin/AdminBookings';
import colors from '../config/colors';

const Tab = createMaterialTopTabNavigator();

function AdminNavigator() {
    return (
        <Tab.Navigator initialRouteName="Approvals" 
        tabBarLabelOptions={
                {
                    labelStyle: { textTransform: 'lowercase' },    
                
                    UpperCaseLabel:false
                }
        }
            
            screenOptions={{
                style:{
                    width: '98%',
                    height: '10%',
                    //flex:1.4,
                    backgroundColor: '#F8F7F7',
                    borderColor:'#C4C4C4',
                    borderWidth:1,
                    borderRadius: 30,
                    marginTop:2,
                    marginLeft:1,
                    elevation:4,
                    shadowColor:"#C4C4C4",
                    shadowOffset:{
                      width:10,
                      height:20,
                    },
                    shadowOpacity:0.5,
                    shadowRadius:20,
                    },
                labelStyle: { textTransform: 'lowercase' },    
                    
            tabBarActiveTintColor: colors.secondary,
            tabBarInactiveTintColor: '#383838',
            tabBarIndicatorStyle: {
                backgroundColor: colors.primary,
                height: '99%',
                borderRadius: 50,
                marginLeft: 0,
                width: '33.2%'
            },
            tabBarLabelStyle: { 
                fontSize: 16,
                fontWeight:'300',
                marginTop:5,
                paddingTop:4
                 },
          }}
          >
            <Tab.Screen name="Approvals" component={AdminApprovals} options={{ tabBarLabel: 'Approvals'}}></Tab.Screen>
            <Tab.Screen name="Therapists" component={AdminTherapistsScreen} options={{ tabBarLabel: 'Therapists' }}></Tab.Screen>
            <Tab.Screen name="Bookings" component={AdminBookings} options={{ tabBarLabel: 'Bookings' }}></Tab.Screen>
        </Tab.Navigator>
        
    );
}

const styles = StyleSheet.create({
    tabPanel:{
        width: '100%',
        height: '9%',
        //flex:1.4,
        backgroundColor: '#F8F7F7',
        borderColor:'#C4C4C4',
        borderWidth:1,
        borderRadius: 50,
        marginTop:3,
        shadowOffset:{
          width:10,
          height:20,
        },
        shadowOpacity:0.5,
        shadowRadius:20,
        },
})
export default AdminNavigator;