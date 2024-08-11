import React, { useState, useContext } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import notificationsApi from "../../api/notifications";
import AuthContext from "../../auth/context";
import colors from "../../config/colors";
import * as yup from "yup";
import { Formik } from "formik";
import contactApi from "../../api/contact";
import contact from "../../api/contact";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import Checkbox from "expo-checkbox";
import { stateConverter } from "../../lib/states";
import therapists from "../../api/therapists";

function TherapistEditServicesModal({ therapist, visible, setVisibility }) {
  if (!visible) return null;

  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showInvalidFieldError, setShowInvalidFieldError] = useState(false);

  const professionsList = [
    { label: "Massage Therapst", value: "Massage Therapist" },
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

  const bioMaxLength = 250;
  const feesAndTaxesPercentage = 0.15;

  const ReviewSchema = yup.object({
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
    summary: yup.string().required().max(250).label("Summary"),
    hourlyRate: yup.number().required().label("Hourly Rate"),
    licenseUrl: yup.string().required().label("License URL"),
    acceptsHouseCalls: yup.boolean().required().label("Accepts House Calls"),
    acceptsInClinic: yup.boolean().required().label("Accepts In Clinic"),
  });

  const handlePrevious = () => {
    setShowInvalidFieldError(false);
    setCurrentStep(currentStep - 1);
  };

  const ServicesStep = (props) => (
    <>
      <View style={styles.propsContainer}>
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
            items={professionsList ? professionsList : [{ label: "Massage Therapst", value: "Massage Therapist" }]}
            placeholder={{
              label: "Choose your Discipline",
              value: null,
            }}
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
        {props.values.hourlyRate > 0 ? <Text style={styles.actualRateText}>You will recieve : ${parseFloat(props.values.hourlyRate * (1-feesAndTaxesPercentage)).toFixed(2)} per hour.</Text> : <></>}
        {props.touched.hourlyRate && props.errors.hourlyRate && (
          <Text style={styles.errorText}>{props.errors.hourlyRate}</Text>
        )}

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={props.values.acceptsInClinic}
            onValueChange={(value) => {
              props.setFieldValue("acceptsInClinic", value);
            }}
            style={styles.checkbox}
          />
          <Text style={styles.label}>
            I have a clinic/facility for clients to visit
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={props.values.acceptsHouseCalls}
            onValueChange={(value) => {
              props.setFieldValue("acceptsHouseCalls", value);
            }}
            style={styles.checkbox}
          />
          <Text style={styles.label}>
            I am open to traveling to clients for our appointments
          </Text>
        </View>
        <Text style={styles.subheaderText}>
          {props.values.acceptsInClinic
            ? "Clinic Address:"
            : "Home / Office Address:"}
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
              <TextInput
                placeholder="State"
                onChangeText={props.handleChange("state")}
                value={props.values.state}
                onBlur={props.handleBlur("state")}
                textContentType="addressState"
              />
            </View>
            {props.touched.state && props.errors.state && (
              <Text style={styles.errorTextCityState}>
                {props.errors.state}
              </Text>
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
          <Text style={styles.errorText}>
            {" "}
            {props.touched.zipcode && props.errors.zipcode}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setVisibility(false)}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentStep(2)}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const LicenseStep = (props) => (
    // license
    <>
      <View style={styles.licenseContainer}>
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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setVisibility(false)}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handlePrevious}
        >
          <Text style={styles.secondaryButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={props.handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
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
          <Formik
            initialValues={{
              addressL1: therapist.street,
              addressL2: therapist.apartment_no,
              city: therapist.city,
              state: therapist.state,
              zipcode: therapist.zipcode,
              profession: therapist.profession,
              services: therapist.services,
              summary: therapist.summary,
              hourlyRate: therapist.hourly_rate,
              licenseUrl: therapist.license_infourl,
              acceptsHouseCalls: therapist.accepts_house_calls ? true : false,
              acceptsInClinic: therapist.accepts_in_clinic ? true : false,
            }}
            validationSchema={ReviewSchema}
            onSubmit={async (values, actions) => {
              values.state = stateConverter(values.state);
              try {
                let response = await therapists.editTherapist(
                  therapist.therapist_id,
                  values
                );
                actions.resetForm();
                setVisibility(false);
              } catch (e) {
                console.warn("Error updating therapist: ", e);
              }
            }}
          >
            {(props) => (
              <>
                {currentStep === 1 && <ServicesStep {...props} />}
                {currentStep === 2 && <LicenseStep {...props} />}
              </>
            )}
          </Formik>
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
    height: 800,
    width: 350,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
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
  licenseContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default TherapistEditServicesModal;
