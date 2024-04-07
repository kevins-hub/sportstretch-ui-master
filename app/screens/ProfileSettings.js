import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LogOutButton from "../components/shared/LogOutButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import FontAwesome from "@expo/vector-icons";
import colors from "../config/colors";
import authStorage from "../auth/storage";
import contactApi from "../api/contact";
import EditContactInfoModal from "../components/shared/EditContactInfoModal";
import TherapistEditServicesModal from "../components/therapist/TherapistEditServicesModal";
import TherapistEditBusinessHoursModal from "../components/therapist/TherapistEditBusinessHoursModal";
import EditBillingInfoModal from "../components/shared/EditBillingInfoModal";
import ChangePasswordModal from "./password/ChangePasswordModal";
import DeleteAccountModal from "../components/shared/DeleteAccountModal";
import Stars from "react-native-stars";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";

function ProfileSettings({ route }) {
  const [editContactInfoModalVisible, setEditContactInfoModalVisible] =
    useState(false);
  const [
    editTherapistServicesModalVisible,
    setEditTherapistServicesModalVisible,
  ] = useState(false);
  const [editBillingInfoModalVisible, setEditBillingInfoModalVisible] =
    useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [editBusinessHoursModalVisible, setEditBusinessHoursModalVisible] = useState(false);
  const [contactObj, setContactObj] = useState({});
  const [athleteCity, setAthleteCity] = useState("");
  const [athleteState, setAthleteState] = useState("");

 

  const { user } = route.params;
  let userObj = user.userObj;

  const [businessHours, setBusinessHours] = useState(user.role === "therapist" ? userObj.business_hours: {});

  // console.warn("user = ", user);

  // const mergeUserTherapist = (userObj, therapistObj) => {
  //   userObj = { ...userObj, ...therapistObj };
  // }

  // const businessHours = userObj.business_hours;

  const loadLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    let athleteLocation = await Location.getCurrentPositionAsync({});
    return athleteLocation;
  };

  const getAthleteCityState = async (athleteLocation) => {
    let athleteRegion = await Location.reverseGeocodeAsync(
      athleteLocation.coords
    );
    setAthleteCity(athleteRegion[0].city);
    setAthleteState(athleteRegion[0].region);
  };

  const fetchContactInfo = async () => {
    const userAuthId = user.authorization_id.toString();
    try {
      const response = await contactApi.getContact(userAuthId);
      setContactObj(response.data);
    } catch (error) {
      console.error("Error fetching contact info", error);
    }
  };

  // const hoursTupleToTimeString = (hours) => {
  //   // convert [9, 17] to "9:00 AM - 5:00 PM"
  //   let start = hours[0];
  //   let end = hours[1];
  //   let startStr = start % 12 === 0 ? "12" : (start % 12).toString();
  //   let endStr = end % 12 === 0 ? "12" : (end % 12).toString();
  //   let startSuffix = start >= 12 ? "PM" : "AM";
  //   let endSuffix = end >= 12 ? "PM" : "AM";
  //   return `${startStr}:00 ${startSuffix} - ${endStr}:00 ${endSuffix}`;
  // };

  const hoursTupleToTimeString = (hours) => {
    // convert [9, 17] to "9:00 AM - 5:00 PM"
    // convert [9.5, 17] to "9:30 AM - 5:00 PM"
    let start = hours[0];
    let end = hours[1];
    let startStr = start % 12 === 0 ? "12" : Math.floor(start % 12).toString();
    let endStr = end % 12 === 0 ? "12" : Math.floor(end % 12).toString();
    let startSuffix = start >= 12 ? "PM" : "AM";
    let endSuffix = end >= 12 ? "PM" : "AM";
    let startMinutes = start % 1 === 0.5 ? "30" : "00";
    let endMinutes = end % 1 === 0.5 ? "30" : "00";
    return `${startStr}:${startMinutes} ${startSuffix} - ${endStr}:${endMinutes} ${endSuffix}`;
  };

  useEffect(() => {
    (async () => {
      if (user.role === "athlete") {
        const athleteLocation = await loadLocation();
        await getAthleteCityState(athleteLocation);
      }
      fetchContactInfo();
    })();
  }, [editContactInfoModalVisible]);

  const handleModalClose = () => {
    setEditContactInfoModalVisible(false);
    fetchContactInfo();
  };

  return (
    <>
      <EditContactInfoModal
        user={user}
        contactInfo={contactObj}
        visible={editContactInfoModalVisible}
        setVisibility={setEditContactInfoModalVisible}
        setContactObj={setContactObj}
        onClose={handleModalClose}
      />
      <TherapistEditServicesModal
        user={user}
        visible={editTherapistServicesModalVisible}
        setVisibility={setEditTherapistServicesModalVisible}
        // mergeUserTherapist={mergeUserTherapist}
      />

      <EditBillingInfoModal
        user={user}
        visible={editBillingInfoModalVisible}
        setVisibility={setEditBillingInfoModalVisible}
      />
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        setVisibility={setChangePasswordModalVisible}
      />
      <DeleteAccountModal
        visible={deleteAccountModalVisible}
        setVisibility={setDeleteAccountModalVisible}
        authId={user.authorization_id}
      />
      <TherapistEditBusinessHoursModal
        user={user}
        visible={editBusinessHoursModalVisible}
        setVisibility={setEditBusinessHoursModalVisible}
        businessHours={businessHours}
      />
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.container}>
          {/* <Text>Profile settings</Text> */}
          {/* <FontAwesome name="user-circle" size={73} color="white" /> */}
          {/* <View style={styles.iconNameContainer}>
                <MaterialCommunityIcons style={styles.accountIcon} name="account-circle" size={73} color={colors.primary}/>
                <Text>{user.userObj.first_name} {user.userObj.last_name}</Text>
              </View> */}
          <View style={styles.keyPropsContainer}>
            <MaterialCommunityIcons
              style={styles.accountIcon}
              name="account-circle"
              size={73}
              color={colors.primary}
            />
            <View style={styles.keyProps}>
              <Text style={styles.nameProp}>
                {user.userObj.first_name} {user.userObj.last_name}
              </Text>
              <Text>
                {user.role === "therapist"
                  ? userObj.profession
                  : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.cardsContainer}>
            {/* only display if athlete */}
            {/* {user.role === "athlete" && (
              <View style={styles.cardOutterContainer}>
                <View style={styles.cardInnerContainer}>
                  <View style={styles.cardContent}>
                    <View style={styles.locationPropContainer}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        style={styles.locationIcon}
                        size={18}
                        color="red"
                      />
                      <Text style={styles.locationPropLabel}>Location:</Text>
                      <Text style={styles.locationProp}>
                        {athleteCity}, {athleteState}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )} */}

            <View style={styles.cardOutterContainer}>
              <View style={styles.cardInnerContainer}>
                <View style={styles.cardContent}>
                  {user.role === "athlete" && (
                    <View style={styles.locationPropContainer}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        style={styles.locationIcon}
                        size={18}
                        color="red"
                      />
                      <Text style={styles.locationPropLabel}>Location:</Text>
                      <Text style={styles.locationProp}>
                        {athleteCity}, {athleteState}
                      </Text>
                    </View>
                  )}
                  {user.role === "therapist" && (
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingPropLabel}>Rating:</Text>
                      {parseFloat(userObj.avg_rating) > 0 ? (
                        <>
                          <Stars
                            default={parseFloat(userObj.avg_rating)}
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
                          <Text style={styles.locationProp}>
                            {`(${userObj.avg_rating})`}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.locationProp}>No ratings yet</Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* only display if therapist */}
            {user.role === "therapist" && (
              <View style={styles.cardOutterContainer}>
                <View style={styles.cardInnerContainer}>
                  <Text style={styles.cardTitle}>Specialist Profile</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setEditTherapistServicesModalVisible(true)}
                  >
                    <View>
                      <Text style={styles.buttonText}>Edit</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.cardContent}>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Services Offered:</Text>
                      <Text>{userObj.services}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Summary: </Text>
                      <Text>{userObj.summary}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Hourly Rate: </Text>
                      <Text>${userObj.hourly_rate}</Text>
                    </View>

                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Clinic Address:</Text>
                      <Text>
                        {contactObj.street} {contactObj.apartment_no}
                      </Text>
                      <Text>
                        {contactObj.city}, {contactObj.state}{" "}
                        {contactObj.zipcode}
                      </Text>
                    </View>
                    {/* <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Operating Hours:</Text>
                      <Text>Monday:</Text>
                      {businessHours &&
                      businessHours["0"] &&
                      businessHours["0"].length > 0 ? (
                        businessHours["0"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                      <Text>Tuesday:</Text>
                      {businessHours &&
                      businessHours["1"] &&
                      businessHours["1"].length > 0 ? (
                        businessHours["1"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                      <Text>Wednesday:</Text>
                      {businessHours &&
                      businessHours["2"] &&
                      businessHours["2"].length > 0 ? (
                        businessHours["2"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                      <Text>Thursday:</Text>
                      {businessHours &&
                      businessHours["3"] &&
                      businessHours["3"].length > 0 ? (
                        businessHours["3"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                      <Text>Friday:</Text>
                      {businessHours &&
                      businessHours["4"] &&
                      businessHours["4"].length > 0 ? (
                        businessHours["4"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                      <Text>Saturday:</Text>
                      {businessHours &&
                      businessHours["5"] &&
                      businessHours["5"].length > 0 ? (
                        businessHours["5"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                      <Text>Sunday:</Text>
                      {businessHours &&
                      businessHours["6"] &&
                      businessHours["6"].length > 0 ? (
                        businessHours["6"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View> */}
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Accepts House Calls:</Text>
                      <Text>{userObj.accepts_house_calls ? "Yes" : "No"}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Accepts In Clinic:</Text>
                      <Text>{userObj.accepts_in_clinic ? "Yes" : "No"}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>License status:</Text>
                      <Text>
                        {userObj.license_infourl
                          ? userObj.license_infourl
                          : "License not yet uploaded. Please upload license to enable services."}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {user.role === "therapist" && (
              <View style={styles.cardOutterContainer}>
                <View style={styles.cardInnerContainer}>
                  <Text style={styles.cardTitle}>Availability</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setEditBusinessHoursModalVisible(true)}
                  >
                    <View>
                      <Text style={styles.buttonText}>Edit</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.dayHoursContainer}>
                    <Text>Monday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["0"] &&
                      businessHours["0"].length > 0 ? (
                        businessHours["0"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayHoursContainer}>
                    <Text>Tuesday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["1"] &&
                      businessHours["1"].length > 0 ? (
                        businessHours["1"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayHoursContainer}>
                    <Text>Wednesday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["2"] &&
                      businessHours["2"].length > 0 ? (
                        businessHours["2"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayHoursContainer}>
                    <Text>Thursday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["3"] &&
                      businessHours["3"].length > 0 ? (
                        businessHours["3"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayHoursContainer}>
                    <Text>Friday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["4"] &&
                      businessHours["4"].length > 0 ? (
                        businessHours["4"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayHoursContainer}>
                    <Text>Saturday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["5"] &&
                      businessHours["5"].length > 0 ? (
                        businessHours["5"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayHoursContainer}>
                    <Text>Sunday:</Text>
                    <View style={styles.hoursContainer}>
                      {businessHours &&
                      businessHours["6"] &&
                      businessHours["6"].length > 0 ? (
                        businessHours["6"].map((hours) => {
                          return (
                            <Text style={styles.hoursText}>
                              {hoursTupleToTimeString(hours)}
                            </Text>
                          );
                        })
                      ) : (
                        <Text style={styles.closedText}>Closed</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.cardOutterContainer}>
              <View style={styles.cardInnerContainer}>
                <Text style={styles.cardTitle}>Contact Information</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setEditContactInfoModalVisible(true)}
                >
                  <View>
                    <Text style={styles.buttonText}>Edit</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.cardContent}>
                  <View style={styles.propContainer}>
                    <Text style={styles.propLabel}>Phone number:</Text>
                    <Text>{contactObj.mobile}</Text>
                  </View>
                  <View style={styles.propContainer}>
                    <Text style={styles.propLabel}>Email: </Text>
                    <Text>{contactObj.email}</Text>
                  </View>
                  {/* {user.role !== "athlete" && (
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Address: </Text>
                      <Text>
                        {contactObj.street} {contactObj.apartment_no}
                      </Text>
                      <Text>
                        {contactObj.city}, {contactObj.state}{" "}
                        {contactObj.zipcode}
                      </Text>
                    </View>
                  )} */}
                </View>
              </View>
            </View>

            <View style={styles.cardOutterContainer}>
              <View style={styles.cardInnerContainer}>
                <Text style={styles.cardTitle}>Billing</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setEditBillingInfoModalVisible(true)}
                >
                  <View>
                    <Text style={styles.buttonText}>Edit</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.propContainer}>
                  <View style={styles.cardContent}>
                    <Text style={styles.propLabel}>Payment Method</Text>
                    <Text>XXXX-XXXX-XXXX-1234</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 
              <ScrollView contentContainerStyle={styles.profileSummaryContainer}> */}
          {/* <View style={styles.propContainer}>
                  <Text style={styles.propLabel}>Account Type:</Text>
                  <Text>{user.role === 'therapist' ? 'Recovery Specialist' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
                </View> */}
          {/* <View style={styles.propContainer}>
                  <Text style={styles.propLabel}>Subscription:</Text>
                  <Text>Free</Text>
                </View>
                <View style={styles.propContainer}>
                  <Text style={styles.propLabel}>Location:</Text>
                  <Text>California</Text>
                </View>
                <View style={styles.propContainer}>
                  <Text style={styles.propLabel}>Phone number:</Text>
                  <Text>{user.userObj.mobile}</Text>
                </View>
                <View style={styles.propContainer}>
                  <Text style={styles.propLabel}>Email: </Text>
                  <Text>placeholder@email.com</Text>
                </View>
                <View style={styles.propContainer}>
                  <Text style={styles.propLabel}>Payment Method: </Text>
                  <Text>XXXX-XXXX-XXXX-1234</Text>
                </View>
              </ScrollView> */}
          <View style={styles.buttonContainer}>
            <LogOutButton />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setDeleteAccountModalVisible(true)}
            >
              <View>
                <Text style={styles.bottomButtonText}>Delete Account</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setChangePasswordModalVisible(true)}
            >
              <View>
                <Text style={styles.bottomButtonText}>Change Password</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  },
  iconNameContainer: {
    width: "100%",
    alignItems: "center",
  },
  keyPropsContainer: {
    width: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    alignItems: "left",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "4%",
  },
  keyProps: {
    marginLeft: "6%",
  },
  nameProp: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cardOuterContainer: {
    padding: 10,
    width: "50%",
    height: "auto",
  },
  cardInnerContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    padding: 15,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: 12,
    marginTop: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: "4%",
  },
  cardContent: {
    width: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    alignItems: "left",
  },
  profileSummaryContainer: {
    width: "100%",
    marginTop: "4%",
    paddingLeft: "2%",
    paddingRight: "2%",
    alignItems: "left",
  },
  propContainer: {
    marginBottom: 10,
  },
  locationPropContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 8,
  },
  locationProp: {
    marginLeft: 12,
  },
  locationPropLabel: {
    fontWeight: "bold",
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  ratingPropLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  propLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  hoursText: {
    marginLeft: "5%",
  },
  closedText: {
    marginLeft: "5%",
    fontStyle: "italic",
  },
  dayHoursContainer: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column-reverse",
    width: "92%",
    margin: "4%",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 30,
    margin: 5,
    position: "absolute",
    right: 4,
    top: 4,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 30,
    margin: 5,
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
  },
  bottomButtonText: {
    color: colors.primary,
    fontSize: 12,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 14,
  },

  // accountIcon: {
  //   marginTop: '5%'
  // },
});

export default ProfileSettings;
