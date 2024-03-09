import React, { useState } from "react";
import { Formik } from "formik";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
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
import { stateConverter } from "../../lib/states";
import RNPickerSelect from "react-native-picker-select";
import Checkbox from "expo-checkbox";

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
  phone: yup.string().phone().required().label("Phone"),
  addressL1: yup.string().required().label("Street Address"),
  addressL2: yup.string().label("Address Line 2"),
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
  summary: yup.string().required().max(150).label("Summary"),
  hourlyRate: yup.number().required().label("Hourly Rate"),
  licenseUrl: yup.string().required().label("License URL"),
});

function TherapistForm(props) {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showInvalidFieldError, setShowInvalidFieldError] = useState(false);

  const [enableHouseCalls, setEnableHouseCalls] = useState(false);
  const [enableInClinic, setEnableInClinic] = useState(false);

  const register_therapist = async (values) => {
    try {
      let register_response = await registerApi.registerTherapist(values);
      if (register_response.status === 200) {
        navigation.navigate("TherapistRegistrationPending");
      } else {
        Alert.alert(
          `Error while registration: ${register_response.data} Please try again.`
        );
      }
    } catch (error) {
      Alert.alert("An error occurred during registration. Please try again.");
    }
  };

  // ToDo: fill out with supported professions
  const professionsList = [
    { label: "Physical Therapist", value: "Physical Therapist" },
    { label: "Occupational Therapist", value: "Occupational Therapist" },
    { label: "Speech Therapist", value: "Speech Therapist" },
  ];

  const handleNext = (values) => {
    if (currentStep === 1) {
      Promise.all([
        ReviewSchema.validateAt("fname", values),
        ReviewSchema.validateAt("lname", values),
        ReviewSchema.validateAt("email", values),
        ReviewSchema.validateAt("phone", values),
      ])
        .then(() => {
          setShowInvalidFieldError(false);
          setCurrentStep(currentStep + 1);
        })
        .catch((err) => setShowInvalidFieldError(true));
    } else if (currentStep === 2) {
      Promise.all([
        ReviewSchema.validateAt("addressL1", values),
        ReviewSchema.validateAt("city", values),
        ReviewSchema.validateAt("state", values),
        ReviewSchema.validateAt("zipcode", values),
      ])
        .then(() => {
          setShowInvalidFieldError(false);
          setCurrentStep(currentStep + 1);
        })
        .catch((err) => setShowInvalidFieldError(true));
    } else if (currentStep === 3) {
      Promise.all([
        ReviewSchema.validateAt("licenseUrl", values),
      ])
        .then(() => {
          setShowInvalidFieldError(false);
          setCurrentStep(currentStep + 1);
        })
        .catch((err) => setShowInvalidFieldError(true));
    }
    return;
  };

  const handlePrevious = () => {
    setShowInvalidFieldError(false);
    setCurrentStep(currentStep - 1);
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
          items={professionsList}
          placeholder={{ label: "Choose your Discipline", value: null }}
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
          placeholder="Services Offered"
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
          style={{ flex: 1, flexWrap: "wrap" }}
          placeholder="Summary / Why should athletes choose you?"
          onChangeText={props.handleChange("summary")}
          value={props.values.summary}
          onBlur={props.handleBlur("summary")}
          multiline={true}
        />
      </View>
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
      <Text style={styles.subheaderText}>{enableInClinic ? "Clinic Address:" : "Home / Office Address:"}</Text>
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
            <TextInput
              placeholder="State"
              onChangeText={props.handleChange("state")}
              value={props.values.state}
              onBlur={props.handleBlur("state")}
              textContentType="addressState"
            />
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
          textContentType="licenseUrl"
          autoCapitalize="none"
        />
      </View>
      {
        props.touched.licenseUrl && props.errors.licenseUrl && (
          <Text style={styles.errorText}>
            {props.errors.licenseUrl}
          </Text>
        )
      }
      <Text style={styles.subheaderText}>Please provide a link to your active license. This information is essential in assuring the safety and legitimacy of services to your clients.</Text>
    </>
  );


  const PasswordStep = (props) => (
    // password
    <>
      <Text style={styles.subheaderText}>Please create a password for your account that is at least 8 characters in length.</Text>
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
        <Text style={styles.accountText}>Tell us about your business</Text>
      )}
      {currentStep === 3 && (
        <Text style={styles.accountText}>Please provide your license information</Text>
      )}
      {currentStep === 4 && <Text style={styles.accountText}>Last Step!</Text>}
      {/* <Text style={styles.accountText}>Create your profile</Text> */}
      <Formik
        initialValues={{
          fname: "",
          lname: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
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
        }}
        validationSchema={ReviewSchema}
        onSubmit={(values, actions) => {
          values.state = stateConverter(values.state);
          register_therapist(values);
          actions.resetForm();
        }}
      >
        {(props) => (
          <View style={styles.propsContainer}>
            {currentStep === 1 && <ContactStep {...props} />}
            {currentStep === 2 && <ServicesStep {...props} />}
            {currentStep === 3 && <LicenseStep {...props} />}
            {currentStep === 4 && <PasswordStep {...props} />}
            <View style={styles.buttonContainer}>
              {showInvalidFieldError && (
                <Text style={styles.errorText}>
                  Please fix errors in fields before continuing.
                </Text>
              )}
              {currentStep > 1 && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handlePrevious}
                >
                  <Text style={styles.secondaryButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              {currentStep < 4 && (
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
              {currentStep === 4 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={props.handleSubmit}
                >
                  <Text style={styles.buttonText}>Finish Sign Up</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* {currentStep === 3 && (
              <TouchableOpacity
                style={styles.button}
                onPress={props.handleSubmit}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )} */}

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
  },
});

export default TherapistForm;
