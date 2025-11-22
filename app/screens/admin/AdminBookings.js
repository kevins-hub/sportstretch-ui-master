import React from "react";
import { useState, useContext, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import bookingsApi from "../../api/bookings";
import AdminBookingsCard from "../../components/admin/AdminBookingsCard";
import { useFocusEffect } from "@react-navigation/native";

function AdminBookings(props) {
  const [AllBookings, setAllBookings] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      loadAllBookings();
    }, 30000);
  }, [AllBookings]);

  useFocusEffect(
    React.useCallback(() => {
      loadAllBookings();
    }, [])
  );

  const loadAllBookings = async () => {
    const response = await bookingsApi.getAllBookings();
    let AllBookings = response.data;
    AllBookings.sort((a, b) => {
      return (
        new Date(a.booking_time).getTime() - new Date(b.booking_time).getTime()
      );
    });
    let formattedBookings = AllBookings.map((booking) => {
      let date = new Date(booking.booking_time);
      return {
        ...booking,
        booking_month: date.toLocaleString("default", { month: "short" }),
        booking_day: date.getDate(),
      };
    });
    setAllBookings(formattedBookings);
  };

  return (
    <View
      style={{
        padding: 10,
        width: "100%",
        alignitems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FAFAFA",
      }}
    >
      {AllBookings.length === 0 ? (
        <Text>No bookings found. Bookings will appear here.</Text>
      ) : (
        <FlatList
          data={AllBookings}
          keyExtractor={(message) => message.bookings_id.toString()}
          renderItem={({ item }) => {
            return (
              <AdminBookingsCard
                BookingDay={item.booking_day}
                BookingMonth={item.booking_month}
                Afname={item.afname}
                Alname={item.alname}
                Tfname={item.tfname}
                Tlname={item.tlname}
                BookingsId={item.bookings_id}
                athlete_id={item.fk_athlete_id}
                therapist_id={item.fk_therapist_id}
              />
            );
          }}
        />
      )}
    </View>
  );
}

export default AdminBookings;
