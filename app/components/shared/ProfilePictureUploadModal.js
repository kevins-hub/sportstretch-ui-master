import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import colors from "../../config/colors";
import AthleteAppointmentDetails from "../athlete/AthleteAppointmentDetails";
import AuthContext from "../../auth/context";
import { Formik } from "formik";
import report from "../../api/report";
import ProfilePictureUpload from "./ProfilePictureUpload";
import upload from "../../api/upload";
import ProgressIndicator from "../athlete/ProgressIndicator";
import DoneIndicator from "../athlete/DoneIndicator";

function ProfilePictureUploadModal({
  user,
  setVisibility,
  visible,
  currentProfilePictureUrl,
}) {
  if (!visible) return null;
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  // const { user, setUser } = useContext(AuthContext);

  const userAuthId = user.authorization_id;

  const handleSubmit = async () => {
    if (!image) return;
    const response = await fetch(image);
    const blob = await response.blob();
    const file = new File([blob], `file.jpg`, { type: blob.type });
    try {
      setUploadProgress(true);
      const result = await upload.uploadProfilePicture(userAuthId, image, file);
      setUploadProgress(false);

      if (result.status === 201) {
        setUploadDone(true);
        setTimeout(() => {
          setUploadDone(false)
        }, 2000);
        setVisibility(false);
      } else {
        Alert.alert("Error uploading profile picture.");
      }
    } catch (err) {
      Alert.alert("Error uploading profile picture.");
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
          <ProgressIndicator visible={uploadProgress} />
          <DoneIndicator visible={uploadDone} />
          {!uploadProgress && !uploadDone && (
            <>
              <View style={styles.modalContent}>
                <ProfilePictureUpload
                  image={image}
                  setImage={setImage}
                  currentProfilePictureUrl={currentProfilePictureUrl}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setVisibility(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                {image && (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.primaryButtonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
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
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
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
  textInput: {
    marginTop: 4,
    marginBottom: 2,
    borderWidth: 2,
    padding: 8,
    borderRadius: 20,
    borderColor: "#D3D3D3",
    width: "100%",
    backgroundColor: "#F6F6F6",
    height: "50%",
  },
});

export default ProfilePictureUploadModal;
