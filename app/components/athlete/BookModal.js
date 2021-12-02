import React, { useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

import bookingsApi from "../../api/bookings";
import BookButton from "./BookButton";
import BookingProgressIndicator from "./BookingProgressIndicator";
import BookingDoneIndicator from "./BookingDoneIndicator";

function BookModal({
  visible,
  setVisibility,
  therapistId,
  athleteId,
  athleteLocation,
}) {
  if (!visible) return null;

  const navigation = useNavigation();

  const [text, onChangeText] = useState(athleteLocation);
  const [bookingProgress, setBookingProgress] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  const onConfirmPress = async () => {
    //showProgress
    setBookingProgress(true);
    //format text and call API
    await bookingsApi.bookATherapist(athleteId, athleteLocation, therapistId);
    //hideProgress & showDone
    setBookingProgress(false);
    setBookingDone(true);
    //navigate
    setTimeout(function () {
      setBookingDone(false);
      setVisibility(false);
      navigation.navigate("UpcomingBooking");
    }, 2000);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <BlurView intensity={50} style={styles.centeredView}>
        <View style={styles.modalView}>
          <BookingProgressIndicator visible={bookingProgress} />
          <BookingDoneIndicator visible={bookingDone} />
          {!bookingProgress && !bookingDone && (
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Confirm your location</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setVisibility(false);
                  }}
                >
                  <Text style={styles.hideModal}>{"Cancel"}</Text>
                </TouchableOpacity>
                <BookButton title="Confirm" onPress={onConfirmPress} />
              </View>
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 180,
    width: 300,
  },
  modalContent: {
    margin: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    borderColor: '#D3D3D3',
    width: 270,
    backgroundColor: '#F6F6F6'
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  hideModal: {
    textDecorationLine: "underline",
    backgroundColor: "#FEFEFE",
    color: "#3F3F3F",
  },
});

export default BookModal;
