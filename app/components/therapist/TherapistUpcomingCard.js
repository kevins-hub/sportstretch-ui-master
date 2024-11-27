import React, { useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../config/colors";

function TherapistUpcomingCard(item) {
  const {
    booking_day,
    booking_day_of_week,
    booking_month,
    first_name,
    bookings_id,
    athlete_location,
    confirmation_status,
    booking_time,
    status,
    profile_picture_url,
  } = item.therapistData;
  const location = athlete_location
    ? athlete_location.split(",")
    : "Your clinic.";
  const status_type =
    status === "CancelledRefunded"
      ? "Cancelled - Refunded"
      : status === "CancelledNoRefund"
      ? "Cancelled"
      : confirmation_status === 1
      ? "Approved"
      : "Declined";

  const abbrevBookingMonth = booking_month.substring(0, 3);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.profilePictureContainer}>
          <View>
            {profile_picture_url ? (
              <Image
                source={{ uri: profile_picture_url }}
                style={styles.profilePicture}
              />
            ) : (
              <MaterialCommunityIcons
                style={styles.accountIcon}
                name="account-circle"
                size={60}
                color={colors.primary}
              />
            )}
          </View>
          <Text style={styles.profilePictureName}>{first_name}</Text>
        </View>

        {/* <View style={styles.date}>
          <Text style={styles.dateTextMonth}>{booking_month}</Text>
          <Text style={styles.dateTextNumber}>{booking_day}</Text>
        </View> */}

        <View style={styles.verticalLine}></View>

        <View style={styles.rightContainer}>
          <View style={styles.right}>
          <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Date</Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFontName}>{`${booking_day_of_week}, ${abbrevBookingMonth} ${booking_day}`}</Text>
            </View>
            {/* <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Athlete</Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFontName}>{first_name}</Text>
            </View> */}
          </View>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>
                Time (local)
              </Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFont}>{booking_time}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Booking Id</Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFont}>{bookings_id}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Location</Text>
            </View>

            {athlete_location ? (
              <View style={styles.dynamicText}>
                <Text style={styles.dynamicTextFont}>{location[0].trim()}</Text>
                <Text style={styles.dynamicTextFont}>{location[1].trim()}</Text>
                <Text style={styles.dynamicTextFont}>{location[2].trim()}</Text>
              </View>
            ) : (
              <View style={styles.dynamicText}>
                <Text style={styles.dynamicTextFont}>{location}</Text>
              </View>
            )}
          </View>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Booking Status</Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={status_type === "Approved" ? styles.approvedText : styles.declinedText}>{status_type}</Text>
            </View>
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
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    flexDirection: "row",
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    width: "100%",
    height: 220,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  profilePictureContainer: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePictureName: {
    fontWeight: "400",
    fontSize: 20,
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
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  dynamicTextFontName: {
    fontWeight: "300",
    fontSize: 17,
  },
  dynamicTextFont: {
    fontWeight: "300",
    fontSize: 14,
    color: "#383838",
    flexWrap: "wrap",
  },

  staticText: {
    width: "40%",
    margin: "1%",
  },
  staticLabel: {
    fontWeight: "300",
    fontSize: 14,
    color: "#5f5f5f",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexShrink: 1,
    width: "75%",
  },
  verticalLine: {
    backgroundColor: colors.silver,
    height: "90%",
    marginTop: 15,
    width: 1,
    marginRight: "5%",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginBottom: "5%",
  },
  approvedText: {
    fontWeight: "300",
    fontSize: 14,
    color: "#383838",
    flexWrap: "wrap",
    color: "green",
    fontStyle: "italic",
  },

  pendingText: {
    fontWeight: "300",
    fontSize: 14,
    color: "#383838",
    flexWrap: "wrap",
    color: "gold",
    fontStyle: "italic",
  },

  declinedText: {
    fontWeight: "300",
    fontSize: 14,
    color: "#383838",
    flexWrap: "wrap",
    color: colors.grey,
    fontStyle: "italic",
  },
});

export default TherapistUpcomingCard;
