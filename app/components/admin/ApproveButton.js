import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../../config/colors";

function ApproveButton({ title, onPress }) {
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
    borderRadius: 30,
    width: 10,
    height: "70%",
    margin: 5,
    backgroundColor: "#373737",
    flex: 1,
    marginTop: 10,
    marginLeft: "6%",
  },

  text: {
    color: "#ffffff",
    fontSize: 17,
    marginLeft: "25%",
  },
});

export default ApproveButton;
