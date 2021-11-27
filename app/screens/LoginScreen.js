import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import jwtDecode from "jwt-decode";

import authApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import * as yup from "yup";
import "yup-phone";
import Constants from "expo-constants";
import colors from "../config/colors";

const ReviewSchema = yup.object({
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
});

function LoginScreen(props) {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  //const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    const result = await authApi.login(email, password);
    if (!result.ok) {
      //show error message "Invalid email and/or password."
      //use the state variable loginFailed to toggle the visibility of error message
      //return setLoginFailed(true);
      return;
    }

    //setLoginFailed(false);
    const user = jwtDecode(result.data);
    authContext.setUser(user);
    authStorage.storeToken(result.data);
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={ReviewSchema}
        onSubmit={(values, actions) => {
          console.log(values);
          actions.resetForm();
        }}
      >
        {(props) => (
          <View>
            <StatusBar style="dark" />
            <Image
              source={require("../assets/logo_crop.png")}
              style={styles.logo}
            />
            <Text
              style={{
                marginTop: -57,
                alignItems: "center",
                marginLeft: "34%",
                justifyContent: "center",
                fontSize: 14,
                color: "#777777",
              }}
            >
              Recovery on the Go
            </Text>
            <Text
              style={{
                marginTop: 57,
                marginLeft: "31%",
                fontSize: 28,
                color: "#000000",
              }}
            >
              SportStretch
            </Text>
            <View style={[styles.inputContainer, { marginTop: "5%" }]}>
              <TextInput
                style={{
                  flex: 1,
                  flexWrap: "wrap",
                  backgroundColor: "#C4C4C4",
                  color: "white",
                  fontSize: 16,
                }}
                placeholder="Username"
                placeholderTextColor="#FFFFFF"
                onChangeText={props.handleChange("email")}
                value={props.values.email}
                keyboardType="email-address"
                onBlur={props.handleBlur("email")}
                textContentType="emailAddress"
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
                  fontSize: 16,
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

            <Text style={styles.errorText}>
              {" "}
              {props.touched.phone && props.errors.phone}
            </Text>
            <View style={styles.button}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterAthlete")}
                style={styles.reg}
              >
                <Text style={styles.reg}>{"Sign Up as Athlete"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterTherapist")}
                style={styles.reg}
              >
                <Text style={styles.reg}>{"Sign Up As Therapist"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
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
    width: "25%",
    height: "8%",
    margin: 10,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "normal",
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
    marginHorizontal: "10%",
    padding: "1%",
    color: colors.grey,
    fontWeight: "400",
    fontSize: 12,
    fontStyle: "italic",
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
    width: 90,
    height: 90,
    margin: "15%",
    marginLeft: 150,
  },
});

export default LoginScreen;