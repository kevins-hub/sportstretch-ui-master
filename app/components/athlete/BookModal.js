import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, ScrollView } from "react-native-gesture-handler";
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
import DateTimePicker from "@react-native-community/datetimepicker";
// import Payment from "./Payment_old";
import PaymentScreen from "./Payment";
import { useStripe, useConfirmPayment } from "@stripe/stripe-react-native";
import paymentApi from "../../api/payment";
import RNPickerSelect from "react-native-picker-select";

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

  // can modify these to be dynamic based on clinic hours
  const openTime = 8; // 8:00 AM
  const closeTime = 20; // 8:00 PM

  let minDate = new Date();

  const getNextAvailableTime = () => {
    // console.warn("getNextAvailableTime");
    const now = new Date();
    // if currently within open hours, set next available time to 30 minutes from now
    if (now.getHours() >= openTime && now.getHours() < closeTime) {
      return new Date(now.getTime() + 30 * 60000);
    }
    // if currently outside of open hours, set next available time to open hours
    const nextAvailableTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      openTime,
      0,
      0,
      0
    );

    if (now.getHours() >= closeTime) {
      nextAvailableTime.setDate(now.getDate() + 1);
    }

    minDate = nextAvailableTime;

    return nextAvailableTime;
  };

  const navigation = useNavigation();
  const [text, onChangeText] = useState(athleteLocation);
  const [bookingProgress, setBookingProgress] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState("2");
  const [appointmentDuration, setAppointmentDuration] = useState(0);
  // const [selectedDateTime, setSelectedDateTime] = useState(earliestAppointment);
  const { user, setUser } = useContext(AuthContext);
  const [subTotal, setSubTotal] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(getNextAvailableTime());
  // const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [currentStep, setCurrentStep] = useState(1);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState("");

  // let minDate = new Date();


  const handleDateChange = (event, selectedDate) => {
    // console.warn("handleDateChange");
    // one second timeout to allow for the date to be set

    // console.warn("Date changed", selectedDate);
    // if selected date's hours are after closeTime, set time to 30 minutes before closeTime
    // console.warn("selectedHour = ", selectedDate.getHours());
    if (selectedDate.getHours() >= closeTime) {
      // console.warn("Date is after close time");
      selectedDate.setHours(closeTime - 1, 30, 0, 0);
    } else if (selectedDate.getHours() < openTime) {
      // console.warn("Date is before open time");
      selectedDate.setHours(openTime, 0, 0, 0);
    }
    // console.warn("new Date = ", selectedDate);
    setSelectedDateTime(selectedDate);
  };

  const appointmentDurationOptions = [
    { label: "1 Hour", value: 1 },
    { label: "2 Hours", value: 2 },
    { label: "3 Hours", value: 3 },
    { label: "4 Hours", value: 4 },
    { label: "5 Hours", value: 5 },
    { label: "6 Hours", value: 6 },
    { label: "7 Hours", value: 7 },
    { label: "8 Hours", value: 8 },
  ];

  let paymentObj = {
    amount: appointmentDuration * therapistHourly,
    currency: "usd",
    payment_method_types: ["card"],
    description: "SportStretch Recovery Specialist Appointment",
    receipt_email: "kevinliu428@gmail.com",
  };

  const getClientSecret = async () => {
    // console.warn("getClientSecret");
    let res = await paymentApi.createPaymentIntent(paymentObj);
    setClientSecret(res.data.clientSecret);
    return;
  };

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

  // Need to call backend for payment intent

  const proceedToReview = async () => {
    try {
      const response = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        returnURL: "payments-example://stripe-redirect",
        customerId: "",
        merchantDisplayName: "",
        ephemeralKeySecret: "",
        // Additional configuration options
      });

      // console.warn("response = ", response);
      setCurrentStep(3);
    } catch (error) {
      console.warn("Error initializing PaymentSheet", error);
    }
  };

  const openPaymentSheet = async () => {
    // console.warn("open payment sheet");
    try {
      const { error } = await presentPaymentSheet();
      if (error) {
        console.warn("Error opening PaymentSheet", error);
      } else {
        // post payment operations
        console.log('Payment successful');
        createBooking();
        
      }
    } catch (error) {
      console.warn("Error opening PaymentSheet", error);
    }
  };

  const handleDurationChange = async (value) => {
    if (!value) return;
    setAppointmentDuration(Number(value));
    const subTotalAmount = value * therapistHourly;
    paymentObj.amount = subTotalAmount;
    setSubTotal(subTotalAmount);
    getClientSecret();
  };

  const handleSubmit = async () => {
    await initializePaymentSheet();
  };

  const createBooking = async () => {
    // console.warn("onConfirmPress");
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

  const convertUTCDateToLocalDateTimeString = (date) => {
    // convert UTC date to date time string with format such as: Friday, March 1, 2024, 12:00 PM
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const TherapistDetailsStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>
        Book your appointment with {therapistName}!
      </Text>
      <View style={styles.modalBodyContainer}>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Your Recovery Specialist:</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setVisibility(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
        </TouchableOpacity>
        {/* <BookButton title="Request to Book" onPress={onConfirmPress} /> */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCurrentStep(2)}
        >
          <Text
            style={styles.primaryButtonText}
          >{`Book an appointment with ${therapistName}`}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.primaryButton}
          onPress={openPaymentSheet}
        >
          <Text style={styles.primaryButtonText}>{"Open payment sheet"}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const AppointmentDetailsStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>
        Book your appointment with {therapistName}!
      </Text>
      {/* <ScrollView style={styles.scrollTherapistDetails} keyboardShouldPersistTaps="handled" contentContainerStyle={{padding: 0, alignItems: 'left', marginBottom: 0}}>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Your Recovery Specialist:</Text>
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
      </ScrollView> */}
      <View style={styles.rateContainer}>
        <Text style={styles.propTitle}>Hourly Rate:</Text>
        <Text style={styles.propText}>${therapistHourly}</Text>
      </View>
      <View style={styles.propContainer}>
        <Text style={styles.propTitle}>Date & Time:</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDateTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          style={styles.datePicker}
          minimumDate={minDate}
        />
      </View>

      <View style={styles.propContainer}>
        <Text style={styles.propTitle}>Duration:</Text>
        {/* Dropdown menu */}
        <View>
          <RNPickerSelect
            onValueChange={(value) => handleDurationChange(value)}
            items={appointmentDurationOptions}
            placeholder={{ label: "Select duration for appointment", value: 0}}
            value={appointmentDuration}
            style={styles.durationPicker}
          />
        </View>
      </View>
      <View style={styles.rateContainer}>
        <Text style={styles.propTitle}>Subtotal:</Text>
        <Text style={styles.propText}>
          {appointmentDuration === 0 ? "(Select a duration)" : `$${subTotal}`}
        </Text>
      </View>
      <View style={styles.locationFormContainer}>
        <Text style={styles.propTitle}>Location:</Text>
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
        <Text style={styles.clinicInfoText}>
          Clinic address will be provided upon confirmation of appointment.
        </Text>
      )}

      {/* <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={text}
    /> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setVisibility(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
        </TouchableOpacity>
        {/* <BookButton title="Request to Book" onPress={onConfirmPress} /> */}
        <TouchableOpacity
          style={styles.previousButton}
          onPress={() => {
            setCurrentStep(1);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Previous"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={proceedToReview}
        >
          <Text style={styles.primaryButtonText}>{"Review & Pay"}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.primaryButton}
          onPress={openPaymentSheet}
        >
          <Text style={styles.primaryButtonText}>{"Open payment sheet"}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const PaymentStep = ({}) => (
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>
        Review your appointment with {therapistName}!
      </Text>
      <View style={styles.therapistDetails}>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Your Recovery Specialist:</Text>
          <Text style={styles.propText}>{therapistName}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Location:</Text>
          <Text style={styles.propText}>{selectedLocationOption === "2" ? text : "Clinic address will be provided after your request is accepted."}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Start time:</Text>
          <Text style={styles.propText}>{convertUTCDateToLocalDateTimeString(selectedDateTime)}</Text>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.propTitle}>Duration:</Text>
          <Text style={styles.propText}>{appointmentDuration} Hours</Text>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.propTitle}>Total:</Text>
          <Text style={styles.propText}>${subTotal}</Text>
        </View>
      </View>
      <View style={styles.termasAndConditionsContainer}>
        <Text style={styles.propText}>
          By clicking "Request to Book", you agree to our Terms and Conditions.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setVisibility(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
        </TouchableOpacity>
        {/* <BookButton title="Request to Book" onPress={onConfirmPress} /> */}
        <TouchableOpacity
          style={styles.previousButton}
          onPress={() => {
            setCurrentStep(2);
          }}
        >
          <Text style={styles.cancelButtonText}>{"Previous"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={openPaymentSheet}
        >
          <Text style={styles.primaryButtonText}>
            {"Confirm Booking & Pay"}
          </Text>
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
          <BookingProgressIndicator visible={bookingProgress} />
          <BookingDoneIndicator visible={bookingDone} />
          {!bookingProgress && !bookingDone && currentStep === 1 && (
            <TherapistDetailsStep />
          )}
          {!bookingProgress && !bookingDone && currentStep === 2 && (
            <AppointmentDetailsStep />
          )}
          {!bookingProgress && !bookingDone && currentStep === 3 && (
            <PaymentStep />
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
    height: "80%",
    width: 300,
  },
  modalContent: {
    margin: 10,
    marginLeft: 10,
    height: "90%",
    width: "90%",
    flex: 1,
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
  durationPicker: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
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
  primaryButtonText: {
    color: colors.secondary,
    fontSize: 12,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 12,
  },
});

export default BookModal;
