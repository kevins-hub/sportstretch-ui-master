import React, { useState } from "react";

import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import colors from "../../config/colors";
import bookingsApi from "../../api/bookings";
import notificationsApi from "../../api/notifications";
import TherapistAppointmentDeclineModal from "./TherapistAppointmentDeclineModal";

function TherapistUpcomingPendingCard(item, loadUpcomingBookings) {
  const {
    booking_day,
    booking_month,
    first_name,
    bookings_id,
    athlete_location,
    booking_time,
  } = item.therapistData;
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
  };

  const declineBooking = async () => {
    setDeclineModal(true);
    // let booking_status = await bookingsApi.declineBooking(bookings_id);
    // if (booking_status.data.confirmation_status === 0) {
    //   Alert.alert("Booking Declined");
    //   notificationsApi.notifyAthlete(
    //     booking_status.data.athlete_id,
    //     bookings_id
    //   );
    //   loadUpcomingBookings();
    // } else {
    //   Alert.alert("Error while declining. Please try again.");
    // }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <View style={styles.date}>
          <Text style={styles.dateTextMonth}>{booking_month}</Text>
          <Text style={styles.dateTextNumber}>{booking_day}</Text>
        </View>

        <View style={styles.verticalLine}></View>

        <View style={styles.rightContainer}>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Athelete</Text>
            </View>
            <View style={styles.dynamicText}>
              <Text style={styles.dynamicTextFontName}>{first_name}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <View style={styles.staticText}>
              <Text style={styles.staticLabel}>Appointment Time</Text>
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
        item={item}
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
  },
});

export default TherapistUpcomingPendingCard;
