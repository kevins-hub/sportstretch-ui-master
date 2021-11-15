import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View,StyleSheet,Text } from 'react-native';
import { Rating } from 'react-native-ratings';

import colors from '../../config/colors';
import BookButton from './BookButton';

function AthleteBookNowCard({selectedTherapist}) {
    const navigation = useNavigation();

    return (
        <View style = {styles.OuterContainer}>
            <View style= {styles.Container}>
                <View style= {styles.TherapistContainer}>
                    <View style={styles.TherapistNameContainer}>
                        <Text style={styles.TherapistNameText}>{selectedTherapist.fname} XXXXX</Text>
                        <Text style={{fontSize:15, color: colors.dullblack}}>{selectedTherapist.address.city}, {selectedTherapist.address.state}</Text>
                    </View>
                    <View style = {styles.RatingContainer}>
                            <Text style={{fontSize:25, color: colors.gold}}>{selectedTherapist.avgRating}</Text>
                            <Rating imageSize={15} readonly startingValue={selectedTherapist.avgRating} />
                    </View>
                </View>
                <View>
                    <View style= {styles.BookButtonContainer}>
                        <BookButton onPress={() => {
                                    alert('Your Booking with '+ selectedTherapist.therapistId +' is in Progress!');
                                    navigation.navigate("UpcomingBooking");
                                    
                                }} 
                                    title={'Book'}> 
                        </BookButton>
                    </View>
                </View>
            </View> 
        </View>    
    );
}

const styles = StyleSheet.create({
    OuterContainer: {
        padding: 10,
    },

    Container:{
        backgroundColor: colors.secondary,
        borderRadius: 15,
        shadowColor: colors.grey,
        shadowOffset: {width:0, height:5},
        shadowOpacity: 1,
        width: '100%',
        height:140,
        padding: 10,

    },

    TherapistContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,

    },

    TherapistNameContainer:{
        flex: 1,
        
    },


    RatingContainer:{
       flex: 0.5, 
       alignItems: 'center',
       
    },

    DetailContainer:{
        flex: 2,
        
    },

    BookButtonContainer:{
        alignItems: 'flex-end',
        marginTop: 5,
        marginRight: 5,
       
    },

    TherapistNameText: {
        fontSize: 25,
        fontWeight: '400',
        color: colors.dullblack, 
        
    },
    
})

export default AthleteBookNowCard;