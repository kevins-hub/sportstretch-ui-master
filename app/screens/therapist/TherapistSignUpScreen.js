import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  Modal,
  Text,
  TextInput,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as yup from "yup";
import "yup-phone";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { useNavigation } from "@react-navigation/native";
import registerApi from "../../api/register";
import { states } from "../../lib/states";
import RNPickerSelect from "react-native-picker-select";
import Checkbox from "expo-checkbox";
import TherapistBusinessHours from "../../components/therapist/TherapistBusinessHours";
import payment from "../../api/payment";
import auth from "../../api/auth";
import register from "../../api/register";
import TermsAndConditions from "../../components/shared/TermsAndConditions";
import { handleError } from "../../lib/error";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import base64 from "react-native-base64";
import DoneIndicator from "../../components/athlete/DoneIndicator";

const bioMaxLength = 250;
const feesAndTaxesPercentage = 0.15;
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const statesItemsObj = Object.entries(states).map(([abbr, name]) => {
  return { label: abbr, value: name };
});
const addressRegExp = /^[a-zA-Z0-9\s,'.-]*$/;

const ReviewSchema = yup.object({
  fname: yup.string().required().min(1).label("First Name"),
  lname: yup.string().required().min(1).label("Last Name"),
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(8).label("Password"),
  confirmPassword: yup
    .string()
    .when("password", {
      // should match with password
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup.string().oneOf([yup.ref("password")], "Passwords must match"),
    })
    .required()
    .min(8)
    .label("Confirm Password"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone"),
  addressL1: yup
    .string()
    .matches(
      addressRegExp,
      "Address can only contain numbers, letters, spaces, commas, periods, and dashes."
    )
    .required()
    .label("Street Address"),
  addressL2: yup
    .string()
    .matches(
      addressRegExp,
      "Address can only contain numbers, letters, spaces, commas, periods, and dashes."
    )
    .label("Address Line 2"),
  city: yup
    .string("City must be string")
    .required("City is required")
    .label("City"),
  state: yup
    .string("State must be string")
    .required("State is required")
    .label("State"),
  zipcode: yup.string().required().min(5).label("ZipCode"),
  profession: yup.string().required().label("Profession"),
  services: yup.string().required().max(150).label("Services"),
  summary: yup.string().required().max(250).label("Summary"),
  hourlyRate: yup.number().required().label("Hourly Rate"),
  licenseUrl: yup.string().required().label("License URL"),
  acceptsHouseCalls: yup.boolean().required().label("Accepts House Calls"),
});

let businessHoursObj = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  "utc-offset": 0,
};

function TherapistForm(props) {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showInvalidFieldError, setShowInvalidFieldError] = useState(false);
  const [showEmailExistsError, setShowEmailExistsError] = useState(false);
  const [showPhoneExistsError, setShowPhoneExistsError] = useState(false);
  const [enableHouseCalls, setEnableHouseCalls] = useState(false);
  const [enableInClinic, setEnableInClinic] = useState(false);
  const [businessHours, setBusinessHours] = useState(businessHoursObj);
  const [termsAndConditionModal, setTermsAndConditionModal] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log("which step am i fucking on", currentStep);
    if (currentStep === 2) {
      sendSMSVerification(phoneNumber);
    } else if (currentStep === 3) {
      setVerified(false);
      sendSMSVerification(email);
    }
  }, [currentStep]);

  const register_therapist = async (values) => {
    try {
      let register_response = await registerApi.registerTherapist(values);
      if (register_response.status === 200) {
        navigation.navigate("TherapistRegistrationPending");
        notifications.notifyAdmin(
          `New recovery specialist registered: ${values.profession}: ${values.fname} ${values.lname}, ${values.email}`
        );
      } else {
        Alert.alert(
          `Error while registration: ${register_response.data} Please try again.`
        );
      }
    } catch (error) {
      Alert.alert("An error occurred during registration. Please try again.");
    }
  };

  const professionsList = [
    { label: "Massage Therapist", value: "Massage Therapist" },
    { label: "Physical Therapist", value: "Physical Therapist" },
    { label: "Athletic Trainer", value: "Athletic Trainer" },
    { label: "Chiropractor", value: "Chiropractor" },
    { label: "Acupuncturist", value: "Acupuncturist" },
    { label: "Occupational Therapist", value: "Occupational Therapist" },
    {
      label: "Physical Therapy Assistant",
      value: "Physical Therapy Assistant",
    },
    { label: "Yoga Instructor", value: "Yoga Instructor" },
    { label: "Pilates Instructor", value: "Pilates Instructor" },
  ];

  const handleNext = async (values) => {
    if (currentStep === 1) {
      const emailAvailable = await checkEmailAvailable(values.email);
      if (!emailAvailable) {
        setShowInvalidFieldError(true);
        setShowEmailExistsError(true);
        return;
      }
      const phoneAvailable = await checkPhoneAvailable(values.phone);
      if (!phoneAvailable) {
        setShowInvalidFieldError(true);
        setShowPhoneExistsError(true);
        return;
      }
      Promise.all([
        ReviewSchema.validateAt("fname", values),
        ReviewSchema.validateAt("lname", values),
        ReviewSchema.validateAt("email", values),
        ReviewSchema.validateAt("phone", values),
      ])
        .then(() => {
          setShowInvalidFieldError(false);
          setShowEmailExistsError(false);
          setShowPhoneExistsError(false);
          setCurrentStep(currentStep + 1);
          setPhoneNumber(values.phone);
          setEmail(values.email);
        })
        .catch((err) => {
          setShowInvalidFieldError(true);
          console.warn(err);
        });
    } else if (currentStep === 3) {
      Promise.all([
        ReviewSchema.validateAt("profession", values),
        ReviewSchema.validateAt("addressL1", values),
        ReviewSchema.validateAt("addressL2", values),
        ReviewSchema.validateAt("city", values),
        ReviewSchema.validateAt("state", values),
        ReviewSchema.validateAt("zipcode", values),
      ])
        .then(() => {
          setShowInvalidFieldError(false);
          setCurrentStep(currentStep + 1);
        })
        .catch((err) => {
          setShowInvalidFieldError(true);
          // console.warn(err);
        });
    } else if (currentStep === 4) {
      setShowInvalidFieldError(false);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      setShowInvalidFieldError(false);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      Promise.all([ReviewSchema.validateAt("licenseUrl", values)])
        .then(() => {
          setShowInvalidFieldError(false);
          setCurrentStep(currentStep + 1);
        })
        .catch((err) => setShowInvalidFieldError(true));
    }
    return;
  };

  const checkEmailAvailable = async (email) => {
    try {
      const response = await auth.checkEmail(email);
      return response.data === "Email already registered." ? false : true;
    } catch (error) {
      console.warn("Error checking email availability: ", error);
      return false;
    }
  };

  const checkPhoneAvailable = async (phone) => {
    try {
      const response = await registerApi.checkPhone(phone);
      return response.data === "Phone already registered." ? false : true;
    } catch (error) {
      console.warn("Error checking phone availability: ", error);
      return false;
    }
  };

  const handlePrevious = () => {
    setShowInvalidFieldError(false);
    if (currentStep === 3) {
      setCurrentStep(currentStep - 2);
    } else if (currentStep === 4) {
      setCurrentStep(currentStep - 3);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const sendSMSVerification = async (value) => {
    console.log("is this working");
    if (currentStep === 2) {
      let code = Math.floor(100000 + Math.random() * 900000);
      setVerificationCode(code);
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

      const body = new URLSearchParams({
        To: `+1${value}`,
        From: "+18333628163",
        Body: `SportStretch: Your verification code is ${code}`,
      });

      const headers = {
        Authorization:
          "Basic " +
          base64.encode(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        "Content-Type": "application/x-www-form-urlencoded",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: body.toString(),
        });
        const data = await response.json();
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    } else if (currentStep === 3) {
      try {
        const code = Math.floor(100000 + Math.random() * 900000);
        setVerificationCode(code);
        let emailVerificationCode = { email: email, token: code };
        let res = await register.verifyEmail(emailVerificationCode);
        if (!!res) {
          console.warn("It worked");
        } else {
          console.warn("error in verifying email");
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const resetVerificationStep = () => {
    setVerified(false);
    setHasAttempted(false);
    setCurrentStep(currentStep + 1);
  };

  const handleVerificationComplete = (code) => {
    setHasAttempted(true);
    if (parseInt(code) === verificationCode) {
      // setCurrentStep(currentStep + 1);
      setVerified(true);
      setTimeout(resetVerificationStep, 2000);
    }
  };

  const ContactStep = (props) => (
    // contact details
    <>
      <View style={styles.inputContainer}>
        <View>
          <FontAwesome5
            name="user-alt"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="First Name"
          onChangeText={props.handleChange("fname")}
          value={props.values.fname}
          onBlur={props.handleBlur("fname")}
          textContentType="givenName"
        />
      </View>
      {props.touched.fname && props.errors.fname && (
        <Text style={styles.errorText}>{props.errors.fname}</Text>
      )}
      <View style={styles.inputContainer}>
        <View>
          <FontAwesome5
            name="user-alt"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Last Name"
          onChangeText={props.handleChange("lname")}
          value={props.values.lname}
          onBlur={props.handleBlur("lname")}
          textContentType="familyName"
        />
      </View>
      {props.touched.lname && props.errors.lname && (
        <Text style={styles.errorText}>{props.errors.lname}</Text>
      )}

      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="email-open"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Email"
          onChangeText={props.handleChange("email")}
          value={props.values.email}
          keyboardType="email-address"
          onBlur={props.handleBlur("email")}
          textContentType="emailAddress"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {props.touched.email && props.errors.email && (
        <Text style={styles.errorText}>{props.errors.email}</Text>
      )}
      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="phone"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Phone"
          onChangeText={props.handleChange("phone")}
          value={props.values.phone}
          keyboardType="phone-pad"
          onBlur={props.handleBlur("phone")}
          textContentType="telephoneNumber"
        />
      </View>
      {props.touched.phone && props.errors.phone && (
        <Text style={styles.errorText}>{props.errors.phone}</Text>
      )}
    </>
  );

  const VerificationStep = (props) => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text>
        Your verification code has been sent to your{" "}
        {currentStep === 2 ? "mobile number" : "email"}. Please enter the
        6-digit code below to complete your login.
      </Text>

      <OTPInputView
        style={{
          width: "80%",
          height: 200,
          color: "black",
        }}
        pinCount={6}
        codeInputFieldStyle={styles.verificationInputField}
        codeInputHighlightStyle={styles.verificationHighlightField}
        onCodeFilled={handleVerificationComplete}
      />
      {!!hasAttempted && !verified && (
        <Text style={styles.errorText}>
          The code does not match. Please try again
        </Text>
      )}
      <DoneIndicator visible={!!verified} />
    </View>
  );

  const ServicesStep = (props) => (
    // service details
    <>
      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="briefcase"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <RNPickerSelect
          onValueChange={props.handleChange("profession")}
          items={professionsList ? professionsList : ["Massage Therapist"]}
          placeholder={{ label: "Choose your Primary Discipline", value: "" }}
          value={props.values.profession}
        />
      </View>
      {props.touched.profession && props.errors.profession && (
        <Text style={styles.errorText}>{props.errors.profession}</Text>
      )}
      {/* Services offered */}
      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="arm-flex"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Additional Services Offered"
          onChangeText={props.handleChange("services")}
          value={props.values.services}
          onBlur={props.handleBlur("services")}
          multiline={true}
        />
      </View>
      {props.touched.services && props.errors.services && (
        <Text style={styles.errorText}>{props.errors.services}</Text>
      )}
      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="star"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={styles.summaryTextInput}
          placeholder="Professional Bio"
          onChangeText={props.handleChange("summary")}
          value={props.values.summary}
          onBlur={props.handleBlur("summary")}
          multiline={true}
          maxLength={bioMaxLength}
        />
      </View>
      <Text
        style={styles.summaryCharCount}
      >{`${props.values.summary.length}/${bioMaxLength}`}</Text>
      {props.touched.summary && props.errors.summary && (
        <Text style={styles.errorText}>{props.errors.summary}</Text>
      )}

      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="cash-multiple"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Hourly Rate"
          onChangeText={props.handleChange("hourlyRate")}
          value={props.values.hourlyRate}
          onBlur={props.handleBlur("hourlyRate")}
        />
      </View>
      {props.values.hourlyRate > 0 ? (
        <Text style={styles.actualRateText}>
          You will recieve : $
          {parseFloat(
            props.values.hourlyRate * (1 - feesAndTaxesPercentage)
          ).toFixed(2)}{" "}
          per hour
        </Text>
      ) : (
        <></>
      )}
      {props.touched.hourlyRate && props.errors.hourlyRate && (
        <Text style={styles.errorText}>{props.errors.hourlyRate}</Text>
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={enableInClinic}
          onValueChange={setEnableInClinic}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          I have a clinic/facility for clients to visit
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={enableHouseCalls}
          onValueChange={setEnableHouseCalls}
          style={styles.checkbox}
        />
        <Text style={styles.label}>
          I am open to traveling to clients for our appointments
        </Text>
      </View>
      <Text style={styles.subheaderText}>
        {enableInClinic ? "Clinic Address:" : "Home / Office Address:"}
      </Text>
      <View style={styles.inputContainerAddress}>
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
          placeholder="Street Address"
          onChangeText={props.handleChange("addressL1")}
          value={props.values.addressL1}
          onBlur={props.handleBlur("addressL1")}
          textContentType="streetAddressLine1"
        />
      </View>
      {props.touched.addressL1 && props.errors.addressL1 && (
        <Text style={styles.errorText}>{props.errors.addressL1}</Text>
      )}
      {/* <Text style={styles.errorText}>
            {" "}
            {props.touched.addressL1 && props.errors.addressL1}
          </Text> */}

      <View style={styles.inputContainerAddress}>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Apt, Suite, Floor, Building"
          onChangeText={props.handleChange("addressL2")}
          value={props.values.addressL2}
          onBlur={props.handleBlur("addressL2")}
          textContentType="streetAddressLine2"
        />
      </View>
      {props.touched.addressL2 && props.errors.addressL2 && (
        <Text style={styles.errorText}>{props.errors.addressL2}</Text>
      )}
      {/* <Text style={styles.errorText}>
            {" "}
            {props.touched.addressL2 && props.errors.addressL2}
          </Text> */}

      <View style={styles.inputContainerCityState}>
        <View style={{ width: "45%" }}>
          <View style={styles.inputContainerCity}>
            <View>
              <MaterialCommunityIcons
                name="city"
                size={16}
                color="black"
                style={{ paddingRight: "5%" }}
              />
            </View>
            <TextInput
              placeholder="City"
              onChangeText={props.handleChange("city")}
              value={props.values.city}
              onBlur={props.handleBlur("city")}
              textContentType="addressCity"
            />
          </View>
          {props.touched.city && props.errors.city && (
            <Text style={styles.errorTextCityState}>{props.errors.city}</Text>
          )}
          {/* <Text style={styles.errorTextCityState}>
                {" "}
                {props.touched.city && props.errors.city}
              </Text> */}
        </View>

        <View style={{ marginHorizontal: "10%", width: "45%" }}>
          <View style={styles.inputContainerState}>
            <RNPickerSelect
              placeholder={{ label: "Select A State", value: "" }}
              value={props.values.state}
              onValueChange={props.handleChange("state")}
              items={
                statesItemsObj
                  ? statesItemsObj
                  : [{ label: "CA", value: "California" }]
              }
            ></RNPickerSelect>
          </View>
          {props.touched.state && props.errors.state && (
            <Text style={styles.errorTextCityState}>{props.errors.state}</Text>
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
          onChangeText={props.handleChange("zipcode")}
          value={props.values.zipcode}
          onBlur={props.handleBlur("zipcode")}
          textContentType="postalCode"
        />
      </View>
      <Text style={styles.errorText}>
        {" "}
        {props.touched.zipcode && props.errors.zipcode}
      </Text>
    </>
  );

  const LicenseStep = (props) => (
    // license
    <>
      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="license"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="License URL"
          onChangeText={props.handleChange("licenseUrl")}
          value={props.values.licenseUrl}
          onBlur={props.handleBlur("licenseUrl")}
          textContentType="URL"
          autoCapitalize="none"
        />
      </View>
      {props.touched.licenseUrl && props.errors.licenseUrl && (
        <Text style={styles.errorText}>{props.errors.licenseUrl}</Text>
      )}
      <Text style={styles.subheaderText}>
        Please provide a link to your active license. This information is
        essential in assuring the safety and legitimacy of services to your
        clients.
      </Text>
    </>
  );

  const PasswordStep = (props) => (
    // password
    <>
      <Text style={styles.subheaderText}>
        Please create a password for your account that is at least 8 characters
        in length.
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="key-variant"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={props.handleChange("password")}
          value={props.values.password}
          keyboardType="visible-password"
          onBlur={props.handleBlur("password")}
          textContentType="newPassword"
          secureTextEntry={true}
        />
      </View>
      <Text style={styles.errorText}>
        {" "}
        {props.touched.password && props.errors.password}
      </Text>

      <View style={styles.inputContainer}>
        <View>
          <MaterialCommunityIcons
            name="key-variant"
            size={16}
            color="black"
            style={{ paddingRight: "5%" }}
          />
        </View>
        <TextInput
          style={{ flex: 1, flexWrap: "wrap" }}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Confirm Password"
          onChangeText={props.handleChange("confirmPassword")}
          value={props.values.confirmPassword}
          keyboardType="visible-password"
          onBlur={props.handleBlur("confirmPassword")}
          textContentType="newPassword"
          secureTextEntry={true}
        />
      </View>
      <Text style={styles.errorText}>
        {" "}
        {props.touched.confirmPassword && props.errors.confirmPassword}
      </Text>

      <View style={styles.termsAndConditionsContainer}>
        <Text
          style={styles.propText}
          // onPress={() => setTermsAndConditionModal(true)}
        >
          By clicking sign up, you agree to our{" "}
          <Text
            style={styles.termsAndConditionText}
            onPress={() => setTermsAndConditionModal(true)}
          >
            Terms and Conditions.
          </Text>
        </Text>
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
    </>
  );

  const handleBackToLogin = () => {
    navigation.goBack();
    setCurrentStep(1);
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      snapToAlignment={null}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/logo_crop.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Recovery On The Go</Text>
      </View>
      {currentStep === 1 && (
        <Text style={styles.accountText}>Tell us about yourself</Text>
      )}
      {currentStep === 2 && (
        <Text style={styles.accountText}>Phone Verification</Text>
      )}
      {currentStep === 3 && (
        <Text style={styles.accountText}>Email Verification</Text>
      )}
      {currentStep === 4 && (
        <Text style={styles.accountText}>Tell us about your business</Text>
      )}
      {currentStep === 5 && (
        <Text style={styles.accountText}>Set your availability</Text>
      )}
      {currentStep === 6 && (
        <Text style={styles.accountText}>
          Please provide your license information
        </Text>
      )}
      {currentStep === 7 && <Text style={styles.accountText}>Last Step!</Text>}
      {/* <Text style={styles.accountText}>Create your profile</Text> */}
      <Formik
        initialValues={{
          fname: "",
          lname: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          otp: "",
          addressL1: "",
          addressL2: "",
          city: "",
          state: "",
          zipcode: "",
          profession: "",
          services: "",
          summary: "",
          hourlyRate: "",
          licenseUrl: "",
          acceptsHouseCalls: false,
        }}
        validationSchema={ReviewSchema}
        onSubmit={async (values, actions) => {
          values.state = values.state;
          values.acceptsHouseCalls = enableHouseCalls;
          values.acceptsInClinic = enableInClinic;
          values.businessHours = businessHours;
          try {
            const registerStripeResponse = await payment.registerStripeAccount({
              email: values.email.toLowerCase(),
            });
            if (handleError(registerStripeResponse)) return;
            if (registerStripeResponse.status === 200) {
              const stripeAccountId = registerStripeResponse.data.account.id;
              values.stripeAccountId = stripeAccountId;
            }
          } catch (error) {
            console.warn("Error registering stripe account: ", error);
          }

          register_therapist(values);
          actions.resetForm();
        }}
      >
        {(props) => (
          <View style={styles.propsContainer}>
            {/* <DoneIndicator
              visible={
                (currentStep === 2 && !!isVerified) ||
                (currentStep === 3 && !!isVerified)
              }
            /> */}
            {currentStep === 1 && <ContactStep {...props} />}
            {currentStep === 2 && <VerificationStep {...props} />}
            {currentStep === 3 && <VerificationStep {...props} />}
            {currentStep === 4 && <ServicesStep {...props} />}
            {currentStep === 5 && (
              <TherapistBusinessHours
                businessHours={businessHours}
                setBusinessHours={setBusinessHours}
              />
            )}
            {currentStep === 6 && <LicenseStep {...props} />}
            {currentStep === 7 && <PasswordStep {...props} />}
            <View style={styles.buttonContainer}>
              {showInvalidFieldError && (
                <Text style={styles.errorText}>
                  Please fix errors in fields before continuing.
                </Text>
              )}
              {showEmailExistsError && (
                <Text style={styles.errorText}>
                  An account with this email already exists.
                </Text>
              )}
              {showPhoneExistsError && (
                <Text style={styles.errorText}>
                  An account with this phone number already exists.
                </Text>
              )}
              {currentStep > 1 && currentStep !== 6 && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handlePrevious}
                  disabled={!!verified}
                >
                  <Text style={styles.secondaryButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              {(currentStep === 1 || currentStep > 3) && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleNext(props.values);
                  }}
                  type="button"
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              )}
              {(currentStep == 2 || currentStep == 3) && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    sendSMSVerification(currentStep === 2 ? phoneNumber : email)
                  }
                  type="button"
                  disabled={!!verified}
                >
                  <Text style={styles.buttonText}>Resend Code</Text>
                </TouchableOpacity>
              )}
              {currentStep === 6 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={props.handleSubmit}
                >
                  <Text style={styles.buttonText}>Finish Sign Up</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.backToLoginContainer}>
              <Text>Already have an account?</Text>
              <TouchableOpacity
                onPress={handleBackToLogin}
                style={styles.loginLink}
              >
                <Text style={styles.loginLink}>Log in here</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  propsContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  accountText: {
    fontSize: 25,
    color: colors.dullblack,
    marginBottom: "5%",
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
    marginBottom: 1,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
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
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 100,
    backgroundColor: colors.primary,
    marginBottom: "5%",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius:25,
    // borderTopStartRadius: 25,
    // borderTopEndRadius:25
  },
  headerText: {
    color: colors.secondary,
    fontSize: 16,
    marginLeft: "0%",
    fontWeight: "bold",
  },
  subheaderText: {
    color: colors.primary,
    marginHorizontal: "10%",
    marginTop: "5%",
  },
  errorText: {
    marginHorizontal: "10%",
    padding: "1%",
    color: colors.grey,
    fontWeight: "bold",
    fontSize: 15,
  },
  errorTextCityState: {
    marginHorizontal: "5%",
    padding: "2%",
    color: colors.grey,
    fontWeight: "bold",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    padding: "2%",
    marginHorizontal: "10%",
    marginTop: "4%",
  },
  inputContainerAddress: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: "2%",
    paddingBottom: "2%",
    marginHorizontal: "10%",
    marginTop: "5%",
  },
  inputContainerCity: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: "4%",
    paddingHorizontal: "2%",
  },
  inputContainerCityState: {
    flexDirection: "row",
    marginHorizontal: "10%",
    marginTop: "5%",
  },
  inputContainerState: {
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: "4%",
    paddingHorizontal: "7%",
  },
  inputContainerZip: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    padding: "2%",
    marginHorizontal: "10%",
    marginTop: "2%",
  },
  actualRateText: {
    marginHorizontal: "10%",
    marginTop: "2%",
    fontWeight: "bold",
  },
  summaryTextInput: {
    flex: 1,
    flexWrap: "wrap",
    height: 120,
  },
  summaryCharCount: {
    textAlign: "right",
    marginRight: "10%",
    color: colors.grey,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginHorizontal: "12%",
    marginTop: "5%",
  },
  checkbox: {
    alignSelf: "top",
    marginRight: "5%",
  },
  buttonContainer: {
    flexDirection: "column-reverse",
    justifyContent: "space-around",
    marginHorizontal: "10%",
    marginTop: "5%",
    marginLeft: "auto",
    marginRight: "auto",
    width: "70%",
  },
  backToLoginContainer: {
    marginTop: "20%",
    alignItems: "center",
  },
  loginLink: {
    marginTop: "1%",
    marginBottom: "15%",
    textDecorationLine: "underline",
  },
  logo: {
    flex: 0.3,
    resizeMode: "contain",
    marginRight: "2%",
  },
  termsAndConditionsContainer: {
    marginHorizontal: "10%",
    marginTop: "5%",
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
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  verificationInputField: {
    // width: 30,
    // height: 45,
    // borderWidth: 0,
    // borderBottomWidth: 1,
    color: "#000",
  },

  verificationHighlightField: {
    // borderColor: "#03DAC6",
    borderColor: "#000",
  },
});

export default TherapistForm;
