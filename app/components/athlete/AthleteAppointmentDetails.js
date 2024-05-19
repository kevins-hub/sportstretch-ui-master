import React, { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import AuthContext from "../../auth/context";

function AthleteAppointmentDetails({booking}) {
  const { user, setUser } = useContext(AuthContext);

  // duration is in double format
  // convert duration to a string with hours and minutes
  const duration = booking.duration;
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  const durationString = `${hours}h ${minutes}m`;

  return (
    <>
      <Text style={styles.titleText}>
        Your appointment with {booking.first_name}
      </Text>
      <View style={styles.modalBodyContainer}>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Date:</Text>
          <Text style={styles.propText}>{booking.booking_date}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Time:</Text>
          <Text style={styles.propText}>{booking.booking_time}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Duration:</Text>
          <Text style={styles.propText}>{durationString}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Location:</Text>
          <Text style={styles.propText}>{booking.athlete_location}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Total Cost:</Text>
          <Text style={styles.propText}>${booking.total_cost}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  propTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 2,
  },
  propText: {
    fontSize: 14,
  },
});

export default AthleteAppointmentDetails;
