import React, { useContext } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import {MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons'
import Constants from 'expo-constants';

import colors from '../../config/colors';
import AuthContext from '../../auth/context';
import { Image } from 'react-native';

function AthleteHeader(props) {
    const { user, setUser } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.detailsContainer}>
                <Image source= {require("../../assets/logo_crop.png")} style={styles.logo}/>
                <Text style={styles.nameText}>Welcome, {user.userObj.first_name}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.primary,
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,

    },
    detailsContainer: {
        width: '100%',
        paddingLeft: 10,
        paddingVertical: 2,
    },
    nameText: {
        color: colors.secondary,
        fontWeight: "300",
        fontSize: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 8,
    },
    logo: {
        width: 30,
        height: 30,
        margin: 4,
        position: 'absolute',
        left: 0,
    }
})
export default AthleteHeader;