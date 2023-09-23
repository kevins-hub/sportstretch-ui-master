import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import LogOutButton from "../components/shared/LogOutButton";
import ChangePasswordButton from "../components/shared/ChangePasswordButton";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from '@expo/vector-icons';
import colors from "../config/colors";

function ProfileSettings({ route }) {

  const { user } = route.params;
  // console.warn("user = ", user);
  // console.warn("user.userObj = ", user.userObj);

  return (
    <>
        <View style={styles.container}>
            {/* <Text>Profile settings</Text> */}
            {/* <FontAwesome name="user-circle" size={73} color="white" /> */}
            <View style={styles.iconNameContainer}>
              <MaterialCommunityIcons style={styles.accountIcon} name="account-circle" size={73} color={colors.primary}/>
              <Text>{user.userObj.first_name} {user.userObj.last_name}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.profileSummaryContainer}>
              <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Account Type:</Text>
                <Text>{user.role === 'therapist' ? 'Recovery Specialist' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
              </View>
              <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Subscription:</Text>
                <Text>Free</Text>
              </View>
              <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Location:</Text>
                <Text>California</Text>
              </View>
              <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Phone number:</Text>
                <Text>{user.userObj.mobile}</Text>
              </View>
              <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Email: </Text>
                <Text>placeholder@email.com</Text>
              </View>
              <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Payment Method: </Text>
                <Text>XXXX-XXXX-XXXX-1234</Text>
              </View>
            </ScrollView>

            <LogOutButton/>
        </View>

    </>
  );
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      alignItems: 'center',
      flex: 1,
    },
    iconNameContainer: {
      width: '100%',
      alignItems: 'center',
    },
    profileSummaryContainer: {
      width: '100%',
      marginTop: '4%',
      paddingLeft: '2%',
      paddingRight: '2%',
      alignItems: 'left',
    },
    propContainer: {
      marginBottom: 10
    },
    propLabel: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    accountIcon: {
      marginTop: '5%'
    },

  });

export default ProfileSettings;
