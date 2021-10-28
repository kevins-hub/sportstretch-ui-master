import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AthleteNavigator from '../../navigation/AthleteNavigator';
import AthleteHeader from '../../components/athlete/AthleteHeader';

function AthleteDashboard(props) {
    return (<>
        <AthleteHeader/>
        <NavigationContainer>
            <AthleteNavigator/>
        </NavigationContainer>
    </>
    );
}

export default AthleteDashboard;