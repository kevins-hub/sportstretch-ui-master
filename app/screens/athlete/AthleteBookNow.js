import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import * as Location from 'expo-location';

import AthleteBookNowCard from '../../components/athlete/AthleteBookNowCard';
import AthleteMapView from '../../components/athlete/AthleteMapView';
import therapistsApi from '../../api/therapists';


function AthleteBookNow(props) {
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState(null);
    const [location, setLocation] = useState(null);
    const [athleteRegion, setAthleteRegion] = useState(null);
    const [markers, setMarkers] = useState(null);

    const loadLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted')
            return;
    
        let athleteLocation = await Location.getCurrentPositionAsync({});
        setLocation(athleteLocation);
        return athleteLocation;
    }

    const getAthleteRegion = async (athleteLocation) => {
        let athleteRegion = await Location.reverseGeocodeAsync(athleteLocation.coords);
        setAthleteRegion(athleteRegion[0].region);
        return athleteRegion[0].region;
    }

    const getTherapists = async (athleteRegion) => {
          let response = await therapistsApi.getNearbyTherapists(athleteRegion);
          setTherapists(response.data);
          return response.data;
    }

    const loadMarkers = async (therapists) => {
        let promises = therapists.map(async therapist => {
            let locPromise = await Location.geocodeAsync(therapist.street + ' ' + therapist.city + ' ' + therapist.state);
            return {...locPromise[0], therapistId : therapist.therapist_id};
          })
        
          let results = await Promise.all(promises);
          setMarkers(results);
    }

    useEffect(() => {
        (async () => {
            try {
                let athleteLocation = await loadLocation();
                let athleteRegion = await getAthleteRegion(athleteLocation);
                let therapists = await getTherapists(athleteRegion);
                setSelectedTherapist(therapists[0]);
                await loadMarkers(therapists);
            }
            catch (err) {
                console.log('Error', err.message);
            }
        })();
      }, []);

    handleMarkerPress = (event) => {
        setSelectedTherapist(therapists[event._targetInst.return.key]);
    }

    return (
        <View style={{flex:1, marginBottom: 20,}}>
            <AthleteMapView markers={markers} selectedTherapist={selectedTherapist} userLocation={location} onMarkerPress={handleMarkerPress}/>
            <AthleteBookNowCard selectedTherapist={selectedTherapist}></AthleteBookNowCard>
        </View>
    );
}

export default AthleteBookNow;