import React, { useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import AuthContext from "../../auth/context";
import { handleLogout } from "../../api/revenuecatService";

function LogOutButton(isAdmin = false) {
  const authContext = useContext(AuthContext);

  const logOutUser = async () => {
    // Call the logout function from revenuecatService
    await handleLogout();
    authContext.setUser(null);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={logOutUser}>
      <View>
        <Text style={styles.text}>Log Out</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
  },

  text: {
    color: "red",
    fontSize: 12,
  },
});

export default LogOutButton;
