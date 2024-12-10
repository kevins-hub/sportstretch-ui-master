import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import colors from "../../config/colors";
import therapists from "../../api/therapists";
import { stateLongToShort, stateShortToLong } from "../../lib/states";

function SearchTherapist({
  getTherapists,
  currentState = "",
  isInModal = false,
  setModalVisibility,
  setAthleteRegion,
}) {
  const [statesList, setStatesList] = useState(["California"]);
  const [selectedState, setSelectedState] = useState(currentState);
  const options = [];

  const setStateOptions = (statesObjList) => {
    if (statesObjList.length === 0) {
      setStatesList([]);
      return;
    }
    let states = statesObjList.map((states) => {
      return { label: states.state, value: states.state };
    });
    setStatesList(states);
  };

  const getStates = async () => {
    try {
      const response = await therapists.getTherapistStates();
      setStateOptions(response.data);
    } catch (error) {
      console.error("Error on getStates", error);
    }
  };

  useEffect(() => {
    (async () => {
      await getStates();
    })();
  }, []);

  const handleSelect = (state) => {
    if (!state) return;
    setSelectedState(state);
    const shortState = stateLongToShort(state);
    getTherapists(shortState);
    if (isInModal) {
      setAthleteRegion(shortState);
      setModalVisibility(false);
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
        Show Recovery Specialists in:
      </Text>
      <RNPickerSelect
        placeholder={{
          label: currentState ? `My state (touch to change)` : "Select a State",
          value: currentState,
        }}
        value={selectedState}
        items={statesList ? statesList : ["California"]}
        onValueChange={(value) => handleSelect(value)}
        style={styles.statePicker}
      />
      <FlatList
        data={{}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    padding: 10,
  },
  statePicker: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    height: 46,
    margin: 5,
  },
  text: {
    color: colors.primary,
    fontSize: 18,
  },
});

export default SearchTherapist;
