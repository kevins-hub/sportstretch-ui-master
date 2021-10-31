import React from 'react';
import { View,StyleSheet,Text, ActivityIndicator} from 'react-native';
import { Rating } from 'react-native-ratings';

import colors from '../../config/colors';
import BookButton from './BookButton';


function AthleteBookNowCard({fname='Emma',therapistId = 4,city ='Buffalo',state = 'New York',avgRating=4.5}) {
    return (
        <View style = {styles.OuterContainer}>
            <View style= {styles.Container}>
                <View style= {styles.TherapistContainer}>
                    <View style={styles.TherapistNameContainer}>
                        <Text style={styles.TherapistNameText}>{fname} XXXX</Text>
                        <Text style={{fontSize:15, color: colors.dullblack}}>{city}, {state}</Text>
                    </View>
                    <View style = {styles.RatingContainer}>
                            <Text style={{fontSize:25, color: colors.gold}}>{avgRating}</Text>
                            <Rating imageSize={15} readonly startingValue={avgRating} />
                        
                    </View>
                   
                </View>
                
                <View>
                    <View style= {styles.BookButtonContainer}>
                        <BookButton onPress={() => {
                                    alert('Your Booking with '+ therapistId +' is in Progress!');}} title={'Book'}> 
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