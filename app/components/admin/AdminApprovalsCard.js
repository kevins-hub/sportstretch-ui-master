import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import colors from "../../config/colors";
import ApproveButton from "../../components/admin/ApproveButton";
import DenyButton from "../../components/admin/DenyButton";
import therapistsApi from "../../api/therapists";
import { handleError } from "../../lib/error";

export default function AdminApprovalsCard({
  TherapistId,
  FirstName,
  LastName,
  Mobile,
  Email,
  loadAllRequests,
  License,
  Address,
  Profession,
  Services,
  Bio
}) {
  async function approveTherapist(id) {
    let approve = await therapistsApi.approveTherapist(id);
    if (handleError(approve)) return;
    loadAllRequests();
    // console.log(approve);
  }

  async function denyTherapist(id) {
    let deny = await therapistsApi.denyTherapist(id);
    if (handleError(deny)) return;
    loadAllRequests();
    // console.log(deny);
  }

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
      .catch((err) => console.error("An error occurred", err));
  };

  // format url to add http if not present
  const formatURL = (url) => {
    if (!url.includes("http")) {
      return "http://" + url;
    }
    return url;
  };

  return (
    <Card style={styles.card}>
      <View style={{ flex: 1, paddingLeft: "1%" }}>
        <View>
          <Text
            style={{ fontSize: 28, fontWeight: "200", color: colors.dullblack }}
          >
            {FirstName + " " + LastName}
          </Text>
        </View>

        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            Email: {Email}
          </Text>
        </View>

        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            Phone Number: {Mobile}
          </Text>
        </View>
        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            Profession: {Profession}
          </Text>
        </View>
        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            Bio: {Bio}
          </Text>
        </View>
        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            Services: {Services}
          </Text>
        </View>
        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            Address: {Address}
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
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ApproveButton
            onPress={() => {
              approveTherapist(TherapistId);
              Alert.alert(
                "Recovery Specialist " + FirstName + " " + LastName + " is approved!"
              );
            }}
            title={"Approve"}
          ></ApproveButton>

          <DenyButton
            onPress={() => {
              denyTherapist(TherapistId);
              Alert.alert(
                FirstName + " " + LastName + "'s recovery specialist request is denied"
              );
            }}
            title={"Deny"}
          ></DenyButton>
        </View>
      </View>
    </Card>
  );
}
const styles = StyleSheet.create({
  card: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    margin: 8,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#373737",
  },
});
