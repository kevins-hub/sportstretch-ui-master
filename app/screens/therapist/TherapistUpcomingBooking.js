import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, SectionList, Text, StyleSheet } from "react-native";

import TherapistUpcomingCard from "../../components/therapist/TherapistUpcomingCard";
import TherapistUpcomingPendingCard from "../../components/therapist/TherapistUpcomingPendingCard";
import bookingsApi from "../../api/bookings";
import AuthContext from "../../auth/context";
// import { installReactHook } from 'react-native/Libraries/Performance/Systrace';

function TherapistUpcomingBooking(props) {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [upcomingBookingPending, setUpcomingBookingPending] = useState([]);
  const [upcomingBookingsApprove, setUpcomingBookingsApprove] = useState([]);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    // wait 30 seconds minute before calling the function
    setTimeout(() => {
      loadUpcomingBookings();
    }, 30000);
  }, [upcomingBookings]);

  useEffect(() => {
    loadUpcomingBookings();
  }, []);

  const loadUpcomingBookings = async () => {
    const response = await bookingsApi.getTherapistUpcomingBookings(
      user.userObj.therapist_id
    );
    let upcomingBookings = response.data;
    upcomingBookings.sort((a, b) => {
      return (
        new Date(a.booking_time).getTime() - new Date(b.booking_time).getTime()
      );
    });
    if (!upcomingBookings) return;
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
    setUpcomingBookings(formattedBookings);
    // console.log(formattedBookings)
    // #logic to separate the list and set it in the useState Hook
    //         data = data.filter((item) => item.state == 'New York').map(({id, name, city}) => ({id, name, city}));
    // console.log(data);
    let upcomingBooking_Pending = formattedBookings
      .filter((item) => item.confirmation_status == -1)
      .map((item) => item);
    let upcomingBookings_Approve = formattedBookings
      .filter((item) => item.confirmation_status != -1)
      .map((item) => item);

    setUpcomingBookingPending(upcomingBooking_Pending);
    setUpcomingBookingsApprove(upcomingBookings_Approve);
    // console.log(upcomingBookingPending);
    // console.log(upcomingBookingsApprove);
  };

  return (
    <>
      {upcomingBookings.length === 0 && (
        <Text style={styles.defaultText}>
          Your upcoming appointments will show up here!
        </Text>
      )}
      {upcomingBookings.length > 0 && (
        <View>
          <SectionList
            // renderSectionHeader={({ section: { title } }) => <Text style={{ fontWeight: 'bold' }}>{title}</Text>}
            sections={[
              {
                data: upcomingBookingPending,
                renderItem: ({ item }) => (
                  <TherapistUpcomingPendingCard
                    therapistData={item}
                    loadUpcomingBookings={loadUpcomingBookings}
                    // bookingDate= {item.bookingDate}
                    // atheleteName= {item.atheleteName}
                    // bookingId= {item.bookingId}
                    // location= {item.location}
                  />
                ),
              },
              {
                data: upcomingBookingsApprove.sort(
                  (a, b) => a.bookings_id < b.bookings_id
                ),
                renderItem: ({ item }) => (
                  <TherapistUpcomingCard
                    therapistData={item}
                    // bookingDate= {item.bookingDate}
                    // atheleteName= {item.atheleteName}
                    // bookingId= {item.bookingId}
                    // location= {item.location}
                    // status=  {item.status === 1 ? 'Approved': 'Declined'}
                  />
                ),
              },
            ]}
            keyExtractor={(item) => item.bookings_id.toString()}
          />
        </View>
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

export default TherapistUpcomingBooking;
