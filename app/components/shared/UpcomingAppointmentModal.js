import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

import { useStripe, PaymentSheet } from "@stripe/stripe-react-native";
import RNPickerSelect from "react-native-picker-select";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { StripeProvider } from "@stripe/stripe-react-native";
import colors from "../../config/colors";
import AthleteAppointmentDetails from "../athlete/AthleteAppointmentDetails";
import bookings from "../../api/bookings";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function UpcomingAppointmentModal({
  booking,
  setVisibility,
  visible,
  profilePictureUrl,
  isTherapist = false,
}) {
  if (!visible) return null;
  const [currentStep, setCurrentStep] = useState(1);

  const cancelWarningText =
    "Are you sure you want to cancel your existing appointment? Appointments cancelled within 24 hours of the appointment time will be charged a cancellation fee of 20$.";
  const cancelWarningTextTherapist =
    "Are you sure you want to cancel this appointment?";
  const cancelConfirmationRefundText =
    "Your appointment has been successfully cancelled. You will receive a refund of the full appointment cost.";
  const cancelConfirmationTherapistText =
    "Your appointment has been successfully cancelled. Your client will receive a refund of the full appointment cost.";
  const cancelConfirmationNoRefundText =
    "Your appointment has been successfully cancelled.";

  const handleCancelAppointment = async () => {
    try {
      let response = {};
      if (isTherapist) {
        response = await bookings.therapistCancelBooking(booking.bookings_id);
      } else {
        response = await bookings.athleteCancelBooking(booking.bookings_id);
      }
      if (response.status !== 200) {
        console.error("Error cancelling appointment", response);
        return;
      }
      if (response.data.status === "CancelledRefunded") {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }

      setTimeout(() => {
        setVisibility(false);
      }, 8000);
    } catch (error) {
      console.error("Error cancelling appointment", error);
    }
  };

  const AppointmentDetailsStep = ({}) => (
    <View style={styles.modalContent}>
      <View style={styles.profilePictureContainer}>
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            style={styles.profilePicture}
          />
        ) : (
          <MaterialCommunityIcons
            style={styles.accountIcon}
            name="account-circle"
            size={80}
            color={colors.primary}
          />
        )}
      </View>
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
        {booking.confirmation_status === 1 ||
        booking.confirmation_status === -1 ? (
          <TouchableOpacity
            style={styles.cancelAppointmentButton}
            onPress={() => {
              setCurrentStep(2);
            }}
          >
            <Text style={styles.cancelAppointmentButtonText}>
              {"Cancel Appointment"}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {/* <TouchableOpacity
          style={styles.cancelAppointmentButton}
          onPress={() => {
            setCurrentStep(2);
          }}
        >
          <Text style={styles.cancelAppointmentButtonText}>
            {"Cancel Appointment"}
          </Text>
        </TouchableOpacity> */}
        {!isTherapist && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setCurrentStep(3);
            }}
          >
            <Text style={styles.primaryButtonText}>{"Modify Appointment"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const CancelStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.cancelAppointmentText}>
        {isTherapist ? cancelWarningTextTherapist : cancelWarningText}
      </Text>
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
          style={styles.primaryButton}
          onPress={() => {
            handleCancelAppointment();
          }}
        >
          <Text style={styles.primaryButtonText}>{"Confirm Cancellation"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ModifyStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.modifyText}>
        If you would like to make modifications to your existing appointment,
        please simply cancel your appointment and book a new one.
      </Text>
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
            {"Cancel Appointment"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ConfirmationRefundStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.cancelAppointmentText}>
        {isTherapist
          ? cancelConfirmationTherapistText
          : cancelConfirmationRefundText}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setVisibility(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Dismiss"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ConfirmationNoRefundStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.cancelAppointmentText}>
        {cancelConfirmationNoRefundText}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setVisibility(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Dismiss"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <BlurView intensity={50} style={styles.centeredView}>
        <View style={styles.modalView}>
          {currentStep === 1 && <AppointmentDetailsStep />}
          {currentStep === 2 && <CancelStep />}
          {currentStep === 3 && <ModifyStep />}
          {currentStep === 4 && <ConfirmationRefundStep />}
          {currentStep === 5 && <ConfirmationNoRefundStep />}
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
    height: "50%",
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
  profilePictureContainer: {
    position: "absolute",
    top: "10%",
    right: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    marginRight: 14,
  },
  accountIcon: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    marginRight: 14,
  },
});

export default UpcomingAppointmentModal;
