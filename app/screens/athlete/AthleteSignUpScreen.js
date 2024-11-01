import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as yup from "yup";
import Constants from "expo-constants";
import colors from "../../config/colors";
import registerApi from "../../api/register";
import { useNavigation } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
import auth from "../../api/auth";
import TermsAndConditions from "../../components/shared/TermsAndConditions";
import notifications from "../../api/notifications";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import base64 from "react-native-base64";
import DoneIndicator from "../../components/athlete/DoneIndicator";
import register from "../../api/register";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const ReviewSchema = yup.object({
  fname: yup.string().required().min(1).label("First Name"),
  lname: yup.string().required().min(1).label("Last Name"),
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
  confirmPassword: yup
    .string()
    .when("password", {
      // should match with password
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup.string().oneOf([yup.ref("password")], "Passwords must match"),
    })
    .required()
    .min(6)
    .label("Confirm Password"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid. Please use numbers only.")
    .required()
    .max(10)
    .label("Phone"),
});

function AthleteForm(props) {
  const navigation = useNavigation();
  const [showEmailExistsError, setShowEmailExistsError] = useState(false);
  const [showPhoneExistsError, setShowPhoneExistsError] = useState(false);
  const [termsAndConditionModal, setTermsAndConditionModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [athleteForm, setAthleteForm] = useState(null);
  const [verificationCode, setVerificationCode] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      sendSMSVerification(athleteForm.phone);
    } else if (currentStep === 3) {
      sendSMSVerification(athleteForm.email);
    }
  }, [currentStep]);

  const sendSMSVerification = async (value) => {
    let code = Math.floor(100000 + Math.random() * 900000);
    setVerificationCode(code);
    if (currentStep === 2) {
      console.log("code", code);
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
      console.log("step 3 is initated");
      try {
        let emailVerificationCode = { email: athleteForm.email, token: code };
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

  const registerAthlete = async () => {
    try {
      const athlete = {
        email: athleteForm.email.toLowerCase(),
        firstName: athleteForm.fname,
        lastName: athleteForm.lname,
        password: athleteForm.password,
        confirmPassword: athleteForm.confirmPassword,
        mobile: athleteForm.phone,
      };
      let register_response = await registerApi.registerAthlete(athlete);
      if (register_response.status === 200) {
        alert("Registration successful.");
        notifications.notifyAdmin(
          `New athlete registered: ${athlete.firstName} ${athlete.lastName} ${athlete.email}`
        );
        navigation.navigate("Login");
      } else {
        Alert.alert(`An error occurred during registration. Please try again.`);
      }
    } catch (error) {
      Alert.alert("An error occurred during registration. Please try again.");
    }
  };

  const resetVerificationStep = () => {
    setVerified(false);
    setHasAttempted(false);
    if (currentStep <= 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleVerificationComplete = async (code) => {
    setHasAttempted(true);
    if (parseInt(code) === verificationCode) {
      if (currentStep === 3) {
        await registerAthlete(athleteForm);
      }
      setVerified(true);
      setTimeout(resetVerificationStep, 2000);
    }
  };

  const handleSubmit = async (values) => {
    const emailAvailable = await checkEmailAvailable(
      values.email.toLowerCase()
    );
    const phoneAvailable = await checkPhoneAvailable(values.phone);
    if (!phoneAvailable) {
      setShowPhoneExistsError(true);
      return;
    } else if (!emailAvailable) {
      setShowEmailExistsError(true);
      return;
    } else if (!!phoneAvailable && !!emailAvailable) {
      setAthleteForm(values);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
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

  const CreateAccount = () => (
    <>
      <View style={styles.CaptionContainer}>
        <Text style={styles.accountText}>Create your account</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            fname: "",
            lname: "",
            email: "",
            phone: "",
            password: "",
          }}
          validationSchema={ReviewSchema}
          onSubmit={async (values, actions) => {
            await handleSubmit(values, actions);
          }}
        >
          {(props) => (
            <View>
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
              <Text style={styles.errorText}>
                {" "}
                {props.touched.fname && props.errors.fname}
              </Text>
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
              <Text style={styles.errorText}>
                {" "}
                {props.touched.lname && props.errors.lname}
              </Text>

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
              <Text style={styles.errorText}>
                {" "}
                {props.touched.email && props.errors.email}
                {showEmailExistsError && "Email already registered."}
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
                  placeholder="Password"
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                  keyboardType="visible-password"
                  // onBlur={props.handleBlur("password")}
                  // textContentType="newPassword"
                  // autoCapitalize="none"
                  // secureTextEntry={true}
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
              <Text style={styles.errorText}>
                {" "}
                {props.touched.phone && props.errors.phone}
                {showPhoneExistsError && "Phone number already registered."}
              </Text>
              <TouchableOpacity onPress={props.handleSubmit}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

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

        <View style={styles.backToLoginContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.loginLink}
          >
            <Text style={styles.loginLink}>Log in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );

  const VerificationStep = (props) => (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.CaptionContainer}>
        <Text style={styles.accountText}>
          {currentStep === 2 ? "SMS Verification Step" : "Email Verification"}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>
          Your verification code has been sent to your{" "}
          {currentStep === 2 ? "mobile number" : "email"}. Please enter the
          6-digit code below to complete your login.
        </Text>
        <OTPInputView
          style={{
            width: "80%",
            height: 120,
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
      </View>

      <DoneIndicator visible={!!verified} style={{ width: 10, height: 10 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          sendSMSVerification(
            currentStep === 2 ? athleteForm.phone : athleteForm.email
          )
        }
        type="button"
      >
        <Text style={styles.buttonText}>Resend Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          setCurrentStep(currentStep === 2 ? currentStep - 1 : currentStep - 2)
        }
        type="button"
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerConatiner}>
        <Image
          source={require("../../assets/logo_crop.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Recovery On The Go</Text>
      </View>
      {currentStep === 1 && <CreateAccount />}
      {currentStep === 2 && <VerificationStep />}
      {currentStep === 3 && <VerificationStep />}
    </View>
  );
}

const styles = StyleSheet.create({
  accountText: {
    fontSize: 25,
    color: colors.dullblack,
    //marginBottom: "5%",
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 15,
    width: "35%",
    margin: 10,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 17,
    fontWeight: "bold",
  },
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  headerConatiner: {
    flexDirection: "row",
    width: "100%",
    height: "15%",
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: colors.secondary,
    fontStyle: "italic",
    fontWeight: "500",
    fontSize: 20,
  },
  CaptionContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
    padding: 10,
  },
  errorText: {
    marginHorizontal: "10%",
    padding: "1%",
    color: colors.grey,
    fontWeight: "400",
    fontSize: 12,
    fontStyle: "italic",
  },

  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    padding: "2%",
    marginHorizontal: "10%",
  },
  backToLoginContainer: {
    marginTop: "2%",
    alignItems: "center",
  },
  loginLink: {
    marginTop: "1%",
    textDecorationLine: "underline",
  },

  logo: {
    width: 60,
    height: 60,
    margin: 10,
  },
  termsAndConditionsContainer: {
    marginHorizontal: "10%",
    marginTop: "5%",
    marginBottom: "5%",
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
  verificationInputField: {
    color: "#000",
  },

  verificationHighlightField: {
    borderColor: "#000",
  },
});

export default AthleteForm;
