import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";

import TherapistPastCard from "../../components/therapist/TherapistPastCard";
import bookingsApi from "../../api/bookings";
import AuthContext from "../../auth/context";

function TherapistPastBooking(props) {
  const [pastBookings, setPastBookings] = useState([]);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    loadPastBookings();
  });

  const loadPastBookings = async () => {
    const response = await bookingsApi.getTherapistPastBookings(
      user.userObj.therapist_id
    );
    let pastBookings = response.data;
    if (!pastBookings) return;
    let formattedBookings = pastBookings.map((booking) => {
      let date = new Date(booking.booking_time);
      return {
        ...booking,
        booking_month: date.toLocaleString("default", { month: "short" }),
        booking_day: date.getDate(),
      };
    });
    setPastBookings(formattedBookings);
  };

  //console.log(pastBookings);
  return (
    <>
      {pastBookings.length === 0 && (
        <Text style={styles.defaultText}>
          Your completed appointments will show up here!
        </Text>
      )}
      {pastBookings.length > 0 && (
        <FlatList
          data={pastBookings.sort((a, b) => a.bookings_id < b.bookings_id)}
          keyExtractor={(message) => message.bookings_id.toString()}
          renderItem={({ item }) => <TherapistPastCard therapistData={item} />}
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

export default TherapistPastBooking;
