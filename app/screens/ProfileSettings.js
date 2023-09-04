import React, { useEffect } from "react";
import { View, Text } from "react-native";
import LogOutButton from "../components/shared/LogOutButton";
import ChangePasswordButton from "../components/shared/ChangePasswordButton";

function ProfileSettings({ route }) {

  const { user } = route.params;
  console.warn("user = ", user);
  console.warn("user.userObj = ", user.userObj);

  return (
    <>
        <View>
            <Text>Profile settings</Text>
            <Text>Account Type: {user.role}</Text>
            <Text>Subscription: Free</Text>
            <Text>Name: {user.userObj.first_name} {user.userObj.last_name}</Text>
            <Text>Phone number: {user.userObj.mobile}</Text>
            <Text>Email: {user.userObj.email}</Text>

            <Text></Text>
        </View>
        <ChangePasswordButton/>
        <LogOutButton/>
    </>
  );
}

export default ProfileSettings;
