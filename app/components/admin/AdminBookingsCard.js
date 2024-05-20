import React from "react";
import { Text, View } from "react-native";
import { Card } from "react-native-paper";

export default function AdminBookingsCard({
  BookingDay,
  BookingMonth,
  Afname,
  Alname,
  Tfname,
  Tlname,
  BookingsId,
  athlete_id,
  therapist_id,
}) {
  return (
    <Card
      style={{
        width: "100%",
        flex: 1,
        flexDirection: "row",
        padding: 7,
        backgroundColor: "#FFFFFF",
        color: "#FFFEFE",
        alignSelf: "center",
        margin: 7,
        borderRadius: 15,
        elevation: 4,
        shadowColor: "#373737",
      }}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
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
              fontSize: 28,
              fontWeight: "200",
              justifyContent: "center",
              alignItems: "center",
              color: "#000000",
              fontSize: 26,
              paddingTop: "8%",
              marginLeft: "5%",
            }}
          >
            {BookingMonth}
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 24,
              fontWeight: "100",
              justifyContent: "center",
              alignItems: "center",
              color: "#959595",
              fontSize: 28,
              paddingTop: "6%",
              marginLeft: "5%",
              marginTop: -15,
              paddingBottom: "5%",
            }}
          >
            {BookingDay}
          </Text>
        </View>
        <View
          style={{
            width: "1%",
            height: "95%",
            justifyContent: "center",
            backgroundColor: "#E5E5E5",
            marginLeft: "5%",
          }}
        />
        <View style={{ flex: 1, paddingLeft: "3%", paddingTop: "6%" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "300",
              color: "#5F5F5F",
              paddingBottom: "3%",
            }}
          >
            Athlete
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "300",
              color: "#5F5F5F",
              paddingBottom: "3%",
            }}
          >
            Specialist
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "300",
              color: "#5F5F5F",
              paddingBottom: "3%",
            }}
          >
            BookingID
          </Text>
        </View>
        <View
          style={{
            flex: 1.3,
            paddingTop: "6%",
            marginLeft: "-5%",
            paddingLeft: 0,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "200",
              color: "#383838",
              marginRight: "5%",
              paddingBottom: "3%",
            }}
          >
            {`${Afname} ${Alname} (id:${athlete_id})`}
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "200",
              color: "#383838",
              marginRight: "5%",
              paddingBottom: "3%",
            }}
          >
            {`${Tfname} ${Tlname} (id:${therapist_id})`}
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "200",
              color: "#383838",
              marginRight: "5%",
              paddingBottom: "3%",
            }}
          >
            {BookingsId}
          </Text>
        </View>
      </View>
    </Card>
  );
}
