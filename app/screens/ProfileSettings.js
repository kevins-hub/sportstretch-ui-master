import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  AppState,
} from "react-native";
import LogOutButton from "../components/shared/LogOutButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import FontAwesome from "@expo/vector-icons";
import colors from "../config/colors";
import authStorage from "../auth/storage";
import contactApi from "../api/contact";
import therapists from "../api/therapists";
import EditContactInfoModal from "../components/shared/EditContactInfoModal";
import TherapistEditServicesModal from "../components/therapist/TherapistEditServicesModal";
import TherapistEditBusinessHoursModal from "../components/therapist/TherapistEditBusinessHoursModal";
import EditBillingInfoModal from "../components/shared/EditBillingInfoModal";
import ChangePasswordModal from "./password/ChangePasswordModal";
import DeleteAccountModal from "../components/shared/DeleteAccountModal";
import Stars from "react-native-stars";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import payment from "../api/payment";
import ProfilePictureUploadModal from "../components/shared/ProfilePictureUploadModal";
import profilePicture from "../api/profilePicture";

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
  const [editBusinessHoursModalVisible, setEditBusinessHoursModalVisible] =
    useState(false);
  const [profilePictureModalVisible, setProfilePictureModalVisible] =
    useState(false);
  const [contactObj, setContactObj] = useState({});
  const [athleteCity, setAthleteCity] = useState("");
  const [athleteState, setAthleteState] = useState("");
  const [isPaymentsEnabled, setIsPaymentsEnabled] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);
  const [stripeSetupStarted, setStripeSetupStarted] = useState(false);

  let athleteLocation;

  const { user } = route.params;

  let userObj = user.userObj;

  const [therapist, setTherapist] = useState(
    user.role === "therapist" ? userObj : {}
  );
  const [businessHours, setBusinessHours] = useState(
    user.role === "therapist" ? therapist.business_hours : {}
  );

  const [stripeOnboardLink, setStripeOnboardLink] = useState("");

  const getStripeOnboardLink = async () => {
    const response = await payment.getStripeOnboardLink(userObj.therapist_id);
    await setStripeOnboardLink(response.data.url.toString());
    return response.data.url;
  };

  const getStripePaymentsEnabled = async () => {
    const response = await payment.getStripeAccount(userObj.therapist_id);
    getStripeSetupStarted(response);
    setIsPaymentsEnabled(response.data.payouts_enabled === true ? true : false);
    return response.data.payouts_enabled === true ? true : false;
  };

  const getStripePaymentsStatus = async () => {
    if (user.role === "athlete" || user.role === "admin") return;
    const paymentsEnabled = await getStripePaymentsEnabled();
    if (!paymentsEnabled) {
      await getStripeOnboardLink();
    }
  };

  const getStripeSetupStarted = async (stripeResponse) => {
    if (!stripeResponse.data) return;
    if (stripeResponse.data.details_submitted === false) {
      setStripeSetupStarted(false);
    } else {
      setStripeSetupStarted(true);
    }
  };

  const getTherapist = async () => {
    therapists.getTherapist(userObj.therapist_id).then((res) => {
      setTherapist(res.data[0]);
      setBusinessHours(res.data[0].business_hours);
    });
  };

  const loadLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    athleteLocation = await Location.getCurrentPositionAsync({});
    return athleteLocation;
  };

  const getAthleteCityState = async (athleteLocation) => {
    if (!athleteLocation) return;
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

  const fetchProfilePicture = async () => {
    const authId = user.authorization_id;
    await profilePicture.getProfilePicutre(authId).then((res) => {
      if (res.data) {
        setProfilePictureUrl(res.data["profile_picture_url"]);
      }
    });
    return;
  };

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

  useEffect(() => {
    (async () => {
      if (user.role === "therapist") {
        getTherapist();
      }
    })();
  }, [editTherapistServicesModalVisible, editBusinessHoursModalVisible]);

  useEffect(() => {
    (async () => {
      await getStripePaymentsStatus();
    })();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // Call your function here
        getStripePaymentsStatus();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    (async () => {
      await fetchProfilePicture();
    })();
  }, [profilePictureModalVisible]);

  const handleModalClose = () => {
    setEditContactInfoModalVisible(false);
    fetchContactInfo();
  };

  return (
    <>
      <ProfilePictureUploadModal
        user={user}
        visible={profilePictureModalVisible}
        setVisibility={setProfilePictureModalVisible}
        currentProfilePictureUrl={profilePictureUrl}
      />
      <EditContactInfoModal
        user={user}
        contactInfo={contactObj}
        visible={editContactInfoModalVisible}
        setVisibility={setEditContactInfoModalVisible}
        setContactObj={setContactObj}
        onClose={handleModalClose}
      />
      <TherapistEditServicesModal
        therapist={therapist}
        visible={editTherapistServicesModalVisible}
        setVisibility={setEditTherapistServicesModalVisible}
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
            <TouchableOpacity
              onPress={() => setProfilePictureModalVisible(true)}
            >
              {/* <MaterialCommunityIcons
                  style={styles.accountIcon}
                  name="account-circle"
                  size={73}
                  color={colors.primary}
                /> */}
              {profilePictureUrl ? (
                <View>
                  <Image
                    source={{ uri: profilePictureUrl }}
                    style={styles.profilePicture}
                  />
                </View>
              ) : (
                <MaterialCommunityIcons
                  style={styles.accountIcon}
                  name="account-circle"
                  size={73}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

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
            {/* only display if therapist */}
            {user.role === "therapist" && (
              <View style={styles.cardOutterContainer}>
                <View style={styles.cardInnerContainer}>
                  <View style={styles.cardContent}>
                    <View style={styles.paymentStatusContainer}>
                      {user.role === "therapist" &&
                      user.userObj.enabled !== 1 ? (
                        <>
                          <MaterialCommunityIcons
                            name="alert"
                            style={styles.alertIcon}
                            size={24}
                            color="orange"
                          />
                          <Text style={styles.paymentStatusTitle}>
                            Account not yet enabled
                          </Text>
                          <Text>
                            Your account is not yet enabled. Please wait for
                            admin approval.
                          </Text>
                        </>
                      ) : !isPaymentsEnabled ? (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(stripeOnboardLink);
                            }}
                          >
                            <View styles={styles.alertTitleContainer}>
                              <MaterialCommunityIcons
                                name="alert"
                                style={styles.alertIcon}
                                size={24}
                                color="orange"
                              />
                              <Text style={styles.paymentStatusTitle}>
                                Payment setup needed!
                              </Text>
                            </View>
                            {!stripeSetupStarted ? (
                              <Text>
                                Set up payment details in order to enable
                                bookings and payments for appointments. Click
                                here to set up.
                              </Text>
                            ) : (
                              <Text>
                                Almost there! Additional information is needed
                                to enable payments. Click here to finish setup.
                              </Text>
                            )}
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <MaterialCommunityIcons
                            name="check-circle"
                            style={styles.alertIcon}
                            size={24}
                            color="green"
                          />
                          <Text style={styles.paymentStatusTitle}>
                            Payment setup complete
                          </Text>
                          <Text>You are all set up to recieve payments.</Text>
                        </>
                      )}

                      {/* 
                      {(!isPaymentsEnabled && (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(stripeOnboardLink);
                            }}
                          >
                            <View styles={styles.alertTitleContainer}>
                              <MaterialCommunityIcons
                                name="alert"
                                style={styles.alertIcon}
                                size={24}
                                color="orange"
                              />
                              <Text style={styles.paymentStatusTitle}>
                                Payment setup needed!
                              </Text>
                            </View>
                            <Text>
                              Set up payment details in order to enable bookings
                              and payments for appointments. Click here to set
                              up.
                            </Text>
                          </TouchableOpacity>
                        </>
                      )) || (
                        <>
                          <MaterialCommunityIcons
                            name="check-circle"
                            style={styles.alertIcon}
                            size={24}
                            color="green"
                          />
                          <Text style={styles.paymentStatusTitle}>
                            Payment setup complete
                          </Text>
                          <Text>You are all set up to recieve payments.</Text>
                        </>
                      )} */}
                    </View>
                  </View>
                </View>
              </View>
            )}

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

                      {(athleteLocation && (
                        <>
                          <Text style={styles.locationPropLabel}>
                            Location:
                          </Text>
                          <Text style={styles.locationProp}>
                            {athleteCity}, {athleteState}
                          </Text>
                        </>
                      )) || (
                        <>
                          <Text style={styles.locationPropLabel}>
                            Location:
                          </Text>
                          <Text style={styles.locationProp}>
                            Location not available
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                  {/* {user.role === "therapist" && (

                  )} */}

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
                  <Text style={styles.cardTitle}>Recovery Specialist Profile</Text>
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
                      <Text style={styles.propLabel}>Primary Discipline:</Text>
                      <Text>{therapist.profession}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Additional Services Offered:</Text>
                      <Text>{therapist.services}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Professional Bio: </Text>
                      <Text>{therapist.summary}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Hourly Rate: </Text>
                      <Text>${therapist.hourly_rate}</Text>
                    </View>

                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Clinic Address:</Text>
                      <Text>
                        {therapist.street} {therapist.apartment_no}
                      </Text>
                      <Text>
                        {therapist.city}, {therapist.state} {therapist.zipcode}
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
                      <Text>
                        {therapist.accepts_house_calls ? "Yes" : "No"}
                      </Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>Accepts In Clinic:</Text>
                      <Text>{therapist.accepts_in_clinic ? "Yes" : "No"}</Text>
                    </View>
                    <View style={styles.propContainer}>
                      <Text style={styles.propLabel}>License status:</Text>
                      <Text>
                        {therapist.license_infourl
                          ? therapist.license_infourl
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
  paymentStatusContainer: {
    width: "100%",
  },
  paymentStatusTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: "4%",
    marginTop: "1%",
    marginLeft: "10%",
  },
  alertTitleContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignText: "center",
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
  alertIcon: {
    marginRight: 8,
    position: "absolute",
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
  profilePicture: {
    width: 73,
    height: 73,
    borderRadius: 100,
  },

  // accountIcon: {
  //   marginTop: '5%'
  // },
});

export default ProfileSettings;
