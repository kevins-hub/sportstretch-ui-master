import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import MapView, { Marker } from 'react-native-maps';
import colors from '../../config/colors';

function AthleteMapView({markers, selectedMarker, userLocation}) {
    const [region, setRegion] = useState({
        latitude: 39.129065,
        longitude: -95.141081,
        latitudeDelta: 55,
        longitudeDelta: 55
      });

      useEffect(() => {
        setRegion({
            latitude: userLocation? userLocation.coords.latitude: 39.129065,
            longitude: userLocation? userLocation.coords.longitude: -95.141081,
            latitudeDelta: userLocation? 0.1 : 55,
            longitudeDelta: userLocation? 0.1 : 55});
      }, [markers]);

    return (
        <View style={styles.container}>
            <MapView showsUserLocation style={styles.map} 
            region={region}
            onRegionChangeComplete={region => setRegion(region)}>
            {markers && markers.map((marker, index) => (
               <Marker 
               key={index}
               coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
                   <FontAwesome5 name="map-marker-alt" size={40} color={colors.primary} />
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