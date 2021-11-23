import React, { useState } from 'react';

import { Text, View ,StyleSheet} from 'react-native';
import colors from '../../config/colors';

function TherapistUpcomingCard({bookingDate,atheleteName,bookingId,location,status}) {
    return (
        <View style={styles.outerContainer}>
            <View style={styles.card}>
                <View style={styles.date}>
                    <Text style={styles.dateTextMonth}>{bookingDate.month}</Text>
                    <Text style={styles.dateTextNumber}>{bookingDate.date}</Text>
                </View>

                <View style={styles.verticalLine}></View>

                <View style={styles.rightContainer}>
                        <View style={styles.right}>
                            <View style={styles.staticText}>
                                <Text style={styles.staticLabel}>Athelete</Text>
                            </View>
                            <View style={styles.dynamicText}>
                                <Text style={styles.dynamicTextFontName}>{atheleteName}</Text>
                            </View>
                        </View>
                        <View style={styles.right}>
                            <View style={styles.staticText}>
                                <Text style={styles.staticLabel}>Booking Id</Text>
                            </View>
                            <View style={styles.dynamicText}>
                                <Text style={styles.dynamicTextFont}>{bookingId}</Text>
                            </View>
                        </View>
                        <View style={styles.right}>
                            <View style={styles.staticText}>
                                <Text style={styles.staticLabel}>Location</Text>
                            </View>
                            <View style={styles.dynamicText}>
                                <Text style={styles.dynamicTextFont}>{location.line1}</Text>
                                <Text style={styles.dynamicTextFont}> {location.line2}</Text>
                                <Text style={styles.dynamicTextFont}>{location.line3}</Text>
                            </View>
                        </View>
                        <View style={styles.right}>
                            <View style={styles.staticText}>
                                <Text style={styles.staticLabel}>Booking Status</Text>
                            </View>
                            <View style={styles.dynamicText}>
                                <Text style={styles.dynamicTextFont}>{status}</Text>
                            </View>
                        </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer:{
        padding: 10,
    },
    card:{
        
        backgroundColor: colors.secondary,
        borderRadius: 15,
        flexDirection: 'row',
        shadowColor: colors.grey,
        shadowOffset: {width:0, height:5},
        shadowOpacity: 1,
        width: '100%',
        height:150,
        padding: 10, 
        justifyContent:'center',
        alignItems:'center'
    
        

         
    },
    
    date:{
        width:'25%',
        alignItems:'center',
        justifyContent:'center'

    },
    dateTextMonth:{
        fontWeight:'400',
        fontSize:24
    },
    dateTextNumber:{
        fontWeight:"400",
        fontSize:22,
        top:'5%'
    },

    dynamicText :{
        fontWeight:"bold",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap:'wrap',
    },
    dynamicTextFontName:{
        fontWeight:"300",
        fontSize:17,
        
    },
    dynamicTextFont:{
        fontWeight:"300",
        fontSize:14,
        color:"#383838",
        flexWrap:'wrap'
       
    },
    
    staticText:{
        width:"40%",
        margin:'2%',
        
    },
    staticLabel:{
        fontWeight:'300',
        fontSize:14,
        color:'#5f5f5f'
    },
    right:{
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"center"
    },
    rightContainer:{
        alignItems:"flex-start",
        justifyContent:"flex-start",
        flexShrink:1,
    },
    verticalLine: {
        backgroundColor: colors.silver,
        height: '90%',
        marginTop: 15,
        width: 1,
        
    }
})

export default TherapistUpcomingCard;
