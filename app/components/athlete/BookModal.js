import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  UIManager,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { TextInput, ScrollView } from "react-native-gesture-handler";
// import { BlurView } from "expo-blur";
// import { BlurView } from "@react-native-community/blur";
import { BlurView as ExpoBlurView } from "expo-blur";
import { BlurView as RNBlurView } from "@react-native-community/blur";
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
import { states } from "../../lib/states";
import {
  FontAwesome,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { STRIPE_P_KEY_TEST } from "@env";
import { useHeaderHeight } from "@react-navigation/elements";

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
  therapistProfession,
}) {
  if (!visible) return null;

  // can modify these to be dynamic based on clinic hours

  const height = useHeaderHeight();

  let minDate = new Date();
  const statesItemsObj = Object.entries(states).map(([abbr, name]) => {
    return { label: abbr, value: abbr };
  });

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
    console.warn("bookings", bookings);

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
    console.warn("availableDateTimeStrs", availableDateTimeStrs);
    console.log("availableDateTimeStrs", availableDateTimeStrs);
    setAvailableDateTimes(availableDateTimeStrs);
    setTimeStrDateTimeMap(timeStrMap);
    return;
  };

  const navigation = useNavigation();
  const [athleteAddress, setAthleteAddress] = useState("");
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
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [termsAndConditionModal, setTermsAndConditionModal] = useState(false);
  const [termsAndCondition, setTermsAndCondition] = useState(false);
  const refDateTime = useRef();
  const refDate = useRef();
  const locationSchema = () =>
    yup.object().shape({
      addressL1: yup.string().when([], {
        is: () => selectedLocationOption === "2",
        then: yup.string().required("Required").label("Street Address"),
        otherwise: yup.string().nullable(),
      }),
      addressL2: yup.string().label("Address Line 2"),
      city: yup.string().when([], {
        is: () => selectedLocationOption === "2",
        then: yup.string().required("Required").label("City"),
        otherwise: yup.string().nullable(),
      }),
      state: yup.string().when([], {
        is: () => selectedLocationOption === "2",
        then: yup.string().required("Required").label("State"),
        otherwise: yup.string().nullable(),
      }),
      zipcode: yup.string().when([], {
        is: () => selectedLocationOption === "2",
        then: yup.string().required("Required").min(5).label("ZipCode"),
        otherwise: yup.string().nullable(),
      }),
    });
  // const [clientSecret, setClientSecret] = useState("");
  // const [availableDateTimes, setAvailableDateTimes] = useState([]);
  // const {initPaymentSheet} = useStripe();
  // const { presentPaymentSheet } = useStripe();
  // let minDate = new Date();

  useEffect(() => {
    console.log("hello");
    getAvailableTimes(selectedDateTime, appointmentDuration);
  }, [selectedDateTime, appointmentDuration]);

  const getTimeFromMap = (dateTimeISOString) => {
    return timeStrDateTimeMap[dateTimeISOString];
  };

  // const handleDateChange = (event, selectedDate) => {
  //   setSelectedDateTime(selectedDate);
  // };

  const handleDateChange = (event, selectedDate) => {
    console.warn("selectedDate", selectedDate);
    setShowPicker(false); // Close the picker
    if (selectedDate) {
      setSelectedDateTime(selectedDate);
    }
  };

  const handleNewTimeSlot = (time) => {
    setSelectedTime(time);
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

  const proceedToReview = async (values) => {
    let formattedAddress = `${values.addressL1}${
      values.addressL2 ? " " + values.addressL2 + ", " : ", "
    }${values.city}, ${values.state} ${values.zipcode}`;
    if (!!formattedAddress) {
      setAthleteAddress(formattedAddress);
    }
    const timeMatch = availableDateTimes.some(
      (time) => time.text === selectedTime.toISOString()
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

      const bookingDateStr = selectedTime.toISOString().split("T")[0];
      const bookingDate = new Date(bookingDateStr);

      let athleteLocation = athleteAddress;

      if (selectedLocationOption === "1") {
        athleteLocation = `${therapistStreet}, ${therapistCity}, ${therapistState} ${therapistZipCode}`;
      }

      await bookingsApi.bookATherapist(
        athleteId,
        athleteLocation,
        therapistId,
        selectedTime,
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
          <Text style={styles.propTitle}>Primary Discipline:</Text>
          <Text style={styles.propText}>{therapistProfession}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Professional Bio:</Text>
          <Text style={styles.propText}>{therapistSummary}</Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Additional Services Offered:</Text>
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
      </View>
    </View>
  );

  const AppointmentDetailsStep = React.memo(() => (
    <Formik
      initialValues={{
        addressL1: "",
        addressL2: "",
        city: "",
        state: "",
        zipcode: "",
      }}
      validationSchema={locationSchema}
      onSubmit={(values) => proceedToReview(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Book your appointment with {therapistName}!
          </Text>
          <KeyboardAvoidingView
            // change padding to height for android devices  platform === ios ? padding : height
            behavior="padding"
            style={{ flex: 1 }}
          >
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
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={selectedDateTime || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      style={styles.datePicker}
                      minimumDate={minDate}
                    />
                  ) : (
                    <View>
                      <TouchableOpacity
                        title="Select Date"
                        onPress={() => setShowPicker(true)}
                        onChange={handleDateChange}
                        style={styles.selectDateButton}
                      >
                        <Text style={styles.primaryButtonText}>
                          {"Select Date"}
                        </Text>
                      </TouchableOpacity>

                      {showPicker && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={selectedDateTime}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                          style={styles.datePicker}
                          minimumDate={new Date()} // Example minimum date
                        />
                      )}
                      <Text style={styles.selectedDate}>
                        {selectedDateTime.toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.timeSlotContainer}>
                    {availableDateTimes.length > 0 ? (
                      availableDateTimes.map((item) => {
                        return (
                          <TouchableOpacity
                            key={item.key}
                            style={
                              selectedTime.toLocaleString() ==
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
                                selectedTime.toLocaleString() ==
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
                </View>
                {selectedLocationOption === "2" ? (
                  <View style={styles.propContainer}>
                    <Text style={styles.propTitle}>Your Location:</Text>

                    <View style={styles.inputContainer}>
                      <View>
                        <FontAwesome
                          name="address-book"
                          size={16}
                          color="black"
                          style={{ paddingRight: "5%" }}
                        />
                      </View>
                      <TextInput
                        style={{ flex: 1, flexWrap: "wrap" }}
                        placeholder="Address"
                        onChangeText={handleChange("addressL1")}
                        onBlur={handleBlur("addressL1")}
                        name="addressL1"
                        value={values.addressL1}
                        autoCapitalize="none"
                      />
                    </View>
                    {touched.addressL1 && errors.addressL1 && (
                      <Text style={styles.errorText}>{errors.addressL1}</Text>
                    )}
                    <View style={styles.inputContainerAddress}>
                      <TextInput
                        style={{ flex: 1, flexWrap: "wrap" }}
                        placeholder="Apt, Suite, Floor, Building"
                        onChangeText={handleChange("addressL2")}
                        onBlur={handleBlur("addressL2")}
                        name="addressL2"
                        value={values.addressL2}
                        textContentType="streetAddressLine2"
                      />
                      {touched.addressL2 && errors.addressL2 && (
                        <Text style={styles.errorText}>{errors.addressL2}</Text>
                      )}
                    </View>
                    <View style={styles.inputContainerCityState}>
                      <View style={{ width: "45%" }}>
                        <View style={styles.inputContainerCity}>
                          <TextInput
                            placeholder="City"
                            onChangeText={handleChange("city")}
                            value={values.city}
                            onBlur={handleBlur("city")}
                            textContentType="addressCity"
                          />
                        </View>
                        {touched.city && errors.city && (
                          <Text style={styles.errorText}>{errors.city}</Text>
                        )}
                      </View>
                      <View style={{ marginHorizontal: "10%", width: "45%" }}>
                        <View style={styles.inputContainerState}>
                          <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            style={{
                              inputAndroid: {
                                justifyContent: "center",
                                fontSize: 15,
                                paddingLeft: 7,

                                paddingTop: 10,
                              },
                            }}
                            placeholder={{ label: "State", value: null }}
                            value={values.state}
                            onValueChange={handleChange("state")}
                            items={statesItemsObj}
                          ></RNPickerSelect>
                        </View>
                        {touched.state && errors.state && (
                          <Text style={styles.errorText}>{errors.state}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.inputContainerZip}>
                      <View>
                        <SimpleLineIcons
                          name="location-pin"
                          size={16}
                          color="black"
                          style={{ paddingRight: "5%" }}
                        />
                      </View>
                      <TextInput
                        style={{ flex: 1, flexWrap: "wrap" }}
                        placeholder="Zipcode"
                        onChangeText={handleChange("zipcode")}
                        onBlur={handleBlur("zipcode")}
                        name="zipcode"
                        value={values.zipcode}
                        textContentType="postalCode"
                      />
                    </View>
                    {touched.zipcode && errors.zipcode && (
                      <Text style={styles.errorText}>{errors.zipcode}</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.clinicInfoText}>
                    Clinic address will be provided upon confirmation of
                    appointment.
                  </Text>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setVisibility(false);
              }}
            >
              <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
            </TouchableOpacity>
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
              // onPress={proceedToReview}
              onPress={handleSubmit}
            >
              <Text style={styles.primaryButtonText}>{"Review & Pay"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  ));

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
              ? athleteAddress
              : "Clinic address will be provided after your request is accepted."}
          </Text>
        </View>
        <View style={styles.propContainer}>
          <Text style={styles.propTitle}>Start time:</Text>
          <Text style={styles.propText}>
            {convertUTCDateToLocalDateTimeString(selectedTime)}
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

  const UnifiedBlurView = ({ children, style }) => {
    const BlurComponent = Platform.OS === "ios" ? ExpoBlurView : RNBlurView;

    return (
      <BlurComponent
        intensity={50}
        blurType="light"
        blurAmount={10}
        style={style}
      >
        {children}
      </BlurComponent>
    );
  };

  return (
    <StripeProvider
      publishableKey={
        process.env.ENVIRONMENT === "prod"
          ? process.env.STRIPE_P_KEY_LIVE
          : process.env.STRIPE_P_KEY_TEST
          ? process.env.STRIPE_P_KEY_TEST
          : STRIPE_P_KEY_TEST
      }
      stripeAccountId={therapistStripeAccountId}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {}}
      >
        <UnifiedBlurView style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <KeyboardAvoidingView
              // change padding to height for android devices  platform === ios ? padding : height
              behavior="padding"
              style={{ flex: 1 }}
            > */}
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
            {/* </KeyboardAvoidingView> */}
          </View>
        </UnifiedBlurView>
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
  errorText: {
    marginHorizontal: "10%",
    padding: "1%",
    color: colors.grey,
    fontWeight: "bold",
    fontSize: 15,
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
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    padding: "2%",
    // marginHorizontal: "10%",
    marginRight: "10%",
    marginTop: "4%",
  },
  inputContainerAddress: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: "2%",
    paddingBottom: "2%",
    // marginHorizontal: "10%",
    marginRight: "9%",
    marginTop: "5%",
  },
  inputContainerCity: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: "4%",
    paddingHorizontal: "5%",
    // marginRight: "9%",
  },
  inputContainerCityState: {
    flexDirection: "row",
    marginRight: "9%",
    // marginHorizontal: "10%",
    marginTop: "5%",
  },
  inputContainerState: {
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: "4%",
        paddingHorizontal: "7%",
      },
      android: {
        borderWidth: 1,
        borderRadius: 15,
        height: 40,
        paddingBottom: 10,
      },
    }),
  },
  inputContainerZip: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    padding: "2%",
    // marginHorizontal: "10%",
    marginRight: "9%",
    marginTop: "5%",
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
  selectDateButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
  },
  selectedDate: {
    textAlign: "center",
    padding: 6,
    fontWeight: "bold",
    fontSize: 20,
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

export default React.memo(BookModal);
