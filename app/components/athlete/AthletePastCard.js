import React from 'react';
import { View,StyleSheet,Text } from 'react-native';
import { Rating } from 'react-native-ratings';

import colors from '../../config/colors';
import ratingsApi from '../../api/ratings';


function AthletePastCard({BookingMonth, BookingDay, fname, bookingId, therapistId, starRating}) {
    const finishRating = async (rating) => {
        alert('Thank you for rating!');
        if (starRating) await ratingsApi.updateRating(bookingId, { starrating : rating });
        
        else await ratingsApi.rateBooking({
            bookings_id : bookingId, 
            therapist_id : therapistId, 
            starrating : rating
        });
    }

    return (
        <View style = {styles.OuterContainer}>
            <View style = {styles.Container} >
                
                    <View style = {styles.BookingDateContainer} >
                        <Text style ={styles.DateMonth}>{BookingMonth}</Text>
                        <Text style ={styles.DateDay}>{BookingDay}</Text>
                    </View>

                    <View style={styles.VerticalLine}></View>

                    <View style = {styles.BookingDetailsContainer}>
                        
                        <View style = {styles.DetailsContainer}>
                            <Text >Therapist : </Text> 
                            <Text>{fname}</Text> 
                        </View>
                        <View style = {styles.DetailsContainer}>
                            <Text >Booking ID : </Text> 
                            <Text>{bookingId}</Text> 
                        </View>
                        <View style = {styles.DetailsContainer}>
                            <Text></Text>
                            <Rating
                                startingValue = {starRating}
                                imageSize = {20}
                                jumpValue = {0.5}
                                onFinishRating ={finishRating}
                            />
                            
                        </View>
                    </View>
                
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    
    OuterContainer:{
        padding: 10,
    },

    Container: {
        backgroundColor: colors.secondary,
        borderRadius: 15,
        flexDirection: 'row',
        shadowColor: colors.grey,
        shadowOffset: {width:0, height:5},
        shadowOpacity: 1,
        width: '100%',
        height:150,
        padding: 10,
        
    },

    BookingDateContainer: {
        flex: 0.25,
        alignItems: 'center',
        justifyContent: 'center',

    },

    BookingDetailsContainer: {
        flex: 0.75,
        justifyContent: 'center',
        paddingLeft: 10,
    },

    DateDay: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '400',
        
    },

    DateMonth: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '400',
        
    },

    DetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        overflow: 'hidden',
        
    },

    VerticalLine: {
        backgroundColor: colors.silver,
        height: '80%',
        marginTop: 15,
        width: 1,
        
    }
    
})

export default AthletePastCard;