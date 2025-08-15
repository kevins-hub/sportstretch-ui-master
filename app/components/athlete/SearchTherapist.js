import { React, useRef } from "react";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import colors from "../../config/colors";
import therapists from "../../api/therapists";
import { stateLongToShort, stateShortToLong } from "../../lib/states";

const { height: screenHeight } = Dimensions.get("window");

function SearchTherapist({
  getTherapists,
  currentState = "",
  isInModal = false,
  setModalVisibility,
  setAthleteRegion,
}) {
  const [statesList, setStatesList] = useState([{ label: "Loading...", value: "" }]);
  const [selectedState, setSelectedState] = useState(currentState);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const setStateOptions = (statesObjList) => {
    console.log("Setting state options:", statesObjList);
    if (!statesObjList || statesObjList.length === 0) {
      setStatesList([{ label: "No states currently with active recovery specialists", value: "" }]);
      return;
    }
    let states = statesObjList.map((stateItem) => {
      // Handle different possible response structures
      if (typeof stateItem === 'string') {
        return { label: stateItem, value: stateItem };
      }
      if (stateItem.state) {
        return { label: stateItem.state, value: stateItem.state };
      }
      // Fallback for other structures
      return { label: stateItem.label || stateItem.value || stateItem, value: stateItem.value || stateItem.label || stateItem };
    });
    console.log("Processed states:", states);
    setStatesList(states);
  };

  const getStates = async () => {
    try {
      console.log("Fetching therapist states...");
      const response = await therapists.getTherapistStates();
      console.log("API response:", response);
      setStateOptions(response.data);
    } catch (error) {
      console.error("Error on getStates", error);
      // Set error state to prevent crashes
      setStatesList([{ label: "Error loading states", value: "" }]);
    }
  };

  useEffect(() => {
    (async () => {
      await getStates();
    })();
  }, []);

  const handleSelect = (state) => {
    console.log("Selected state:", state);
    if (!state) return;
    setSelectedState(state);
    const shortState = stateLongToShort(state);
    getTherapists(shortState);
    closeModal();
    if (isInModal) {
      setAthleteRegion(shortState);
      setModalVisibility(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: screenHeight / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          paddingLeft: 10,
          marginTop: 10,
        }}
      >
        Show Recovery Specialists in:
      </Text>
      <TouchableOpacity style={styles.selector} onPress={openModal}>
        <Text>{selectedState || "Select an option"}</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeModal}
        />
        <Animated.View style={[styles.sheet, { top: slideAnim }]}>
          <ScrollView>
            {statesList.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                style={styles.option}
              >
                <Text>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // height: "20%",
  },
  selector: {
    // borderWidth: 1,
    padding: 10,
    // borderRadius: 8,
    // width: "50%",
    // alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: screenHeight / 2,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

export default SearchTherapist;
