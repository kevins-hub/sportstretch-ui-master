import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../../config/colors";

function DenyButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.deny} onPress={onPress}>
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deny: {
    borderRadius: 30,
    width: 15,
    height: "70%",
    margin: 5,
    backgroundColor: "#959595",
    flex: 1,
    marginTop: 10,
    marginRight: "10%",
    marginLeft: "10%",
  },

  text: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: "37%",
  },
});

export default DenyButton;
