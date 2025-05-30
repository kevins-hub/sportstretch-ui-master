import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Constants from "expo-constants";
import colors from "../../config/colors";
import AthleteAppointmentDetails from "../athlete/AthleteAppointmentDetails";
import AuthContext from "../../auth/context";
import { Formik } from "formik";
import report from "../../api/report";
import { handleError } from "../../lib/error";
import notifications from "../../api/notifications";

function PastAppointmentModal({ booking, setVisibility, visible }) {
  if (!visible) return null;
  const [currentStep, setCurrentStep] = useState(1);
  const { user, setUser } = useContext(AuthContext);

  const userAuthId = user.authorization_id;

  const issueMaxLength = 500;

  const AppointmentDetailsStep = ({}) => (
    <View style={styles.modalContent}>
      <AthleteAppointmentDetails booking={booking}></AthleteAppointmentDetails>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setVisibility(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Nevermind"}</Text>
        </TouchableOpacity>
        {/* <BookButton title="Request to Book" onPress={onConfirmPress} /> */}
        <TouchableOpacity
          style={styles.cancelAppointmentButton}
          onPress={() => {
            setCurrentStep(2);
          }}
        >
          <Text style={styles.cancelAppointmentButtonText}>
            {"Report an issue with this appointment"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ReportIssueStep = ({}) => (
    <View style={styles.modalContent}>
      <KeyboardAvoidingView
        // change padding to height for android devices  platform === ios ? padding : height
        behavior="padding"
        style={{ flex: 1 }}
      >
        <Text style={styles.cancelAppointmentText}>
          Please describe the issue you experienced with this appointment. We
          will review your report and email you with more details.
        </Text>
        <Formik
          initialValues={{ reportIssue: "" }}
          onSubmit={(values) => {
            if (handleConfirmReport(values.reportIssue)) {
              setVisibility(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <View>
                <TextInput
                  style={styles.textInput}
                  value={values.reportIssue}
                  onChangeText={handleChange("reportIssue")}
                  onBlur={handleBlur("reportIssue")}
                  placeholder="Type here"
                  multiline={true}
                  maxLength={issueMaxLength}
                />
                <Text
                  style={styles.issueCharCount}
                >{`${values.reportIssue.length}/${issueMaxLength}`}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setVisibility(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>{"Nevermind"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.primaryButtonText}>
                    {"Confirm Report"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );

  const handleConfirmReport = async (issue) => {
    try {
      const reportIssueObj = {
        booking_id: booking.bookings_id,
        issue: issue,
        reporter_auth_id: userAuthId,
      };
      const response = await report.reportIssue(reportIssueObj);
      if (handleError(response)) return false;
      notifications.notifyAdmin(
        `Issue reported for booking ${booking.bookings_id}. Issue: ${issue}. Please review. Check email for more details.`
      );
      return true;
    } catch (error) {
      Alert.alert("Error reporting issue. Please try again later.");
      return false;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {currentStep === 1 && <AppointmentDetailsStep />}
            {currentStep === 2 && <ReportIssueStep />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    height: "55%",
    width: 300,
  },
  modalContent: {
    margin: 10,
    marginLeft: 10,
    height: "90%",
    width: "90%",
    flex: 1,
  },
  appointmentScrollViewContainer: {
    height: "75%",
  },
  appointmentDetailsScrollView: {
    height: "50%",
  },
  scrollTherapistDetails: {
    height: "34%",
    marginBottom: 2,
    padding: 0,
    flexGrow: 0,
  },
  paymentScreen: {
    height: "50%",
    width: "100%",
  },
  modalText: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  propContainer: {
    marginBottom: 8,
  },
  locationFormContainer: {
    marginBottom: 8,
  },
  rateContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  timeSlotContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "3%",
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
  clinicInfoText: {
    fontSize: 14,
    marginBottom: 8,
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
  datePicker: {
    alignItems: "left",
    marginLeft: "auto",
    marginRight: "auto",
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
  timeSlotButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 30,
    margin: 5,
    borderColor: colors.primary,
    borderWidth: 1,
    marginBottom: 1,
  },
  timeSlotButtonSelected: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 30,
    margin: 5,
    marginBottom: 1,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
    marginBottom: 0,
  },
  previousButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
    borderColor: colors.primary,
    borderWidth: 1,
    marginBottom: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
    marginBottom: 1,
  },
  cancelAppointmentButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
  },
  primaryButtonText: {
    color: colors.secondary,
    fontSize: 12,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 12,
  },
  cancelAppointmentButtonText: {
    color: "red",
    fontSize: 12,
  },
  timeSlotButtonText: {
    color: colors.primary,
    fontSize: 10,
  },
  timeSlotButtonSelectedText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "bold",
  },
  modifyText: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: "10%",
  },
  cancelAppointmentText: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: "10%",
  },
  textInput: {
    marginTop: 4,
    marginBottom: 2,
    borderWidth: 2,
    padding: 8,
    borderRadius: 20,
    borderColor: "#D3D3D3",
    width: "100%",
    backgroundColor: "#F6F6F6",
    height: "50%",
  },
  issueCharCount: {
    textAlign: "right",
    marginRight: "10%",
    color: colors.grey,
  },
});

export default PastAppointmentModal;
