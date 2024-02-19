import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../../config/colors";

function BookButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
  },

  text: {
    color: colors.secondary,
    fontSize: 12,
  },
});

export default BookButton;
