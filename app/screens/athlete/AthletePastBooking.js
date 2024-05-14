import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";

import AthletePastCard from "../../components/athlete/AthletePastCard";
import bookingsApi from "../../api/bookings";
import AuthContext from "../../auth/context";
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";

function AthletePastBooking(props) {
  const [pastBookings, setPastBookings] = useState([]);
  const { user, setUser } = useContext(AuthContext);

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
    let pastBookings = response.data;
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
          renderItem={({ item }) => (
            <AthletePastCard
              BookingMonth={item.booking_month}
              BookingDay={item.booking_day}
              fname={item.first_name}
              bookingId={item.bookings_id}
              therapistId={item.therapist_id}
              starRating={item.starrating}
            />
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
