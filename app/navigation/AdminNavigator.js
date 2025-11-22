import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AdminApprovals from "../screens/admin/AdminApprovals";
import AdminTherapistsScreen from "../screens/admin/AdminTherapistsScreen";
import AdminBookings from "../screens/admin/AdminBookings";
import colors from "../config/colors";

const Tab = createMaterialTopTabNavigator();

// Custom TabBar component to fix React 19 key prop spreading issue
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarStyle}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.tabItem,
              isFocused && styles.activeTab
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                styles.tabBarLabelStyle,
                {
                  color: isFocused ? colors.secondary : "#383838"
                }
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AdminNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Approvals"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Approvals"
        component={AdminApprovals}
        options={{ tabBarLabel: "Approvals" }}
      ></Tab.Screen>
      <Tab.Screen
        name="Therapists"
        component={AdminTherapistsScreen}
        options={{ tabBarLabel: "Specialists" }}
      ></Tab.Screen>
      <Tab.Screen
        name="Bookings"
        component={AdminBookings}
        options={{ tabBarLabel: "Bookings" }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    width: "98%",
    height: "10%",
    backgroundColor: "#F8F7F7",
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 30,
    marginTop: 2,
    marginLeft: 1,
    elevation: 4,
    shadowColor: "#C4C4C4",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    alignSelf: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 2,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabBarLabelStyle: {
    fontSize: 16,
    fontWeight: "300",
    textTransform: "lowercase",
  },
  tabPanel: {
    width: "100%",
    height: "9%",
    //flex:1.4,
    backgroundColor: "#F8F7F7",
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 50,
    marginTop: 3,
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
});
export default AdminNavigator;
