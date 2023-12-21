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

function EditContactInfoModal({
  user,
  contactInfo,
  visible,
  setVisibility,
  setContactObj,
  // therapistId,
  // athleteId,
  // athleteLocation,
}) {
  if (!visible) return null;

  const navigation = useNavigation();

  const isAthlete = user.role === "athlete" ? true : false;

  let editContactInfoSchema = {};
  const contactObj = {
    authId: user.authorization_id,
    email: "",
    phone: "",
    addressL1: "",
    addressL2: "",
    city: "",
    state: "",
    zipcode: "",
  };

  const initAthleteForm = () => {
    editContactInfoSchema = yup.object({
      email: yup.string().required("Email is required").label("Email"),
      phone: yup
        .string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required("Phone Number is required")
        .label("Phone"),
    });
  };

  const initAdminTherapistForm = () => {
    editContactInfoSchema = yup.object({
      email: yup.string().required("Email is required").label("Email"),
      phone: yup
        .string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required("Phone Number is required")
        .label("Phone"),
      addressL1: yup.string().required().label("Address Line 1"),
      addressL2: yup.string().label("Address Line 2"),
      city: yup.string().required().label("City"),
      state: yup.string().required().label("State"),
      zipcode: yup.string().required().label("Zip Code"),
    });
  };

  if (isAthlete) {
    initAthleteForm();
  } else {
    initAdminTherapistForm();
  }

  const handleSubmit = async (values) => {
    // return if schema has errors
    if (!editContactInfoSchema.isValidSync(values)) {
      return false;
    }
    try {
      contactObj.email = values.email;
      contactObj.phone = values.phone;
      contactObj.addressL1 = values.addressL1 || "";
      contactObj.addressL2 = values.addressL2 || "";
      contactObj.city = values.city || "";
      contactObj.state = values.state || "";
      contactObj.zipcode = values.zipcode || "";
      const res = await contactApi.editContact(contactObj);
      setContactObj({
        email: contactObj.email,
        mobile: contactObj.phone,
        street: contactObj.addressL1,
        apartment_no: contactObj.addressL2,
        city: contactObj.city,
        state: contactObj.state,
        zipcode: contactObj.zipcode,
      });
      // ToDo: Implement snackbar
      return true;
    } catch (error) {
      Alert.alert("An error occured. Please try again later.");
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
      <BlurView intensity={50} style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Contact Info</Text>
          <Formik
            initialValues={
              isAthlete
                ? {
                    email: contactInfo.email,
                    phone: contactInfo.mobile,
                  }
                : {
                    email: contactInfo.email,
                    phone: contactInfo.mobile,
                    addressL1: contactInfo.street,
                    addressL2: contactInfo.apartment_no,
                    city: contactInfo.city,
                    state: contactInfo.state,
                    zipcode: contactInfo.zipcode,
                  }
            }
            validationSchema={editContactInfoSchema}
            onSubmit={(values, actions) => {
              handleSubmit(values) ? setVisibility(false) : actions.resetForm();
            }}
          >
            {(props) => (
              <>
                <ScrollView
                  style={styles.scrollView}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.formContainer}>
                    <View style={styles.propContainer}>
                      <Text style={styles.labelText}>Email:</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={{ flex: 1, flexWrap: "wrap" }}
                          placeholder="Email"
                          onChangeText={props.handleChange("email")}
                          value={props.values.email}
                          onBlur={props.handleBlur("email")}
                          textContentType="emailAddress"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.labelText}>Phone number:</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={{ flex: 1, flexWrap: "wrap" }}
                          placeholder="Phone"
                          onChangeText={props.handleChange("phone")}
                          value={props.values.phone}
                          onBlur={props.handleBlur("phone")}
                          textContentType="telephoneNumber"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {!isAthlete && (
                      <>
                        <View style={styles.propContainer}>
                          <Text style={styles.labelText}>Address:</Text>
                          <View style={styles.inputContainer}>
                            <TextInput
                              style={{ flex: 1, flexWrap: "wrap" }}
                              placeholder="Address"
                              onChangeText={props.handleChange("addressL1")}
                              value={props.values.addressL1}
                              onBlur={props.handleBlur("addressL1")}
                              textContentType="streetAddressLine1"
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                        <View style={styles.propContainer}>
                          <Text style={styles.labelText}>Address Line 2:</Text>
                          <View style={styles.inputContainer}>
                            <TextInput
                              style={{ flex: 1, flexWrap: "wrap" }}
                              placeholder="Address Line 2"
                              onChangeText={props.handleChange("addressL2")}
                              value={props.values.addressL2}
                              onBlur={props.handleBlur("addressL2")}
                              textContentType="streetAddressLine2"
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                        <View style={styles.propContainer}>
                          <Text style={styles.labelText}>City:</Text>
                          <View style={styles.inputContainer}>
                            <TextInput
                              style={{ flex: 1, flexWrap: "wrap" }}
                              placeholder="City"
                              onChangeText={props.handleChange("city")}
                              value={props.values.city}
                              onBlur={props.handleBlur("city")}
                              textContentType="addressCity"
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                        <View style={styles.propContainer}>
                          <Text style={styles.labelText}>State:</Text>
                          <View style={styles.inputContainer}>
                            <TextInput
                              style={{ flex: 1, flexWrap: "wrap" }}
                              placeholder="State"
                              onChangeText={props.handleChange("state")}
                              value={props.values.state}
                              onBlur={props.handleBlur("state")}
                              textContentType="addressState"
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                        <View style={styles.propContainer}>
                          <Text style={styles.labelText}>Zip Code:</Text>
                          <View style={styles.inputContainer}>
                            <TextInput
                              style={{ flex: 1, flexWrap: "wrap" }}
                              placeholder="Zip Code"
                              onChangeText={props.handleChange("zipcode")}
                              value={props.values.zipcode}
                              onBlur={props.handleBlur("zipcode")}
                              textContentType="postalCode"
                              autoCapitalize="none"
                            />
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setVisibility(false)}
                  >
                    <View>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={props.handleSubmit}
                  >
                    <View>
                      <Text style={styles.buttonText}>Submit</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
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
    height: 300,
    width: 300,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  modalContent: {
    margin: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  propsContainer: {
    flex: 1,
    // padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelColumn: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputColumn: {
    flex: 2,
    justifyContent: "flex-start",
  },
  labelText: {
    marginBottom: 4,
  },
  input: {
    marginBottom: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    borderColor: "#D3D3D3",
    width: 270,
    backgroundColor: "#F6F6F6",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column-reverse",
    width: "100%",
  },
  hideModal: {
    textDecorationLine: "underline",
    backgroundColor: "#FEFEFE",
    color: "#3F3F3F",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 12,
  },
  formContainer: {
    flex: 1,
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  propContainer: {
    marginBottom: 16,
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    padding: "2%",
    width: "100%",
  },
  emailProp: {
    gridRow: 1,
  },
  errorText: {
    color: "red",
    fontWeight: "400",
    fontSize: 10,
    position: "absolute",
    bottom: -16,
  },
});

export default EditContactInfoModal;
