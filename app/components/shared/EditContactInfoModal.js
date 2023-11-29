import React, { useState, useContext } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import notificationsApi from "../../api/notifications";
import AuthContext from '../../auth/context';
import colors from '../../config/colors';

function EditContactInfoModal({
  visible,
  setVisibility,
  // therapistId,
  // athleteId,
  // athleteLocation,
}) {
  if (!visible) return null;

  const navigation = useNavigation();

  // const [text, onChangeText] = useState(athleteLocation);
  // const [bookingProgress, setBookingProgress] = useState(false);
  // const [bookingDone, setBookingDone] = useState(false);
  // const { user, setUser } = useContext(AuthContext);

  // const onConfirmPress = async () => {
  //   try {
  //       //showProgress
  //       setBookingProgress(true);
  //       //format text and call API
  //       await bookingsApi.bookATherapist(athleteId, athleteLocation, therapistId);
  //       //hideProgress & showDone
  //       setBookingProgress(false);
  //       setBookingDone(true);
  //       //navigate
  //       setTimeout(function () {
  //         setBookingDone(false);
  //         setVisibility(false);
  //         navigation.navigate("UpcomingBooking");
  //       }, 2000);
  //       notificationsApi.notifyTherapist(therapistId, user.userObj.first_name);        
  //   } catch (error) {
  //       console.log('Error on confirm booking', error);
  //   }
  // };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <BlurView intensity={50} style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Edit Contact Info Modal</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setVisibility(false)}>
                <View>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setVisibility(false)}>
              <View>
                  <Text style={styles.buttonText}>Submit</Text>
              </View>
            </TouchableOpacity>
        </View>
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
  input: {
    marginBottom: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    borderColor: '#D3D3D3',
    width: 270,
    backgroundColor: '#F6F6F6'
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column-reverse",
    width: '100%',
  },
  hideModal: {
    textDecorationLine: "underline",
    backgroundColor: "#FEFEFE",
    color: "#3F3F3F",
  },
  button : {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 30,
    margin: 5,
  },
  buttonText: {
      color: colors.secondary,
      fontSize: 12
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 30,
    margin: 5,
  },
  cancelButtonText: {
      color: colors.primary,
      fontSize: 12
  }
});

export default EditContactInfoModal;
