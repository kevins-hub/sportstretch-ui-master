import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import { Formik } from "formik";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";

const TherapistAppointmentDeclineModal = ({
  item,
  visible,
  handleDeclineModal,
}) => {
  const reasonOptions = [
    "Location out of range",
    "Not available at that time",
    "Other",
  ];

  const handleSubmit = (values) => {
    console.warn("values", values);
    if (!values.reason) {
      Alert.alert("Please select a reason"),
        [
          {
            text: "Close",
            onPress: () => {},
          },
        ];
    } else {
      // add some logic
      handleDeclineModal(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.modalContent}>
          <Formik
            initialValues={{ reason: "", date: new Date(), time: new Date() }}
            onSubmit={handleSubmit}
          >
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
                    <RNPickerSelect
                      style={styles.reasonSelect}
                      placeholder={{ label: "Select a Reason", value: "" }}
                      onValueChange={handleChange("reason")}
                      onBlur={handleBlur("reason")}
                      items={reasonOptions.map((item) => {
                        return { label: item, value: item };
                      })}
                      value={values.reason}
                    />
                  </View>
                  {values.reason === "Not available at that time" ? (
                    <View>
                      <Text style={{ textAlign: "center", marginBottom: 8 }}>
                        Select Another Date
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
                    <Text style={styles.declineModalButton}>Decline</Text>
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
});

export default TherapistAppointmentDeclineModal;
