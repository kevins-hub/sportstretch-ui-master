import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import AthleteUpcomingCard from "../../components/athlete/AthleteUpcomingCard";
import bookingsApi from "../../api/bookings";
import AuthContext from "../../auth/context";
import { useFocusEffect } from "@react-navigation/native";
import UpcomingAppointmentModal from "../../components/shared/UpcomingAppointmentModal";

function AthleteUpcomingBooking(props) {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState({});

  useEffect(() => {
    // wait 60 seconds minute before calling the function
    setTimeout(() => {
      loadUpcomingBookings();
    }, 60000);
  }, [upcomingBookings]);

  useEffect(() => {
    loadUpcomingBookings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUpcomingBookings();
    }, [])
  );

  const loadUpcomingBookings = async () => {
    const response = await bookingsApi.getAthleteUpcomingBookings(
      user.userObj.athlete_id
    );
    let upcomingBookings = response.data.filter(
      (booking) =>
        booking.status !== "CancelledRefunded" &&
        booking.status !== "CancelledNoRefund"
    );
    upcomingBookings = upcomingBookings.sort((a, b) => {
      return (
        new Date(a.booking_time).getTime() - new Date(b.booking_time).getTime()
      );
    });
    let formattedBookings = upcomingBookings.map((booking) => {
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
    // sort bookings by earliest date to latest date
    // formattedBookings.sort((a, b) => {
    //   return new Date(a.booking_time) - new Date(b.booking_time);
    // });
    setUpcomingBookings(formattedBookings);
  };

  const handleAppointmentPress = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentModalVisible(true);
  };

  return (
    <>
      {appointmentModalVisible && (
        <UpcomingAppointmentModal
          booking={selectedAppointment}
          visible={appointmentModalVisible}
          setVisibility={setAppointmentModalVisible}
          profilePictureUrl={selectedAppointment.profile_picture_url}
        />
      )}
      {upcomingBookings.length === 0 && (
        <Text style={styles.defaultText}>
          Your upcoming appointments will show up here!
        </Text>
      )}
      {upcomingBookings.length > 0 && (
        <FlatList
          data={upcomingBookings}
          keyExtractor={(message) => message.bookings_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAppointmentPress(item)}>
              <AthleteUpcomingCard
                BookingMonth={item.booking_month}
                BookingDay={item.booking_day}
                BookingTime={item.booking_time}
                fname={item.first_name}
                bookingId={item.bookings_id}
                confirmationStatus={(() => {
                  if (item.confirmation_status === 1) return "Approved";
                  if (item.confirmation_status === -1) return "Pending";
                  else item.confirmation_status === 0;
                  return "Declined";
                })()}
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

export default AthleteUpcomingBooking;
