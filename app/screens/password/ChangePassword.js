import React from "react";
import { Formik } from "formik";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as yup from "yup";
import "yup-phone";
import Constants from "expo-constants";
import colors from "../../config/colors";
import passwordApi from "../../api/password";
import { useNavigation } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
import authStorage from "../../auth/storage";

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required().min(6).label("Old Password"),
  newPassword: yup.string().required().min(6).label("New Password"),
  confirmPassword: yup
    .string()
    .when("newPassword", {
      // should match with password
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
    })
    .required()
    .min(6)
    .label("Confirm Password"),
});

function ChangePasswordForm(props) {
  const navigation = useNavigation();
  let authId = "";

  const getUser = async () => {
    return await authStorage.getUser();
  };

  getUser().then((user) => {
    authId = user.authorization_id;
  });

  const handleSubmit = async (values) => {
    try {
      const changeResponse = await passwordApi.changePassword(
        values.newPassword,
        values.oldPassword,
        authId
      );
      if (changeResponse.status === 200) {
        Alert.alert("Password changed successfully.");
        handleBackToLogin();
      } else {
        Alert.alert(`Error:${authResponse.data}, Please try again.`);
      }
    } catch (error) {
      Alert.alert("An error occured. Please try again later.");
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/logo_crop.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Recovery On The Go</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={(values, actions) => {
            handleSubmit(values);
            actions.resetForm();
          }}
        >
          {(props) => (
            <View>
              <Text style={styles.labelText}>Old Password:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, flexWrap: "wrap" }}
                  placeholder="Old Password"
                  onChangeText={props.handleChange("oldPassword")}
                  value={props.values.oldPassword}
                  keyboardType="visible-password"
                  onBlur={props.handleBlur("oldPassword")}
                  textContentType="oldPassword"
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>
              <Text style={styles.errorText}>
                {" "}
                {props.touched.newPassword && props.errors.newPassword}
              </Text>
              <Text style={styles.secondLabelText}>New Password:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, flexWrap: "wrap" }}
                  placeholder="New Password"
                  onChangeText={props.handleChange("newPassword")}
                  value={props.values.newPassword}
                  keyboardType="visible-password"
                  onBlur={props.handleBlur("newPassword")}
                  textContentType="newPassword"
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>
              <Text style={styles.errorText}>
                {" "}
                {props.touched.newPassword && props.errors.newPassword}
              </Text>
              <Text style={styles.secondLabelText}>Confirm Password:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, flexWrap: "wrap" }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholder="Confirm Password"
                  onChangeText={props.handleChange("confirmPassword")}
                  value={props.values.confirmPassword}
                  keyboardType="visible-password"
                  onBlur={props.handleBlur("confirmPassword")}
                  textContentType="confirmPassword"
                  secureTextEntry={true}
                />
              </View>
              <Text style={styles.errorText}>
                {" "}
                {props.touched.confirmPassword && props.errors.confirmPassword}
              </Text>
              {/* <Text style={styles.errorText}> {props.touched.phone && props.errors.phone}</Text> */}
              <TouchableOpacity onPress={props.handleSubmit}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 16,
    color: colors.dullblack,
    marginTop: "20%",
    marginBottom: "5%",
    marginLeft: "10%",
  },
  secondLabelText: {
    fontSize: 16,
    color: colors.dullblack,
    marginTop: "10%",
    marginBottom: "5%",
    marginLeft: "10%",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 15,
    width: "30%",
    margin: 30,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  headerContainer: {
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
});

export default ChangePasswordForm;
