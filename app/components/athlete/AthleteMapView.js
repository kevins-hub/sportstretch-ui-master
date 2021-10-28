import React from 'react';
import { View, StyleSheet } from 'react-native';

import MapView from 'react-native-maps';

function AthleteMapView(props) {
    return (
        <View style={styles.container}>
            <MapView style={styles.map} />
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