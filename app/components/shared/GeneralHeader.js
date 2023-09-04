import React, { useContext } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import {MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons'
import Constants from 'expo-constants';
import Stars from 'react-native-stars';
import colors from '../../config/colors';
import AuthContext from '../../auth/context';
import { Image } from 'react-native';

function GeneralHeader(props) {
    const { user, setUser } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.detailsContainer}>
                <Image source= {require("../../assets/logo_crop.png")} style={styles.logo}/>
                <Text style={styles.nameText}>Welcome, {user.userObj.first_name}</Text>
            </View>
            { user.role === 'therapist' &&

                <View style={styles.starsContainer}>
                    <Stars
                        default={parseFloat(user.userObj.avg_rating)}
                        half={true}
                        starSize={40}
                        disabled
                        fullStar={
                        <FontAwesome
                            name={'star'}
                            style={{ color: colors.gold}}
                            size={18}
                        />
                        }
                        halfStar={
                        <FontAwesome 
                            name="star-half-empty"
                            style={{ color:colors.gold}}
                            size={18}
                        />
                        }
                        emptyStar={
                        <FontAwesome
                            name={"star-o"}
                            style={{ color:colors.secondary}}
                            size={18}
                        />
                        }
                />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.primary,
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        alignItems: 'center',

    },
    detailsContainer: {
        width: '100%',
        paddingLeft: 10,
        paddingVertical: 2,
    },
    starsContainer: {
        marginLeft: -96,
        backgroundColor: colors.primary,

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
export default GeneralHeader;