import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import * as Location from 'expo-location';

import AthleteBookNowCard from '../../components/athlete/AthleteBookNowCard';
import AthleteMapView from '../../components/athlete/AthleteMapView';
import therapistsApi from '../../api/therapists';

const therapists = [
    {
        email: "",
        fname: "Roger",
        lname: "Apples",
        mobile: "7164578324",
        address: {
            street: "112 Callodine Avenue",
            aptNum: "3",
            state: "New York",
            zipcode: "14214",
            city: "Buffalo"

        },
        availabilityStatus: true,
        enabledStatus: 1,
        avgRating: 4.2,
        therapistId: 27

    },
    {
        email: "",
        fname: "Joseph",
        lname: "Oranges",
        mobile: "7164578324",
        address: {
            street: "12 Robin Road",
            aptNum: "Upper",
            state: "New York",
            zipcode: "14214",
            city: "Buffalo"

        },
        availabilityStatus: true,
        enabledStatus: 1,
        avgRating: 3.45,
        therapistId: 23

    },
    {
        email: "",
        fname: "Rachel",
        lname: "Green",
        mobile: "7164578324",
        address: {
            street: "34 Spruce Road",
            aptNum: "45",
            state: "New York",
            zipcode: "14214",
            city: "Buffalo"

        },
        availabilityStatus: true,
        enabledStatus: 1,
        avgRating: 4.6,
        therapistId: 13

    },
]

function AthleteBookNow(props) {
    const [therapistsFromApi, setTherapistsFromApi] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState(therapists[0]);
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
          setTherapistsFromApi(response.data);
          return response.data;
    }

    const loadMarkers = async (therapistsFromApi) => {
        console.log(therapistsFromApi);
        let promises = therapists.map(async therapist => {
            let locPromise = await Location.geocodeAsync(therapist.address.street + ' ' + therapist.address.city + ' ' + therapist.address.state);
            return {...locPromise[0], therapistId : therapist.therapistId};
          })
        
          let results = await Promise.all(promises);
          setMarkers(results);
    }

    useEffect(() => {
        (async () => {
            try {
                let athleteLocation = await loadLocation();
                let athleteRegion = await getAthleteRegion(athleteLocation);
                let therapistsFA = await getTherapists(athleteRegion);
                await loadMarkers(therapistsFA);
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