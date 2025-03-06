import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
import * as Location from "expo-location";
import AthleteMapView from "../../components/athlete/AthleteMapView";
import therapistsApi from "../../api/therapists";
import SearchTherapist from "../../components/athlete/SearchTherapist";
import TherapistSwipeList from "../../components/athlete/TherapistSwipeList";
import SetStateModal from "../../components/athlete/SetStateModal";

function AthleteBookNow(props) {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [location, setLocation] = useState(null);
  const [athleteRegion, setAthleteRegion] = useState(null);
  const [athleteAddress, setAthleteAddress] = useState("");
  const [markers, setMarkers] = useState(null);
  const [stateModalVisible, setStateModalVisible] = useState(false);

  const loadLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setStateModalVisible(true);
      return;
    }

    let athleteLocation = await Location.getCurrentPositionAsync({});
    setLocation(athleteLocation);
    return athleteLocation;
  };

  const getAthleteRegion = async (athleteLocation) => {
    if (!athleteLocation) return;
    let athleteRegion = await Location.reverseGeocodeAsync(
      athleteLocation.coords
    );
    setAthleteRegion(athleteRegion[0].region);
    setAthleteAddress(
      athleteRegion[0].street +
        ", " +
        athleteRegion[0].city +
        ", " +
        athleteRegion[0].region +
        ", " +
        athleteRegion[0].postalCode
    );
    return athleteRegion[0].region;
  };

  const getTherapists = async (athleteRegion) => {
    setTherapists([]);
    try {
      const response = await therapistsApi.getTherapistsByState(athleteRegion);
      if (response.status === 404) {
        return;
      }
      let therapistList = response.data;
      therapistList = therapistList.filter(
        (therapist) =>
          therapist.stripe_account_id !== null &&
          therapist.accepts_payments === true
      );
      // sort by rating
      therapistList.sort(
        (a, b) => Number(b.average_rating) - Number(a.average_rating)
      );
      setTherapists(therapistList);
      // setSelectedTherapist(therapistList[0]);
      await loadMarkers(therapistList);
      return therapistList;
    } catch (error) {
      console.warn("Error on book now getTherapists", error);
    }
  };

  const loadMarkers = async (therapists) => {
    let promises = therapists.map(async (therapist) => {
      let locPromise = await Location.geocodeAsync(
        therapist.street + " " + therapist.city + " " + therapist.state
      );
      return { ...locPromise[0], therapistId: therapist.therapist_id };
    });

    let results = await Promise.all(promises);
    setMarkers(results);
  };

  useEffect(() => {
    (async () => {
      try {
        let athleteLocation = await loadLocation();
        let athleteRegion = await getAthleteRegion(athleteLocation);
        let therapists = await getTherapists(athleteRegion);
        // setSelectedTherapist(therapists[0]);
        await loadMarkers(therapists);
      } catch (err) {
        console.log("Error", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    async () => {
      try {
        let therapists = await getTherapists(athleteRegion);
        await loadMarkers(therapists);
      } catch (err) {
        console.log("Error", err.message);
      }
    };
  }, [setStateModalVisible]);

  useEffect(() => {
    console.log("selectedTherapist -->", selectedTherapist);
  }, [selectedTherapist]);

  const handleMarkerPress = (event) => {
    console.log("event AthleteMapView", event);
    console.log("hello");
    // setSelectedTherapist(therapists[event._targetInst.return.key]);
  };

  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <SetStateModal
        visible={stateModalVisible}
        setVisibility={setStateModalVisible}
        getTherapists={getTherapists}
        setAthleteRegion={setAthleteRegion}
        athleteRegion={athleteRegion}
      />
      <SearchTherapist
        getTherapists={getTherapists}
        currentState={athleteRegion}
      ></SearchTherapist>
      <AthleteMapView
        markers={markers}
        selectedTherapist={selectedTherapist}
        setSelectedTherapist={setSelectedTherapist}
        userLocation={location}
        userRegion={athleteRegion}
        onMarkerPress={handleMarkerPress}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <TherapistSwipeList
          therapistsInRegion={therapists}
          athleteAddress={athleteAddress}
          setSelectedTherapist={setSelectedTherapist}
          selectedTherapist={selectedTherapist}
        />
      </SafeAreaView>
    </View>
  );
}

export default AthleteBookNow;
