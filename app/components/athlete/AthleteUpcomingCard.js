import React from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../../config/colors";

function AthleteUpcomingCard({
  BookingMonth,
  BookingDay,
  BookingTime,
  fname,
  bookingId,
  confirmationStatus,
}) {
  return (
    <View style={styles.OuterContainer}>
      <View style={styles.Container}>
        <View style={styles.BookingDateContainer}>
          <Text style={styles.DateMonth}>{BookingMonth}</Text>
          <Text style={styles.DateDay}>{BookingDay}</Text>
        </View>

        <View style={styles.VerticalLine}></View>

        <View style={styles.BookingDetailsContainer}>
          <View style={styles.DetailsContainer}>
            <Text>Appointment Time : </Text>
            <Text>{BookingTime}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Therapist : </Text>
            <Text>{fname}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Booking ID : </Text>
            <Text>{bookingId}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Status : </Text>
            <Text style={confirmationStatus === "Approved" ? styles.ApprovedText : confirmationStatus === "Pending" ? styles.PendingText : styles.DeclinedText}>{confirmationStatus}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  OuterContainer: {
    padding: 10,
  },

  Container: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    flexDirection: "row",
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    width: "100%",
    height: 150,
    padding: 10,
  },

  BookingDateContainer: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },

  BookingDetailsContainer: {
    flex: 0.75,
    justifyContent: "center",
    paddingLeft: 10,
  },

  DateDay: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "400",
  },

  DateMonth: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "400",
  },

  DetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    overflow: "hidden",
  },

  VerticalLine: {
    backgroundColor: colors.silver,
    height: "80%",
    marginTop: 15,
    width: 1,
  },

  ApprovedText: {
    color: "green",
    fontStyle: "italic",
  },

  PendingText: {
    color: "gold",
    fontStyle: "italic",
  },

  DeclinedText: {
    color: colors.grey,
    fontStyle: "italic",
  },
});

export default AthleteUpcomingCard;
