// SwipeableList.js
import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import AthleteBookNowCard from "./AthleteBookNowCard";

const TherapistSwipeList = (props) => {
  const therapistsInRegion = props.therapists;
  const athleteAddress = props.athleteAddress;

  const renderSwipeableItem = ({ item }) => {
    return (
      <AthleteBookNowCard
        selectedTherapist={item}
        athleteAddress={athleteAddress}
      ></AthleteBookNowCard>
    );
  };
  return (
    <View>
      {/* { therapistsInRegion.length === 0 && (
        <Text style={styles.defaultText}>
          No active recovery specialists in the selected region. Please choose another region.
        </Text>
      )} */}
      <FlatList
        data={therapistsInRegion}
        keyExtractor={(item) => item.therapist_id}
        renderItem={renderSwipeableItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 10,
    marginRight: 10,
  },
});

export default TherapistSwipeList;
