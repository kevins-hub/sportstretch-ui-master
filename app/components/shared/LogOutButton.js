import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../config/colors';
import AuthContext from '../../auth/context';

function LogOutButton() {
    const authContext = useContext(AuthContext);

    const logOutUser = async() => {
        authContext.setUser(null);
    }
    
    return (
        <TouchableOpacity style={styles.button} onPress={logOutUser}>
            <View >
                <Text style={styles.text}>Log Out</Text>
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

export default LogOutButton;