import React, { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Rating } from "react-native-ratings";

import colors from "../../config/colors";
import BookButton from "./BookButton";
import AuthContext from "../../auth/context";
import BookModal from "./BookModal";

function AthleteBookNowCard({ selectedTherapist, athleteAddress }) {
  if (!selectedTherapist) return null;
  if (!selectedTherapist.hourly_rate) return null;

  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  return (
    <>
      <BookModal
        visible={modalVisible}
        setVisibility={setModalVisible}
        therapistId={selectedTherapist.therapist_id}
        athleteId={user.userObj.athlete_id}
        athleteLocation={athleteAddress}
        therapistName={selectedTherapist.first_name}
        therapistHourly={selectedTherapist.hourly_rate}
        therapistSummary={selectedTherapist.summary}
        therapistServices={selectedTherapist.services}
        therapistAcceptsHouseCalls={selectedTherapist.accepts_house_calls}
        therapistBusinessHours={selectedTherapist.business_hours}
      />
      <View style={styles.OuterContainer}>
        <View style={styles.Container}>
          <View style={styles.TherapistContainer}>
            <View style={styles.TherapistDetailContainer}>
              <Text style={styles.TherapistNameText}>
                {selectedTherapist ? selectedTherapist.first_name : ""}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.dullblack,
                  marginBottom: 4,
                }}
              >
                {selectedTherapist ? selectedTherapist.profession : ""}
              </Text>
              <Text style={{ fontSize: 12, color: colors.dullblack }}>
                {selectedTherapist ? selectedTherapist.city : ""},{" "}
                {selectedTherapist ? selectedTherapist.state : ""}
              </Text>
            </View>
            <View style={styles.PriceRatingContainer}>
              <Text style={styles.Price}>
                $
                {selectedTherapist
                  ? `${Number(selectedTherapist.hourly_rate).toFixed(0)}`
                  : 0}
                /hr
              </Text>
              <View style={styles.RatingContainer}>
                <Rating
                  imageSize={15}
                  readonly
                  startingValue={
                    selectedTherapist ? selectedTherapist.average_rating : 0
                  }
                />
                <Text style={{ fontSize: 14, color: colors.gold }}>
                  {selectedTherapist
                    ? `(${Number(selectedTherapist.average_rating).toFixed(1)})`
                    : "(0.0)"}
                </Text>
              </View>
            </View>
            {/* <View style={styles.RatingContainer}>
              <Rating
                imageSize={15}
                readonly
                startingValue={
                  selectedTherapist ? selectedTherapist.average_rating : 0
                }
              />
              <Text style={{ fontSize: 14, color: colors.gold }}>
                {selectedTherapist ? `(${selectedTherapist.average_rating})` : '(0.0)'}
              </Text>
            </View> */}
          </View>
          <View>
            <View style={styles.BookButtonContainer}>
              <BookButton
                onPress={() => {
                  setModalVisible(true);
                }}
                title={"Book"}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  OuterContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },

  Container: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    width: "100%",
    height: 140,
    padding: 10,
  },

  TherapistContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },

  TherapistDetailContainer: {
    flex: 1,
  },

  PriceRatingContainer: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "right",
    width: "10%",
  },

  Price: {
    fontSize: 15,
    width: "100%",
    color: colors.dullblack,
    textAlign: "right",
  },

  RatingContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },

  DetailContainer: {
    flex: 2,
    alignItems: "left",
  },

  BookButtonContainer: {
    alignItems: "flex-end",
    marginTop: 5,
    marginRight: 5,
  },

  TherapistNameText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.dullblack,
  },
});

export default AthleteBookNowCard;
