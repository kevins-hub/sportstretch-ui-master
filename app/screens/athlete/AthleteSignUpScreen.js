import React, { useState } from "react";
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
import registerApi from "../../api/register";
import { useNavigation } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
import auth from "../../api/auth";

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
  phone: yup.string().phone().required().max(10).label("Phone"),
});

function AthleteForm(props) {
  const navigation = useNavigation();
  const [showEmailExistsError, setShowEmailExistsError] = useState(false);

  const handleSubmit = async (values, actions) => {
    const emailAvailable = await checkEmailAvailable(values.email.toLowerCase());
    if (!emailAvailable) {
      setShowEmailExistsError(true);
      return;
    }
    try {
      const athlete = {
        email: values.email.toLowerCase(),
        firstName: values.fname,
        lastName: values.lname,
        password: values.password,
        confirmPassword: values.confirmPassword,
        mobile: values.phone,
      };
      let register_response = await registerApi.registerAthlete(athlete);
      if (register_response.status === 200) {
        alert("Registration successful.");
        actions.resetForm();
        navigation.navigate("Login");
      } else {
        Alert.alert(`An error occurred during registration. Please try again.`);
      }
    } catch (error) {
      Alert.alert("An error occurred during registration. Please try again.");
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
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerConatiner}>
        <Image
          source={require("../../assets/logo_crop.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Recovery On The Go</Text>
      </View>

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
          onSubmit={ async (values, actions) => {
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
                  onBlur={props.handleBlur("password")}
                  textContentType="newPassword"
                  autoCapitalize="none"
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
              </Text>
              <TouchableOpacity onPress={props.handleSubmit}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
});

export default AthleteForm;
