import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

function BookingDoneIndicator({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        autoPlay
        autoSize
        loop
        source={require("../../assets/animations/BookingDone.json")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    //backgroundColor: '#dcedc8',
    alignItems: "center",
    justifyContent: "center",
    //height: '100%',
    //width: '100%',
  },
});

export default BookingDoneIndicator;
