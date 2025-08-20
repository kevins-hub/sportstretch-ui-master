import React from "react";
import { View, StyleSheet, Text } from "react-native";

import colors from "../../config/colors";

function AthleteUpcomingCard({
  BookingMonth,
  BookingDay,
  BookingTime,
  duration,
  fname,
  bookingId,
  confirmationStatus,
}) {
  // duration string is in hours, e.g. "1.5" for 1 hour and 30 minutes
  // format duration to at most 1 decimal place e.g. "2 hours", "2.5 hours", "30 minutes", "1 hour"
  const formattedDuration = (() => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${
        minutes
      } minute${minutes > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return "0 minutes";
    }
  })();
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
            <Text>Appointment Time (local) : </Text>
            <Text>{BookingTime}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Duration : </Text>
            <Text>{formattedDuration}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Recovery Specialist : </Text>
            <Text>{fname}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Booking ID : </Text>
            <Text>{bookingId}</Text>
          </View>
          <View style={styles.DetailsContainer}>
            <Text>Status : </Text>
            <Text
              style={
                confirmationStatus === "Approved"
                  ? styles.ApprovedText
                  : confirmationStatus === "Pending"
                  ? styles.PendingText
                  : styles.DeclinedText
              }
            >
              {confirmationStatus}
            </Text>
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
