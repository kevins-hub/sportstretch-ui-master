import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import MapView, { Marker } from 'react-native-maps';
import colors from '../../config/colors';

const initMapRegion = {
    latitude: 39.129065,
    longitude: -95.141081,
    latitudeDelta: 55,
    longitudeDelta: 55,
}

function AthleteMapView({markers, selectedTherapist, userLocation, onMarkerPress}) {
    const [region, setRegion] = useState(initMapRegion);

      useEffect(() => {
        if (userLocation) {
          setRegion({
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.25,
            longitudeDelta: 0.25
          });
        }
      }, [markers]);

    return (
        <View style={styles.container}>
            <MapView showsUserLocation style={styles.map} 
            region={region}
            onRegionChangeComplete={region => setRegion(region)}>
            {markers && markers.map((marker, index) => (
               <Marker 
               key={index}
               identifier={index.toString()}
               onPress={onMarkerPress}
               coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
                   { marker.therapistId == selectedTherapist.therapist_id ? 
                   <FontAwesome5 name="map-marker-alt" size={60} color={colors.mapred} /> :
                   <FontAwesome5 name="map-marker-alt" size={40} color={colors.primary} />}
               </Marker>
             ))}
            </MapView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderBottomStartRadius: 15,
        borderBottomEndRadius: 15,
        overflow: 'hidden'
      },
      map: {
        width: '100%',
        flex: 1,
      },
})

export default AthleteMapView;