import React from 'react';
import { View,StyleSheet,Text} from 'react-native';

import colors from '../../config/colors';
import BookButton from './BookButton';

function AthleteBookNowCard(props) {
    return (
        <View style = {styles.OuterContainer}>
            <View style= {styles.Container}>
                <View style={styles.TherapistNameContainer}>
                    <Text style={styles.TherapistNameText}>Emma XXXX</Text>
                </View>
                <View style = {styles.TherapistDetailContainer}>
                    <View style = {styles.RatingContainer}>
                        <Text style={{fontSize:28, color: colors.gold}}>4.5</Text>
                        <Text style={{fontSize:20, color: colors.gold}}>*****</Text>
                    </View>
                    <View style = {styles.DetailContainer}>
                        <Text style={{fontSize:20, color: colors.dullblack}}>Buffalo</Text>
                        <Text style={{fontSize:15, color: colors.dullblack}}>New York</Text>
                    </View>
                </View>
                <View style= {styles.BookButtonContainer}>
                    <BookButton onPress={() => {
                                alert('Your Booking is in Progress!');}} title={'Book'}>

                    </BookButton>
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
        height:180,
        padding: 10,

    },

    TherapistNameContainer:{
        flex: 1,
        padding: 8,
    },

    TherapistDetailContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
    },

    RatingContainer:{
        flex: 1,
        alignItems: 'center',
        
    },

    DetailContainer:{
        flex: 3,
        
    },

    BookButtonContainer:{
        flex: 1,
        alignItems: 'flex-end',
        marginBottom: 10,
        padding: 10,
        
    },

    TherapistNameText: {
        fontSize: 25,
        fontWeight: '400',
        textAlign: 'left', 
        color: colors.dullblack, 
        padding: 5,
    },
    
})

export default AthleteBookNowCard;