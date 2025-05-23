// confirmation modal to delete account

import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import AuthContext from "../../auth/context";
import { TextInput } from "react-native-gesture-handler";
import * as yup from "yup";
import { Formik } from "formik";
import registerApi from "../../api/register";
import authStorage from "../../auth/storage";

function DeleteAccountModal({ visible, setVisibility, authId }) {
  if (!visible) return null;

  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);
  const onDeletePress = async (values) => {
    // set variable deleteInputText to lower case of values.delete
    const deleteInputText = values.delete.toLowerCase();

    if (deleteInputText !== "delete") {
      return;
    }

    try {
      await registerApi.deleteAccount(authId);
      setUser(null);
      await authStorage.removeToken();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error deleting account", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <Formik
          initialValues={{ delete: "" }}
          onSubmit={(values, actions) => {
            onDeletePress(values);
          }}
        >
          {(props) => (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </Text>
              <Text style={styles.modalText}>Type 'delete' to confirm</Text>
              <TextInput
                style={styles.input}
                value={props.values.delete}
                onChangeText={props.handleChange("delete")}
                onBlur={props.handleBlur("delete")}
                placeholder="Type here"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setVisibility(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  cancelButton: {
    backgroundColor: colors.light,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
  },
});

export default DeleteAccountModal;
