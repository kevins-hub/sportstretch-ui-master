import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Rating } from "react-native-ratings";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../config/colors";
import BookButton from "./BookButton";
import AuthContext from "../../auth/context";
import BookModal from "./BookModal";

function AthleteBookNowCard({ therapist, athleteAddress, selectedTherapist }) {
  if (!therapist) return null;
  if (!therapist.hourly_rate) return null;

  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  return (
    <>
      <BookModal
        visible={modalVisible}
        setVisibility={setModalVisible}
        therapistId={therapist.therapist_id}
        athleteId={user.userObj.athlete_id}
        athleteLocation={athleteAddress}
        therapistName={therapist.first_name}
        therapistHourly={therapist.hourly_rate}
        therapistSummary={therapist.summary}
        therapistServices={therapist.services}
        therapistAcceptsHouseCalls={therapist.accepts_house_calls}
        therapistBusinessHours={therapist.business_hours}
        therapistStripeAccountId={therapist.stripe_account_id}
        therapistStreet={therapist.street}
        therapistCity={therapist.city}
        therapistState={therapist.state}
        therapistZipCode={therapist.zipcode}
        therapistProfilePictureUrl={therapist.profile_picture_url}
        therapistProfession={therapist.profession}
      />
      <View style={styles.OuterContainer}>
        <View
          style={
            therapist &&
            selectedTherapist &&
            therapist.therapist_id === selectedTherapist.therapist_id
              ? styles.SelectedContainer
              : styles.Container
          }
        >
          <View style={styles.TherapistContainer}>
            <View>
              {therapist.profile_picture_url ? (
                <Image
                  source={{ uri: therapist.profile_picture_url }}
                  style={styles.profilePicture}
                />
              ) : (
                <MaterialCommunityIcons
                  style={styles.accountIcon}
                  name="account-circle"
                  size={60}
                  color={colors.primary}
                />
              )}
            </View>
            <View style={styles.TherapistDetailContainer}>
              <Text style={styles.TherapistNameText}>
                {therapist ? therapist.first_name : ""}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.dullblack,
                  marginBottom: 4,
                }}
              >
                {therapist ? therapist.profession : ""}
              </Text>
              <Text style={{ fontSize: 12, color: colors.dullblack }}>
                {therapist ? therapist.city : ""},{" "}
                {therapist ? therapist.state : ""}
              </Text>
            </View>
            <View style={styles.PriceRatingContainer}>
              <Text style={styles.Price}>
                ${therapist ? `${Number(therapist.hourly_rate).toFixed(0)}` : 0}
                /hr
              </Text>
              <View style={styles.RatingContainer}>
                <Rating
                  imageSize={15}
                  readonly
                  startingValue={therapist ? therapist.average_rating : 0}
                />
                <Text
                  style={{ fontSize: 14, color: colors.gold, marginRight: 3 }}
                >
                  {therapist
                    ? `(${Number(therapist.average_rating).toFixed(1)})`
                    : "(0.0)"}
                </Text>
              </View>
            </View>
            {/* <View style={styles.RatingContainer}>
              <Rating
                imageSize={15}
                readonly
                startingValue={
                  therapist ? therapist.average_rating : 0
                }
              />
              <Text style={{ fontSize: 14, color: colors.gold }}>
                {therapist ? `(${therapist.average_rating})` : '(0.0)'}
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

  SelectedContainer: {
    backgroundColor: colors.secondary,
    // backgroundColor: "black",
    borderRadius: 15,
    shadowColor: "gold",
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
    marginRight: 20,
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
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginRight: 14,
  },
  accountIcon: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginRight: 14,
  },
});

export default AthleteBookNowCard;
