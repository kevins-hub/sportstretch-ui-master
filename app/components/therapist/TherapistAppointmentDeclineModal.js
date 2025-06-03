import React, { useState, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";
import notificationsApi from "../../api/notifications";
import bookingsApi from "../../api/bookings";
import { handleError } from "../../lib/error";

const { height: screenHeight } = Dimensions.get("window");

const TherapistAppointmentDeclineModal = ({
  item,
  visible,
  handleDeclineModal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const resasonFormValues = { reason: "", date: new Date(), time: new Date() };

  const reasonOptions = [
    "Location out of range",
    "Not available at that time",
    "Other",
  ];

  const reasonOptionsObj = reasonOptions.map((item) => {
    return { label: item, value: item };
  });

  const handleSubmit = async (values) => {
    let convertDate = values.date.toLocaleDateString();
    let convertTime = convertDateTimeToLocalTimeStr(values.time);

    let newBookingDate = `${convertDate} ${convertTime}`;
    if (!values.reason) {
      Alert.alert("Please select a reason"),
        [
          {
            text: "Close",
            onPress: () => {},
          },
        ];
    } else {
      if (values.reason !== "Not available at that time") {
        newBookingDate = "";
      }
      let booking_status = await bookingsApi.declineBooking(item.bookings_id, {
        reason: values.reason,
        suggestedBookingDateTime: newBookingDate,
      });
      if (handleError(booking_status)) return;
      if (booking_status.data.confirmation_status === 0) {
        handleDeclineModal(false);
        notificationsApi.notifyAthlete(
          booking_status.data.athlete_id,
          item.bookings_id
        );
        Alert.alert("Booking Declined");
      } else {
        Alert.alert("Error while declining. Please try again.");
      }
    }
  };

  convertDateTimeToLocalTimeStr = (dateTime) => {
    // convert date time to local time str with format H:MM with AM/PM
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return dateTime.toLocaleTimeString("en-US", options);
  };

  const handleSelect = (reason) => {
    closeModal();
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: screenHeight / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Formik initialValues={resasonFormValues} onSubmit={handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
            }) => (
              <View>
                <View style={styles.declineModalForm}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      marginBottom: 10,
                    }}
                  >
                    Reason for Declining
                  </Text>
                  <View style={{ marginBottom: 10 }}>
                    <TouchableOpacity
                      style={styles.selector}
                      onPress={openModal}
                    >
                      <Text>{values.reason || "Select a reason"}</Text>
                    </TouchableOpacity>

                    <Modal
                      transparent
                      visible={modalVisible}
                      animationType="none"
                    >
                      <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={closeModal}
                      />
                      <Animated.View style={[styles.sheet, { top: slideAnim }]}>
                        <ScrollView>
                          {reasonOptions.map((opt) => (
                            <TouchableOpacity
                              key={opt}
                              onPress={() => {
                                handleSelect(opt);
                                setFieldValue("reason", opt);
                              }}
                              style={styles.option}
                            >
                              <Text>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </Animated.View>
                    </Modal>
                  </View>
                  {values.reason === "Not available at that time" ? (
                    <View>
                      <Text style={{ textAlign: "center", marginBottom: 8 }}>
                        Suggest another date and time
                      </Text>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <DateTimePicker
                          mode="date"
                          name="date"
                          value={values.date}
                          minimumDate={new Date()}
                          onChange={(event, newDate) =>
                            setFieldValue("date", newDate)
                          }
                        />
                        <DateTimePicker
                          mode="time"
                          name="time"
                          value={values.time}
                          onChange={(event, newtime) =>
                            setFieldValue("time", newtime)
                          }
                        />
                      </View>
                    </View>
                  ) : (
                    ""
                  )}
                </View>
                <View style={styles.declineModalButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.acceptModalButton}>Submit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDeclineModal(false)}
                  >
                    <Text style={styles.declineModalButton}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  acceptButton: {
    backgroundColor: "#373737",
    padding: 10,
    borderBottomStartRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
  },
  acceptModalButton: {
    fontWeight: "300",
    fontSize: 16,
    color: "#ffffff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    height: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  declineModalForm: {
    width: 300,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  declineModalButton: {
    fontWeight: "300",
    fontSize: 16,
    color: "#ffffff",
  },
  declineModalButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  reasonSelect: {
    fontSize: 10,
  },
  declineButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#959595",
    borderBottomStartRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomEndRadius: 10,
  },
  selector: {
    padding: 10,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: screenHeight / 2,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

export default TherapistAppointmentDeclineModal;
