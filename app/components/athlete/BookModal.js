import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Alert,
  Image,
} from "react-native";
import Checkbox from "expo-checkbox";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import bookingsApi from "../../api/bookings";
import ProgressIndicator from "./ProgressIndicator";
import DoneIndicator from "./DoneIndicator";
import notificationsApi from "../../api/notifications";
import AuthContext from "../../auth/context";
import colors from "../../config/colors";
import RadioGroup from "react-native-radio-buttons-group";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useStripe } from "@stripe/stripe-react-native";
import paymentApi from "../../api/payment";
import RNPickerSelect from "react-native-picker-select";
import { StripeProvider } from "@stripe/stripe-react-native";
import TermsAndConditions from "../shared/TermsAndConditions";

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
  therapistAcceptsHouseCalls,
  therapistBusinessHours,
  therapistStripeAccountId,
  therapistStreet,
  therapistCity,
  therapistState,
  therapistZipCode,
  therapistProfilePictureUrl,
}) {
  if (!visible) return null;

  // can modify these to be dynamic based on clinic hours
  const openTime = 8; // 8:00 AM
  const closeTime = 23; // 10:00 PM

  let minDate = new Date();

  const [availableDateTimes, setAvailableDateTimes] = useState([]);
  const [timeStrDateTimeMap, setTimeStrDateTimeMap] = useState({});
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const getBookingsOnDate = async (date) => {
    try {
      // convert date to local date string YYYY-MM-DD
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const dateStr = date.getFullYear() + "-" + month + "-" + date.getDate();
      const response = await bookingsApi.getTherapistBookingsOnDate(
        therapistId,
        dateStr
      );
      return response.data;
    } catch (error) {
      console.warn("Error getting bookings on date", error);
    }
  };

  const convertHourToDateTime = (hour, date) => {
    // hour is either a number between 0 and 23 including 0.5 increments
    // date is a Date object
    const hourString = hour.toString();
    const hourInt = parseInt(hourString);
    const minute = hourString.includes(".5") ? "30" : "00";
    const timeString = hourInt + ":" + minute;
    const dateTimeString = date.toISOString().split("T")[0] + "T" + timeString;
    return new Date(dateTimeString);
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

  const getAvailableTimesInTimeSlot = async (
    date,
    duration,
    slotStartTime,
    slotEndTime,
    schedule
  ) => {
    const now = new Date();
    let startTime =
      now.toLocaleDateString() == date.toLocaleDateString()
        ? Math.max(now.getHours() + 1, Number(slotStartTime))
        : Number(slotStartTime);
    if (startTime + Number(duration) > Number(slotEndTime)) {
      return;
    }
    while (startTime <= Number(slotEndTime) - Number(duration)) {
      schedule[startTime] = 0;
      startTime += 0.5;
    }
  };

  const getAvailableTimes = async (date, duration) => {
    // get time intervals between open and close time in 30 minnute increments that are not already booked
    let bookings = await getBookingsOnDate(date);

    bookings = bookings.filter(
      (booking) =>
        booking.status !== "CancelledNoRefund" &&
        booking.status !== "CancelledRefunded"
    );

    const dateDayOfWeek = date.getDay();

    // console.warn("date = ", date);

    // console.warn("dateDayOfWeek = ", dateDayOfWeek);

    let schedule = {};

    const availableHours = therapistBusinessHours[dateDayOfWeek.toString()];

    // console.warn("availableHours = ", availableHours);

    availableHours.forEach(([startTime, endTime]) => {
      getAvailableTimesInTimeSlot(date, duration, startTime, endTime, schedule);
    });

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.booking_time);
      const bookingHour = bookingDate.getHours();
      const bookingMinute = bookingDate.getMinutes();
      const bookingTime = bookingHour + bookingMinute / 60;
      const bookingDuration = booking.duration;

      let bookedTime = Number(bookingTime);
      while (bookedTime < Number(bookingTime) + Number(bookingDuration)) {
        if (bookedTime in schedule) {
          schedule[bookedTime] = 1;
        }
        bookedTime += 0.5;
      }
    });

    const availableTimes = Object.keys(schedule)
      .filter((time) => schedule[time] === 0)
      .map((el) => Number(el));
    availableTimes.sort(function (a, b) {
      return a - b;
    });
    const availableDateTimesList = availableTimes.map((time) =>
      convertHourToDateTime(time, new Date(date))
    );
    let id = 0;
    const timeStrMap = {};
    const availableDateTimeStrs = availableDateTimesList.map((dateTime) => {
      // key is local time string in format HH:MM value is datetime
      // key is H:MM with AM/PM string, value is datetime
      id += 1;
      timeStrMap[dateTime.toISOString()] =
        convertDateTimeToLocalTimeStr(dateTime);
      return { key: id, text: dateTime.toISOString() };
    });

    setAvailableDateTimes(availableDateTimeStrs);
    setTimeStrDateTimeMap(timeStrMap);
    return;
  };

  const navigation = useNavigation();
  const [text, onChangeText] = useState(athleteLocation);
  const [bookingProgress, setBookingProgress] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState(
    therapistAcceptsHouseCalls ? "2" : "1"
  );
  const [appointmentDuration, setAppointmentDuration] = useState(2);
  // const [selectedDateTime, setSelectedDateTime] = useState(earliestAppointment);
  const { user, setUser } = useContext(AuthContext);
  const [subTotal, setSubTotal] = useState(
    therapistHourly * appointmentDuration
  );
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [currentStep, setCurrentStep] = useState(1);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [termsAndConditionModal, setTermsAndConditionModal] = useState(false);
  const [termsAndCondition, setTermsAndCondition] = useState(false);
  const refDateTime = useRef();
  const refDate = useRef();
  // const [clientSecret, setClientSecret] = useState("");
  // const [availableDateTimes, setAvailableDateTimes] = useState([]);
  // const {initPaymentSheet} = useStripe();
  // const { presentPaymentSheet } = useStripe();
  // let minDate = new Date();

  useEffect(() => {
    refDateTime.current = selectedDateTime;
    refDate.current = selectedDate;
  });

  useEffect(() => {
    if (refDateTime.current.toLocaleDateString() !== refDate.current) {
      getAvailableTimes(selectedDateTime, appointmentDuration);
    }
  }, [selectedDateTime, appointmentDuration]);

  const getTimeFromMap = (dateTimeISOString) => {
    return timeStrDateTimeMap[dateTimeISOString];
  };

  const handleDateChange = (event, selectedDate) => {
    setSelectedDateTime(selectedDate);
  };

  const handleNewTimeSlot = (time) => {
    setSelectedDate(time.toLocaleDateString());
    setSelectedDateTime(time);
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
    receipt_email: user.userObj.email,
    stripeAccountId: therapistStripeAccountId,
  };

  const getClientSecret = async () => {
    try {
      let res = await paymentApi.createPaymentIntent(paymentObj);
      setPaymentIntentId(res.data.paymentIntent.id);
      return res.data.paymentIntent.client_secret;
    } catch (error) {
      console.warn("Error getting client secret", error);
    }
  };

  const locations = therapistAcceptsHouseCalls
    ? useMemo(
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
      )
    : useMemo(
        () => [
          {
            id: "1",
            label: "Clinic",
            value: "clinic",
          },
        ],
        []
      );

  const proceedToReview = async () => {
    const timeMatch = availableDateTimes.some(
      (time) => time.text === selectedDateTime.toISOString()
    );

    const test = availableDateTimes.filter(
      (item) =>
        selectedDateTime.toLocaleString() ==
        new Date(item.text).toLocaleString()
    );
    if (availableDateTimes.length <= 0) {
      Alert.alert(
        "Error",
        "Please select an available time",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else if (!timeMatch) {
      Alert.alert(
        "Error",
        "Please select an available time",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else {
      try {
        const clientSecret = await getClientSecret(); // Ensure this async call is awaited properly
        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "Sportstretchusa",
          // testEnv: true,
          // Additional configuration options
        });

        if (error) {
          console.warn("Error initializing PaymentSheet", error);
        } else {
          setCurrentStep(3);
        }
      } catch (error) {
        console.warn("Error initializing PaymentSheet", error);
      }
    }
  };

  const openPaymentSheet = async () => {
    if (!termsAndCondition) {
      Alert.alert(
        "Error",
        "To continue, please review and accept our Terms and Conditions",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    } else {
      try {
        const { error } = await presentPaymentSheet();

        if (error) {
          console.warn("Error opening PaymentSheet", error);
        } else {
          // post payment operations
          console.log("Payment successful");
          createBooking();
        }
      } catch (error) {
        console.warn("Error opening PaymentSheet", error);
      }
    }
  };

  const handleDurationChange = async (value) => {
    if (!value) return;
    setAppointmentDuration(Number(value));
    const subTotalAmount = value * therapistHourly;
    paymentObj.amount = subTotalAmount;
    setSubTotal(subTotalAmount);
  };

  // const handleSubmit = async () => {
  //   await initializePaymentSheet();
  // };

  const createBooking = async () => {
    try {
      //showProgress
      setBookingProgress(true);
      //format text and call API

      const bookingDateStr = selectedDateTime.toISOString().split("T")[0];
      const bookingDate = new Date(bookingDateStr);

      let athleteLocation = athleteLocation;

      if (selectedLocationOption === "1") {
        athleteLocation = `${therapistStreet}, ${therapistCity}, ${therapistState}, ${therapistZipCode}`;
      }

      await bookingsApi.bookATherapist(
        athleteId,
        athleteLocation,
        therapistId,
        selectedDateTime,
        bookingDate,
        therapistHourly,
        appointmentDuration,
        subTotal,
        true,
        "Paid",
        paymentIntentId
      );
      //hideProgress & showDone
      setBookingProgress(false);
      setBookingDone(true);
      //navigate
      setTimeout(function () {
        setBookingDone(false);
        setVisibility(false);
        navigation.navigate("Upcoming Appointments");
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
      <View style={styles.profilePictureContainer}>
        {therapistProfilePictureUrl ? (
          <Image
            source={{ uri: therapistProfilePictureUrl }}
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
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Accepts House Calls:</Text>
          <Text style={styles.propText}>
            {therapistAcceptsHouseCalls ? "Yes" : "No"}
          </Text>
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
          onPress={() => {
            setCurrentStep(2);
            getAvailableTimes(selectedDateTime, appointmentDuration);
          }}
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
      <View style={styles.appointmentScrollViewContainer}>
        <ScrollView
          style={styles.appointmentDetailsScrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.rateContainer}>
            <Text style={styles.propTitle}>Hourly Rate:</Text>
            <Text style={styles.propText}>${therapistHourly}</Text>
          </View>
          <View style={styles.propContainer}>
            <Text style={styles.propTitle}>Date & Time:</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDateTime}
              mode="date"
              display="default"
              onChange={handleDateChange}
              style={styles.datePicker}
              minimumDate={minDate}
            />
            <View style={styles.timeSlotContainer}>
              {availableDateTimes.length > 0 ? (
                availableDateTimes.map((item) => {
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={
                        selectedDateTime.toLocaleString() ==
                        new Date(item.text).toLocaleString()
                          ? styles.timeSlotButtonSelected
                          : styles.timeSlotButton
                      }
                      onPress={() => {
                        handleNewTimeSlot(new Date(item.text));
                        // setSelectedDateTime(new Date(item.text));
                      }}
                    >
                      <Text
                        key={item.key}
                        style={
                          selectedDateTime.toLocaleString() ==
                          new Date(item.text).toLocaleString()
                            ? styles.timeSlotButtonSelectedText
                            : styles.timeSlotButtonText
                        }
                      >
                        {getTimeFromMap(item.text)}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text>No more availability on this date.</Text>
              )}
            </View>
          </View>
          <View style={styles.propContainer}>
            <Text style={styles.propTitle}>Duration:</Text>
            {/* Dropdown menu */}
            <View>
              <RNPickerSelect
                onValueChange={async (value) => {
                  await handleDurationChange(value);
                }}
                items={
                  appointmentDurationOptions
                    ? appointmentDurationOptions
                    : [
                        { label: "1 Hour", value: 1 },
                        { label: "2 Hours", value: 2 },
                        { label: "3 Hours", value: 3 },
                        { label: "4 Hours", value: 4 },
                        { label: "5 Hours", value: 5 },
                        { label: "6 Hours", value: 6 },
                        { label: "7 Hours", value: 7 },
                        { label: "8 Hours", value: 8 },
                      ]
                }
                placeholder={{
                  label: "Select duration for appointment",
                  value: 0,
                }}
                value={appointmentDuration}
                style={styles.durationPicker}
              />
            </View>
          </View>
          <View style={styles.rateContainer}>
            <Text style={styles.propTitle}>Subtotal:</Text>
            <Text style={styles.propText}>
              {appointmentDuration === 0
                ? "(Select a duration)"
                : `$${subTotal}`}
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
        </ScrollView>
      </View>

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
          <Text style={styles.propText}>
            {selectedLocationOption === "2"
              ? text
              : "Clinic address will be provided after your request is accepted."}
          </Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Start time:</Text>
          <Text style={styles.propText}>
            {convertUTCDateToLocalDateTimeString(selectedDateTime)}
          </Text>
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
      <View style={styles.termsAndConditionsContainer}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Checkbox
            disabled={false}
            value={termsAndCondition}
            onValueChange={(newValue) => setTermsAndCondition(newValue)}
            style={{
              marginRight: 5,
              height: 14,
              width: 14,
              justifyContent: "center",
            }}
          />
          <Text
            style={styles.propText}
            // onPress={() => setTermsAndConditionModal(true)}
          >
            I have read and agree to the{" "}
            <Text
              style={styles.termsAndConditionText}
              onPress={() => setTermsAndConditionModal(true)}
            >
              Terms and Conditions.
            </Text>
          </Text>
        </View>
      </View>
      <View stlye={styles.termsAndConditionModal}>
        <Modal animationType="slide" visible={!!termsAndConditionModal}>
          <View style={styles.termAndConditionModalBackground}>
            <Text style={styles.modalText}>Terms and Conditions</Text>
            <TermsAndConditions />
            <View
            // style={{
            //   flexDirection: "row",
            // }}
            >
              <Button
                onPress={() => setTermsAndConditionModal(false)}
                title="Dismiss"
              ></Button>
            </View>
          </View>
        </Modal>
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
    <StripeProvider
      publishableKey="pk_test_51OnV42DyUl485VKLZRnwkZn04TybrH3innsENQPR7WlE8MUy9Em0A5rP4TAixIG8QwoIWh031hJSPMOTtMc1cZQt00b9PAOcUb"
      stripeAccountId={therapistStripeAccountId}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {}}
      >
        <BlurView intensity={50} style={styles.centeredView}>
          <View style={styles.modalView}>
            <ProgressIndicator visible={bookingProgress} />
            <DoneIndicator visible={bookingDone} />
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
    </StripeProvider>
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
    height: "88%",
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
  primaryButtonText: {
    color: colors.secondary,
    fontSize: 12,
  },
  cancelButtonText: {
    color: colors.primary,
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
  termsAndConditionsContainer: {
    flex: 1,
    //justifyContent: "space-between",
  },
  termsAndConditionModal: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsAndConditionText: {
    textDecorationLine: "underline",
    // color: "blue",
  },
  termAndConditionModalBackground: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    paddingBottom: 30,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "8%",
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  accountIcon: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
});

export default BookModal;
