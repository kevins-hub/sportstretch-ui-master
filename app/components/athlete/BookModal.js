import React, { useState, useMemo, useContext } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

import bookingsApi from "../../api/bookings";
import BookButton from "./BookButton";
import BookingProgressIndicator from "./BookingProgressIndicator";
import BookingDoneIndicator from "./BookingDoneIndicator";
import notificationsApi from "../../api/notifications";
import AuthContext from "../../auth/context";
import colors from "../../config/colors";
import RadioGroup from "react-native-radio-buttons-group";

function BookModal({
  visible,
  setVisibility,
  therapistId,
  athleteId,
  athleteLocation,
  therapistName,
  therapistHourly,
  therapistSummary,
  therapistServices,
}) {
  if (!visible) return null;

  const navigation = useNavigation();

  const [text, onChangeText] = useState(athleteLocation);
  const [bookingProgress, setBookingProgress] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState("2");
  const { user, setUser } = useContext(AuthContext);

  const locations = useMemo(
    () => [
      {
        id: "1",
        label: "Clinic",
        value: "clinic",
      },
      {
        id: "2",
        label: "Home/Facility",
        value: "home",
      },
    ],
    []
  );

  const onConfirmPress = async () => {
    try {
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
      notificationsApi.notifyTherapist(therapistId, user.userObj.first_name);
    } catch (error) {
      console.log("Error on confirm booking", error);
    }
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
              <Text style={styles.modalText}>
                Book your appointment with {therapistName}!
              </Text>
              <View style={styles.therapistDetails}>
                <View style={styles.propContainer}>
                  <Text style={styles.propTitle}>
                    Your Recovery Specialist:
                  </Text>
                  <Text style={styles.propText}>{therapistName}</Text>
                </View>
                <View style={styles.propContainer}>
                  <Text style={styles.propTitle}>Summary:</Text>
                  <Text style={styles.propText}>{therapistSummary}</Text>
                </View>
                <View style={styles.propContainer}>
                  <Text style={styles.propTitle}>Services:</Text>
                  <Text style={styles.propText}>{therapistServices}</Text>
                </View>
                <View style={styles.rateContainer}>
                  <Text style={styles.propTitle}>Hourly Rate:</Text>
                  <Text style={styles.propText}>${therapistHourly}</Text>
                </View>
              </View>

              <View style={styles.propContainer}>
                <Text style={styles.propTitle}>Date & Time:</Text>
                <Text style={styles.propText}>
                  Date time picker modal placeholder
                </Text>
              </View>

              <View style={styles.locationFormContainer}>
                <RadioGroup
                  radioButtons={locations}
                  onPress={setSelectedLocationOption}
                  flexDirection="column"
                  selectedId={selectedLocationOption}
                  containerStyle={styles.radioGroup}
                />
                {/* <View style={styles.selectedLocationOptionContainer}>
                  <Text style={styles.selectedLocationOptionText}>
                    Selected Location: {selectedLocationOption}
                  </Text>
                </View> */}
              </View>
              {selectedLocationOption === "2" ? (
                <View style={styles.propContainer}>
                  <Text style={styles.propTitle}>Your Location:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                  />
                </View>
              ) : (
                <Text style={styles.propText}>
                  Clinic address will be provided upon confirmation of
                  appointment.
                </Text>
              )}
              {/* <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
              /> */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setVisibility(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
                </TouchableOpacity>
                <BookButton title="Request to Book" onPress={onConfirmPress} />
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
    height: "90%",
    width: 300,
  },
  modalContent: {
    margin: 10,
    marginLeft: 10,
    height: "92%",
    width: "92%",
  },
  modalText: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  propContainer: {
    marginBottom: 10,
  },
  rateContainer: {
    flexDirection: "row",
    marginBottom: 10,
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
  input: {
    marginTop: 4,
    marginBottom: 2,
    borderWidth: 2,
    padding: 4,
    borderRadius: 20,
    borderColor: "#D3D3D3",
    width: "100%",
    backgroundColor: "#F6F6F6",
  },
  radioGroup: {
    alignItems: "left",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column-reverse",
    width: "100%",
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 12,
  },
});

export default BookModal;
