import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import colors from "../../config/colors";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { stateShortToLong } from "../../lib/states";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const initMapRegion = {
  latitude: 39.129065,
  longitude: -95.141081,
  latitudeDelta: 55,
  longitudeDelta: 55,
};

function AthleteMapView({
  markers,
  selectedTherapist,
  setSelectedTherapist,
  userLocation,
  userRegion,
  onMarkerPress,
}) {
  const [region, setRegion] = useState(initMapRegion);

  useEffect(() => {
    if (!!selectedTherapist) {
      setRegionToTherapistRegion(selectedTherapist);
    } else {
      if (userLocation) {
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        });
      }
    }
  }, [markers, selectedTherapist]);

  const setRegionToTherapistRegion = async (therapist) => {
    console.log("therapist", therapist);
    let therapistRegion = await Location.geocodeAsync(
      therapist.street + " " + therapist.city + " " + therapist.state
    );
    const therapistLocation = therapistRegion[0];

    setRegion({
      latitude: therapistLocation.latitude,
      longitude: therapistLocation.longitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    });
    return;
  };

  const resetMarkerToUser = () => {
    console.log("resetMarkerToUser");
    setRegion({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    });
    setSelectedTherapist(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetMarkerToUser}
          >
            <MaterialCommunityIcons
              style={styles.accountIcon}
              name="crosshairs-gps"
              size={30}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}

        {markers &&
          markers.map((marker, index) => (
            <Marker
              key={index}
              identifier={index.toString()}
              onPress={onMarkerPress}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              {selectedTherapist &&
              marker.therapistId == selectedTherapist.therapist_id ? (
                <FontAwesome5
                  name="map-marker-alt"
                  size={40}
                  color={colors.mapred}
                />
              ) : (
                <FontAwesome5
                  name="map-marker-alt"
                  size={28}
                  color={colors.primary}
                />
              )}
            </Marker>
          ))}
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    flex: 1,
  },
  resetButton: {
    position: "absolute",
    top: 13,
    right: 13,
    backgroundColor: "#F2F0EF",
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    // display: "flex",
    // // flexDirection: "row",
    // alignItems: "center",
    // backgroundColor: "#fff",
    // width: 30,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AthleteMapView;
