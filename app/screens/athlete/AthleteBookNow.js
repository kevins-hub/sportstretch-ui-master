import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import * as Location from 'expo-location';

import AthleteBookNowCard from '../../components/athlete/AthleteBookNowCard';
import AthleteMapView from '../../components/athlete/AthleteMapView';

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
        therapistId: 23

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
            aptNum: "3",
            state: "New York",
            zipcode: "14214",
            city: "Buffalo"

        },
        availabilityStatus: true,
        enabledStatus: 1,
        avgRating: 4.6,
        therapistId: 23

    },
]

function AthleteBookNow(props) {
    const [selectedTherapist, setSelectedTherapist] = useState(therapists[0]);
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState(null);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
        //   if (status !== 'granted') {
        //     //setErrorMsg('Permission to access location was denied');
        //   Something to think about: Location.getLastKnownPositionAsync(options)
        //     return;
        //   }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);

          let promises = therapists.map(async therapist => {
            let locPromise = await Location.geocodeAsync(therapist.address.street + ' ' + therapist.address.city + ' ' + therapist.address.state);
            return locPromise[0];
          })
        
          let results = await Promise.all(promises)
          setMarkers(results);
          //console.log(results);
        })();
      }, []);

    return (
        <View style={{flex:1, marginBottom: 20,}}>
            <AthleteMapView markers={markers} selectedTherapist={selectedTherapist} userLocation={location}/>
            <AthleteBookNowCard></AthleteBookNowCard>
        </View>
    );
}

export default AthleteBookNow;