import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../config/colors';
import passwordApi from '../../api/password';
import { useNavigation } from '@react-navigation/native';

function ChangePasswordButton() {

    const navigation = useNavigation();

    const routeToChangePassword = () => {
        navigation.navigate("ChangePassword");
    }
    
    return (
        <TouchableOpacity style={styles.button} onPress={routeToChangePassword}>
            <View >
                <Text style={styles.text}>Change Password</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button : {
        backgroundColor: colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: 110,
        height: 46,
        margin: 5,
    },

    text: {
        color: colors.secondary,
        fontSize: 18,
        
    }
})

export default ChangePasswordButton;