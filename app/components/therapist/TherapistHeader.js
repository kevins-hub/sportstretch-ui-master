import React from 'react';
import { Text,View, StyleSheet } from 'react-native';
import {MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons'

function TherapistHeader(props) {
    return (
        <View style={styles.infoContainer}>
         <View style={styles.info}>
           <Text style={styles.infoText}>Hi, David</Text>
           <View style={styles.phoneContainer}>
            <Text style={styles.contactText}>7167654321</Text>
            {/* <MaterialCommunityIcons name="circle-edit-outline" size={24} color="white" /> */}
            </View>
         </View>
         <View style={styles.profile}>
          {/* <FontAwesome name="user-circle" size={100} color="white" /> */}
         </View>
       </View>
    );
}

const styles = StyleSheet.create({
    contactText:{
        top: 25,
        left: 15,
        color:"white",
        fontSize: 20,
        fontWeight: "300"
    },
    info:{
        flexDirection: "column",
        // flexBasis: 100,
      },
      infoContainer:{
        backgroundColor:"black",
        flexDirection: "row",
        // flexBasis: 100,
        width:'100%',
        height:113,
        // flex:0.5,
        
      },
      infoText:{
        color: "white",
        fontSize: 36,
        fontWeight: "300",
        top: 27,
        left: 15
      },
      phoneContainer: {
        marginVertical:7,
        flexDirection: 'row',
    },
      profile:{
        width:73,
        height:80,
        left: 200,
        top: 20
      },
})
export default TherapistHeader;