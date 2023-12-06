import React from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { Card } from "react-native-paper";
import colors from "../../config/colors";
import ApproveButton from "../../components/admin/ApproveButton";
import DenyButton from "../../components/admin/DenyButton";
import therapistsApi from "../../api/therapists";

export default function AdminApprovalsCard({
  TherapistId,
  FirstName,
  LastName,
  Mobile,
  Email,
}) {
  async function approveTherapist(id) {
    console.log("approve called in approve");
    let approve = await therapistsApi.approveTherapist(id);
    console.log(approve);
  }

  async function denyTherapist(id) {
    let deny = await therapistsApi.denyTherapist(id);
    console.log(deny);
  }

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
            {Email}
          </Text>
        </View>

        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "normal", color: "#5F5F5F" }}
          >
            {Mobile}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ApproveButton
            onPress={() => {
              approveTherapist(TherapistId);
              Alert.alert(
                "Therapist " + FirstName + " " + LastName + " is approved!"
              );
            }}
            title={"Approve"}
          ></ApproveButton>

          <DenyButton
            onPress={() => {
              denyTherapist(TherapistId);
              Alert.alert(
                FirstName + " " + LastName + "'s therapist request is denied"
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
