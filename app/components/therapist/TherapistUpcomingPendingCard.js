import React, { useState } from "react";

import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../config/colors";
import notificationsApi from "../../api/notifications";
import TherapistAppointmentDeclineModal from "./TherapistAppointmentDeclineModal";
import bookingsApi from "../../api/bookings";

function TherapistUpcomingPendingCard({ therapistData, loadUpcomingBookings }) {
  const {
    booking_day,
    booking_month,
    booking_day_of_week,
    first_name,
    bookings_id,
    athlete_location,
    booking_time,
    profile_picture_url,
  } = therapistData;
  const location = athlete_location
    ? athlete_location?.split(",")
    : "Your clinic.";
  const [declineModal, setDeclineModal] = useState(false);

  const approveBooking = async () => {
    try {
      let booking_status = await bookingsApi.approveBooking(bookings_id);
      if (booking_status.data.confirmation_status === 1) {
        Alert.alert("Booking Approved");
        notificationsApi.notifyAthlete(
          booking_status.data.athlete_id,
          bookings_id
        );
        loadUpcomingBookings();
      } else {
        Alert.alert("Error while approving. Please try again.");
      }
    } catch (error) {
      console.log(`Error approving booking: ${error}`);
    }
  };

  const handleDeclineModal = (val) => {
    setDeclineModal(val);
    loadUpcomingBookings();
  };

  const declineBooking = async () => {
    setDeclineModal(true);
  };

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
              <Text
                style={styles.dynamicTextFontName}
              >{`${booking_day_of_week}, ${booking_month} ${booking_day}`}</Text>
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
              <Text style={styles.staticLabel}>Time (local)</Text>
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
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={approveBooking}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={declineBooking}
            >
              <Text style={styles.rejectButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TherapistAppointmentDeclineModal
        item={therapistData}
        visible={declineModal}
        handleDeclineModal={handleDeclineModal}
      ></TherapistAppointmentDeclineModal>
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
    marginTop: "0.5%",
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexShrink: 1,
    width: "75%",
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
    marginRight: "5%",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginBottom: "5%",
  },
});

export default TherapistUpcomingPendingCard;
