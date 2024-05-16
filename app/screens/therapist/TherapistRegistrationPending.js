import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { useNavigation } from "@react-navigation/native";

function TherapistRegistrationPending(props) {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  }
  , []);

  return (
    <View style={styles.container}>
      <Text style={styles.pendingText}>
        Your registration request has been generated.
      </Text>
      <Text style={styles.pendingText}>
        Please wait for the administrator to review and approve your request.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Constants.statusBarHeight,
    alignItems: "stretch",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  pendingText: {
    fontSize: 26,
    fontWeight: "400",
    padding: 10,
    color: colors.grey,
    marginBottom: 10,
  },
});
export default TherapistRegistrationPending;
