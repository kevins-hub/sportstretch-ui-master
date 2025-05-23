import React from "react";
import { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Switch,
  Image,
  Alert,
  TouchableOpacity,
  Linking
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { Rating } from "react-native-ratings";
import therapistsApi from "../../api/therapists";
import { handleError } from "../../lib/error";

export default function AdminTherapistCard({
  therapist_id,
  FirstName,
  LastName,
  Mobile,
  City,
  State,
  Enabled,
  AverageRating,
  Email,
  License,
  Services,
  Bio,
}) {
  var rating = parseFloat(AverageRating).toFixed(1);
  const [isEnabled, setIsEnabled] = useState(Enabled);
  const setEnabledStatus = () => {
    return isEnabled ? (
      <View></View>
    ) : (
      <View style={styles.disabledView}>
        <Text style={styles.disabledText}>disabled</Text>
      </View>
    );
  };

  const [isAvailable, setIsAvailable] = useState(setEnabledStatus);
  const toggleSwitch = async () => {
    let val = Number(!isEnabled);
    let response = await therapistsApi.setToggle(therapist_id, {
      enabled: val,
    });
    if (handleError(response)) return;
    let insert = Boolean(response.data.enabled);
    setIsEnabled((previousState) => !previousState);
    !isEnabled == false
      ? Alert.alert("Recovery Specialist " + FirstName + " " + LastName + " is disabled")
      : Alert.alert("Recovery Specialist " + FirstName + " " + LastName + " is enabled");
  };

  const openURL = (url) => {
    url = formatURL(url);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`Don't know how to open this URL: ${url}`);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // format url to add http if not present
  const formatURL = (url) => {
    if (!url.includes("http")) {
      return "http://" + url;
    }
    return url;
  };

  useEffect(() => {
    setIsAvailable(setEnabledStatus);
  }, [isEnabled]);

  return (
    <Card
      style={{
        width: "100%",
        flex: 1,
        flexDirection: "row",
        padding: 15,
        backgroundColor: "#FFFFFF",
        color: "#FFFEFE",
        alignSelf: "center",
        margin: 5,
        borderRadius: 15,
        elevation: 4,
        shadowColor: "#373737",
      }}
    >
      {isAvailable}
      <View style={{ flex: 2, flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 39,
              fontWeight: "300",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFC107",
              fontSize: 30,
              paddingTop: "5%",
            }}
          >
            {rating}
          </Text>
          <Rating
            style={{ flex: 1, marginLeft: 0, marginTop: 0, paddingTop: "2%" }}
            imageSize={14}
            readonly
            startingValue={rating}
          />
        </View>

        <View style={{ flex: 1, paddingLeft: "10%", paddingTop: "1%" }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: "200", color: "#3F3F3F" }}>
              {`${FirstName} ${LastName} (id:${therapist_id})`}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 17, fontWeight: "200", color: "#5F5F5F" }}>
              Email: {Email}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 17, fontWeight: "200", color: "#5F5F5F" }}>
              Phone Number: {Mobile}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 17, fontWeight: "300", color: "#777777" }}>
              Location: {City + ", " + State}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 17, fontWeight: "200", color: "#5F5F5F" }}>
              Bio: {Bio}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 17, fontWeight: "200", color: "#5F5F5F" }}>
              Services: {Services}
            </Text>
          </View>
          
          <View>
            {/* clickable link to license */}
            <TouchableOpacity onPress={() => openURL(License)}>
              <Text style={{ fontSize: 17, fontWeight: "300", color: "#777777" }}>
                View License Info
              </Text>
            </TouchableOpacity>


          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Switch
              trackColor={{ false: "#C4C4C4", true: "black" }}
              thumbColor="white"
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  disabledView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  availabilityContainer: {
    backgroundColor: "white",
    // width : 390,
    // height : 50,
    flexDirection: "row",
    height: 50,
    marginLeft: 5,
  },
  availabilityToggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
  },
  availabilityToggle: {
    marginLeft: 10,
    marginRight: 20,
  },
  locationImage: {
    width: 50,
    height: 50,
  },
  locationText: {
    fontWeight: "300",
    fontSize: 24,
  },
  toggleText: {
    color: "#959595",
    fontWeight: "300",
    fontSize: 16,
  },

  disabledText: {
    color: "#5F5F5F",
    fontWeight: "100",
    fontSize: 16,
  },
  textFont: {
    fontWeight: "400",
    fontSize: 14,
  },
});
