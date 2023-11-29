import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import LogOutButton from "../components/shared/LogOutButton";
import ChangePasswordButton from "../components/shared/ChangePasswordButton";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from '@expo/vector-icons';
import colors from "../config/colors";
import EditContactInfoModal from "../components/shared/EditContactInfoModal";
import EditBillingInfoModal from "../components/shared/EditBillingInfoModal";

function ProfileSettings({ route }) {

  const [editContactInfoModalVisible, setEditContactInfoModalVisible] = useState(false);
  const [editBillingInfoModalVisible, setEditBillingInfoModalVisible] = useState(false);

  const { user } = route.params;
  // console.warn("user = ", user);
  // console.warn("user.userObj = ", user.userObj);

  return (
    <>
        <EditContactInfoModal
         user={user}
         visible={editContactInfoModalVisible}
         setVisibility={setEditContactInfoModalVisible}
        />
        <EditBillingInfoModal
         user={user}
         visible={editBillingInfoModalVisible}
         setVisibility={setEditBillingInfoModalVisible}
        />
        <View style={styles.container}>
            {/* <Text>Profile settings</Text> */}
            {/* <FontAwesome name="user-circle" size={73} color="white" /> */}
            {/* <View style={styles.iconNameContainer}>
              <MaterialCommunityIcons style={styles.accountIcon} name="account-circle" size={73} color={colors.primary}/>
              <Text>{user.userObj.first_name} {user.userObj.last_name}</Text>
            </View> */}
            <View style={styles.keyPropsContainer}>
              <MaterialCommunityIcons style={styles.accountIcon} name="account-circle" size={73} color={colors.primary}/>
              <View style={styles.keyProps}>
                <Text style={styles.nameProp}>{user.userObj.first_name} {user.userObj.last_name}</Text>
                <Text>{user.role === 'therapist' ? 'Recovery Specialist' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
                <Text>Free</Text>
              </View>
            </View>

            <View style={styles.cardOutterContainer}>
              <View style={styles.cardInnerContainer}>
                <View style={styles.cardContent}>
                  <View style={styles.locationPropContainer}>
                    <MaterialCommunityIcons name="map-marker" style={styles.locationIcon} size={18} color="red"/>
                    <Text style={styles.locationPropLabel}>Location:</Text>
                    <Text style={styles.locationProp}>Los Angeles, California</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.cardOutterContainer}>
              <View style={styles.cardInnerContainer}>
                <Text style={styles.cardTitle}>Contact Information</Text>
                <TouchableOpacity style={styles.button} onPress={() => setEditContactInfoModalVisible(true)}>
                  <View>
                      <Text style={styles.buttonText}>Edit</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.cardContent}>
                  <View style={styles.propContainer}>
                    <Text style={styles.propLabel}>Phone number:</Text>
                    <Text>{user.userObj.mobile}</Text>
                  </View>
                  <View style={styles.propContainer}>
                    <Text style={styles.propLabel}>Email: </Text>
                    <Text>placeholder@email.com</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.cardOutterContainer}>
              <View style={styles.cardInnerContainer}>
              <Text style={styles.cardTitle}>Billing</Text>
                <TouchableOpacity style={styles.button} onPress={() => setEditBillingInfoModalVisible(true)}>
                    <View>
                        <Text style={styles.buttonText}>Edit</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.propContainer}>
                  <View style={styles.cardContent}>
                    <Text style={styles.propLabel}>Payment Method</Text>
                    <Text>XXXX-XXXX-XXXX-1234</Text>
                  </View>
                </View>
              </View>
            </View>


{/* 
            <ScrollView contentContainerStyle={styles.profileSummaryContainer}> */}
              {/* <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Account Type:</Text>
                <Text>{user.role === 'therapist' ? 'Recovery Specialist' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
              </View> */}
              {/* <View style={styles.propContainer}>
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
            </ScrollView> */}
            <View style={styles.buttonContainer}>
              <LogOutButton/>
            </View>

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
      flex: 1,
    },
    iconNameContainer: {
      width: '100%',
      alignItems: 'center',
    },
    keyPropsContainer: {
      width: '100%',
      paddingLeft: '2%',
      paddingRight: '2%',
      alignItems: 'left',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '4%'
    },
    keyProps: {
      marginLeft: '6%',
    },
    nameProp: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    cardOuterContainer:{
        padding: 10,
        width: '100%',
        height: "auto",

    },
    cardInnerContainer: {
        backgroundColor: colors.secondary,
        borderRadius: 15,
        shadowColor: colors.grey,
        shadowOffset: {width:0, height:5},
        shadowOpacity: 1,
        padding: 15,
        marginLeft: '4%',
        marginRight: '4%'
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: '4%',
    },
    cardContent: {
      width: '100%',
      paddingLeft: '2%',
      paddingRight: '2%',
      alignItems: 'left',
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
    locationPropContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center'
    },
    locationIcon: {
      marginRight: 8,
    },
    locationProp: {
      marginLeft: 12,
    },
    locationPropLabel: {
      fontWeight: 'bold'
    },
    propLabel: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: '4%',
    },
    button : {
      backgroundColor: colors.primary,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      width: 55,
      height: 30,
      margin: 5,
      position: 'absolute',
      right: 4,
      top: 4
    },
    buttonText: {
        color: colors.secondary,
        fontSize: 14
    }
    // accountIcon: {
    //   marginTop: '5%'
    // },

  });

export default ProfileSettings;