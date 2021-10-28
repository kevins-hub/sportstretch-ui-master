import React from 'react';
import { View } from 'react-native';

import AthleteBookNowCard from '../../components/athlete/AthleteBookNowCard';
import AthleteMapView from '../../components/athlete/AthleteMapView';

console.log('in Book Now')
function AthleteBookNow(props) {
    return (
        <View style={{flex:1,marginBottom: 20,}}>
            <AthleteMapView/>
            <AthleteBookNowCard></AthleteBookNowCard>
        </View>
    );
}

export default AthleteBookNow;