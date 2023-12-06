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
    width: 110,
    height: 46,
    margin: 5,
  },

  text: {
    color: colors.secondary,
    fontSize: 18,
  },
});

export default BookButton;
