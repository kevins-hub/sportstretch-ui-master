import React, { useState } from "react";

import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../../config/colors";
import therapistsApi from "../../api/therapists";

function AdminApproveCard(item) {
  const { first_name, last_name, mobile } = item.therapistData;
  const approveTherapist = async () => {
    let manageTherapist = await therapistsApi.approveTherapist(therapist_id);
    manageTherapist.data.enabled === 1
      ? Alert.alert("Therapist Approved")
      : Alert.alert("Error while approving. Please try again.");
  };

  const denyTherapist = async () => {
    let manageTherapist = await therapistsApi.denyTherapist(bookings_id);
    manageTherapist.data.enabled === 0
      ? Alert.alert("Therapist Declined")
      : Alert.alert("Error while declining. Please try again.");
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.verticalLine}></View>

        <View style={styles.rightContainer}>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Recovery Specialist</Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFontName}>{first_name}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFontName}>{mobile}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={approveTherapist}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={denyTherapist}
            >
              <Text style={styles.rejectButtonText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 10,
  },
  acceptButton: {
    alignItems: "center",
    backgroundColor: "#373737",
    borderBottomStartRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
    justifyContent: "center",
    width: "30%",
    margin: "2%",
    height: 25,
    marginHorizontal: "7%",
  },
  acceptButtonText: {
    fontWeight: "300",
    fontSize: 16,
    color: "#ffffff",
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    flexDirection: "row",
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    width: "100%",
    height: 170,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  dateTextMonth: {
    fontWeight: "400",
    fontSize: 24,
  },
  dateTextNumber: {
    fontWeight: "400",
    fontSize: 22,
    top: "5%",
  },

  dynamicText: {
    fontWeight: "bold",
  },
  dynamicTextFontName: {
    fontWeight: "300",
    fontSize: 17,
  },
  dynamicTextFont: {
    fontWeight: "300",
    fontSize: 14,
    color: "#383838",
  },

  staticText: {
    width: "40%",
    margin: "2%",
  },
  staticLabel: {
    fontWeight: "300",
    fontSize: 14,
    color: "#5f5f5f",
  },
  right: {
    marginTop: "1%",
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexShrink: 1,
  },
  rejectButton: {
    alignItems: "center",
    backgroundColor: "#959595",
    borderBottomStartRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
    justifyContent: "center",
    width: "30%",
    margin: "2%",
    height: 25,
    // marginLeft:"5%"
  },
  rejectButtonText: {
    fontWeight: "300",
    fontSize: 16,
    color: "#ffffff",
  },
  verticalLine: {
    backgroundColor: colors.silver,
    height: "90%",
    marginTop: 15,
    width: 1,
  },
});

export default AdminApproveCard;
