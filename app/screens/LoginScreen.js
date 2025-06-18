import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
import { ScrollView } from "react-native-gesture-handler";
import authApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import { Formik } from "formik";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import * as yup from "yup";
import "yup-phone";
import Constants from "expo-constants";
import colors from "../config/colors";
import { handleLogin } from "../api/revenuecatService";

const ReviewSchema = yup.object({
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
});

function LoginScreen(props) {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async ({ email, password }) => {
    try {
      const result = await authApi.login(email.toLowerCase(), password);
      if (!result.ok)
        return setErrorText(
          result.data === "Invalid email or password."
            ? "Invalid email and/or password."
            : result.data
        );
      setErrorText("");
      console.warn("result.data = ", result.data);
      const user = jwtDecode(result.data);
      authContext.setUser(user);
      console.warn("user at log in = ", user);
      console.warn("user.userObj = ", user.userObj);
      authStorage.storeToken(result.data);
      if (user.role === "therapist" && user.userObj.rc_customer_id) {
        // If the user is a therapist, handle RevenueCat subscription
        await handleLogin(user.userObj.rc_customer_id);
      }
    } catch (error) {
      setErrorText("Error when logging in. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      // change padding to height for android devices  platform === ios ? padding : height
      behavior="padding"
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={ReviewSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <View>
                <Image
                  source={require("../assets/logo_crop.png")}
                  style={styles.logo}
                />
                <Text
                  style={{
                    marginTop: "2%",
                    alignSelf: "center",
                    fontSize: 14,
                    color: "#777777",
                  }}
                >
                  Recovery on the Go
                </Text>
                <Text
                  style={{
                    marginTop: 57,
                    alignSelf: "center",
                    fontSize: 28,
                    color: "#000000",
                  }}
                >
                  SportStretch
                </Text>
                <Text
                  style={{
                    color: "#f60a0e",
                    alignSelf: "center",
                    marginTop: "5%",
                  }}
                >
                  {errorText}
                </Text>

                <View style={[styles.inputContainer, { marginTop: "1%" }]}>
                  <TextInput
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      backgroundColor: "#C4C4C4",
                      color: "white",
                      fontSize: 18,
                    }}
                    placeholder="Email"
                    placeholderTextColor="#FFFFFF"
                    onChangeText={props.handleChange("email")}
                    value={props.values.email}
                    keyboardType="email-address"
                    onBlur={props.handleBlur("email")}
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    autoCorrect={false}
                    blurOnSubmit={true}
                  />
                </View>
                <Text style={styles.errorText}>
                  {" "}
                  {props.touched.email && props.errors.email}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      color: "white",
                      fontSize: 18,
                    }}
                    placeholder="Password"
                    placeholderTextColor="#FFFFFF"
                    onChangeText={props.handleChange("password")}
                    value={props.values.password}
                    secureTextEntry={true}
                    returnKeyType="go"
                    autoCapitalize="none"
                    blurOnSubmit={true}
                  />
                </View>
                <Text style={styles.errorText}>
                  {" "}
                  {props.touched.password && props.errors.password}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={props.handleSubmit}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                    style={styles.forgotPasswordLink}
                  >
                    <Text style={styles.forgotPasswordLink}>
                      {"Forgot Password?"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("RegisterAthlete")}
                    style={styles.reg}
                  >
                    <Text style={styles.reg}>{"Athlete Sign Up"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("RegisterTherapist")}
                    style={styles.reg}
                  >
                    <Text style={styles.reg}>
                      {"Recovery Specialist Sign Up"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    alignSelf: "center",
    width: "25%",
    height: 50,
    marginTop: "1%",
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "center",
    paddingTop: 10,
  },
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "#FFFEFE",
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
    marginLeft: "20%",
    padding: "2%",
    color: "#C6C6C6",
    fontWeight: "400",
    fontSize: 12,
  },

  inputContainer: {
    flexDirection: "row",
    borderWidth: 0,
    borderRadius: 5,
    padding: "2%",
    marginHorizontal: "10%",
    backgroundColor: "#C4C4C4",
    width: "60%",
    marginLeft: "20%",
    color: "#FFFFFF",
  },

  logo: {
    width: 115,
    height: 115,
    alignSelf: "center",
    marginTop: "20%",
  },
  reg: {
    flex: 1,
    textDecorationLine: "underline",
    backgroundColor: "#FEFEFE",
    color: "#3F3F3F",
    fontSize: 18,
    padding: "2.5%",
    marginTop: "2.5%",
    marginLeft: "0%",
    textAlign: "center",
  },
  forgotPasswordLink: {
    textDecorationLine: "underline",
    backgroundColor: "#FEFEFE",
    color: "#3F3F3F",
    fontSize: 14,
    padding: "2.5%",
  },
});

export default LoginScreen;
