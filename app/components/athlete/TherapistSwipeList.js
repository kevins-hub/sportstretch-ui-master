// SwipeableList.js
import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import AthleteBookNowCard from "./AthleteBookNowCard";

const TherapistSwipeList = ({
  therapistsInRegion,
  athleteAddress,
  setSelectedTherapist,
  selectedTherapist,
}) => {

  const renderSwipeableItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => setSelectedTherapist(item)}>
        <AthleteBookNowCard
          therapist={item}
          athleteAddress={athleteAddress}
          selectedTherapist={selectedTherapist}
        ></AthleteBookNowCard>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {/* { therapistsInRegion.length === 0 && (
        <Text style={styles.defaultText}>
          No active recovery specialists in the selected region. Please choose another region.
        </Text>
      )} */}
      {therapistsInRegion.length > 0 && (
        <FlatList
          data={therapistsInRegion}
          keyExtractor={(item) => item.therapist_id}
          renderItem={renderSwipeableItem}
        />
      )}
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
