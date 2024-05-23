import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";

import AthletePastCard from "../../components/athlete/AthletePastCard";
import bookingsApi from "../../api/bookings";
import AuthContext from "../../auth/context";
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";
import PastAppointmentModal from "../../components/shared/PastAppointmentModal";

function AthletePastBooking(props) {
  const [pastBookings, setPastBookings] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState({});

  useEffect(() => {
    // wait 10 minutes bfore calling the function
    setTimeout(() => {
      loadPastBookings();
    }, 600000);
  }, [pastBookings]);

  useEffect(() => {
    loadPastBookings();
  }, []);

  const loadPastBookings = async () => {
    const response = await bookingsApi.getAthletePastBookings(
      user.userObj.athlete_id
    );
    let pastBookings = response.data.filter(
      (booking) =>
        booking.status !== "CancelledRefunded" &&
        booking.status !== "CancelledNoRefund"
    );
    let formattedBookings = pastBookings.map((booking) => {
      let date = new Date(booking.booking_time);
      return {
        ...booking,
        booking_month: date.toLocaleString("default", { month: "short" }),
        booking_day: date.getDate(),
        booking_time: date.toLocaleString("default", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
    });
    setPastBookings(formattedBookings);
  };

  const handleAppointmentPress = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentModalVisible(true);
  };

  return (
    <>
      {appointmentModalVisible && (
        <PastAppointmentModal
          booking={selectedAppointment}
          visible={appointmentModalVisible}
          setVisibility={setAppointmentModalVisible}
        />
      )}
      {pastBookings.length === 0 && (
        <Text style={styles.defaultText}>
          Your completed appointments will show up here!
        </Text>
      )}
      {pastBookings.length > 0 && (
        <FlatList
          data={pastBookings.sort((a, b) => a.bookings_id < b.bookings_id)}
          keyExtractor={(message) => message.bookings_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
              <AthletePastCard
                BookingMonth={item.booking_month}
                BookingDay={item.booking_day}
                fname={item.first_name}
                bookingId={item.bookings_id}
                therapistId={item.therapist_id}
                starRating={item.starrating}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 10,
    marginRight: 10,
  },
});
export default AthletePastBooking;
