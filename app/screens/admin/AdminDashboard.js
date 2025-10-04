import React from "react";
import AdminNavigator from "../../navigation/AdminNavigator";
import AdminHeader from "../../components/shared/GeneralHeader";
import { StatusBar, View, StyleSheet } from "react-native";
import LogOutButton from "../../components/shared/LogOutButton";
function AdminDashboard(props) {
  return (
    <>
      <AdminHeader />
      <AdminNavigator />
      <View style={styles.logOutButtonContainer}>
        <LogOutButton isAdmin={true} />
      </View>
      <StatusBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logOutButtonContainer: {
    position: "absolute",
    bottom: 5,
    width: "100%",
    heightL: "10%",
    alignItems: "center",
  }
});

export default AdminDashboard;
