import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import colors from "../../config/colors";
import Stars from "react-native-stars";
import AuthContext from "../../auth/context";

function TherapistHeader(props) {
  const { user, setUser } = useContext(AuthContext);

  return (
    <View style={styles.infoContainer}>
      <View style={styles.info}>
        <Text style={styles.infoText}>Hi, {user.userObj.first_name}</Text>
        <View style={styles.phoneContainer}>
          <Text style={styles.contactText}>{user.userObj.mobile}</Text>
          <MaterialCommunityIcons
            name="circle-edit-outline"
            size={24}
            color="white"
          />
        </View>
      </View>
      <View style={styles.profile}>
        <FontAwesome name="user-circle" size={73} color="white" />
        <View style={{ backgroundColor: colors.primary, marginLeft: -5 }}>
          <Stars
            default={parseFloat(user.userObj.avg_rating)}
            half={true}
            starSize={40}
            disabled
            fullStar={
              <FontAwesome
                name={"star"}
                style={{ color: colors.gold }}
                size={18}
              />
            }
            halfStar={
              <FontAwesome
                name="star-half-empty"
                style={{ color: colors.gold }}
                size={18}
              />
            }
            emptyStar={
              <FontAwesome
                name={"star-o"}
                style={{ color: colors.secondary }}
                size={18}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactText: {
    color: "white",
    fontSize: 20,
    fontWeight: "300",
  },
  info: {
    width: "75%",
    paddingLeft: 2,
    paddingVertical: 10,
  },
  infoContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    width: "100%",
    height: 113,
    alignItems: "center",
  },
  infoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "300",
    marginLeft: 15,
  },
  phoneContainer: {
    marginVertical: 10,
    flexDirection: "row",
    marginLeft: 15,
  },
  profile: {
    // width:73,
    // height:80,
    // marginTop:-10,
    // marginLeft:175
  },
});
export default TherapistHeader;
