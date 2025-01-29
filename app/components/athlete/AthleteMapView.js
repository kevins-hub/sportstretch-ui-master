import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import colors from "../../config/colors";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { stateShortToLong } from "../../lib/states";

const initMapRegion = {
  latitude: 39.129065,
  longitude: -95.141081,
  latitudeDelta: 55,
  longitudeDelta: 55,
};

function AthleteMapView({
  markers,
  selectedTherapist,
  userLocation,
  userRegion,
  onMarkerPress,
}) {
  const [region, setRegion] = useState(initMapRegion);

  useEffect(() => {
    if (userLocation) {
      if (stateShortToLong(userRegion) !== selectedTherapist.state) {
        setRegionToTherapistRegion(selectedTherapist);
      } else {
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        });
      }
    } else {
      setRegionToTherapistRegion(selectedTherapist);
    }
  }, [markers, selectedTherapist]);

  const setRegionToTherapistRegion = async (therapist) => {
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
  }


  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
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
              {selectedTherapist && marker.therapistId == selectedTherapist.therapist_id ? (
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
});

export default AthleteMapView;
