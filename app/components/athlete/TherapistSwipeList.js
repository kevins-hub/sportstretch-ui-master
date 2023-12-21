// SwipeableList.js
import React from "react";
import { View, FlatList } from "react-native";
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
      <FlatList
        data={therapistsInRegion}
        keyExtractor={(item) => item.therapist_id}
        renderItem={renderSwipeableItem}
      />
    </View>
  );
};

export default TherapistSwipeList;
