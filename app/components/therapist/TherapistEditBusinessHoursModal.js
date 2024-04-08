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
import TherapistBusinessHours from "./TherapistBusinessHours";
import therapists from "../../api/therapists";
import authApi from "../../api/auth";
import jwtDecode from "jwt-decode";
import authStorage from "../../auth/storage";
import App from "../../../App";
import { ref } from "yup";

function TherapistEditBusinessHoursModal({
  user,
  visible,
  setVisibility,
  businessHours,
}) {
  if (!visible) return null;

  const authContext = useContext(AuthContext);

  const therapistId = user.userObj.therapist_id;
  const authId = user.authorization_id;

  const navigation = useNavigation();

  // initialize editedBusinessHours as copy of businessHours
  const [editedBusinessHours, setEditedBusinessHours] = useState({
    ...businessHours,
  });

  const handleSubmit = async () => {
    try {
      await therapists.editTherapistHours(therapistId, editedBusinessHours);
      setVisibility(false);
    } catch (e) {
      console.warn("Error editing business hours: ", e);
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
          <TherapistBusinessHours
            businessHours={editedBusinessHours}
            setBusinessHours={setEditedBusinessHours}
          ></TherapistBusinessHours>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setVisibility(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
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
    height: 700,
    width: 350,
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

export default TherapistEditBusinessHoursModal;
