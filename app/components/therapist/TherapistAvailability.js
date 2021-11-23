import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,SafeAreaView, Switch, Image} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


function TherapistAvailability(props) {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isAvailable,setIsAvailable] = useState(() => {
    return(
    <View style={styles.available}>
        <Image source= {require("../../assets/available.jpeg")}style={styles.locationImage}/>
        <View style={styles.currentLocation}>
          <Text style={styles.locationText}>Amherst,Buffalo</Text>
          <Text style={styles.textFont}>Atheles will connect to you </Text>
        </View>
      </View>
    )
  })

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    }
   
    useEffect(() => {       //runs when page re-renders or songs change but not for age 
    setIsAvailable(() => {
      return isEnabled ? ( 
        <View style={styles.available}>
          <Image source= {require("../../assets/available.jpeg")}style={styles.locationImage}/>
          <View style={styles.currentLocation}>
            <Text style={styles.locationText}>Amherst,Buffalo</Text>
            <Text style={styles.textFont}>Athletes will connect to you </Text>
            </View>
        </View>
      ) : (<View>
      <Text style={styles.unavailableText}>You are unavailable to athletes</Text>
      <View style={styles.unavailableIcon}>
        <MaterialCommunityIcons name="map-marker-off"  size={35} color="#959595"/>
      </View>
    </View>)
    })
    },[isEnabled]);

    return (
        <View>
            {isAvailable}
            <View style={styles.availabilityContainer}>
            <Text style={styles.toggleText}>Availability</Text>
            <View style={styles.availabilityToggle}>
            <Switch
                trackColor={{ false: "#C4C4C4", true: "black" }}
                thumbColor="white"
                ios_backgroundColor="white"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
            </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  available:{
    backgroundColor:"white",
    width : 390,
    height : 50,
    // flex:1,
    flexDirection:"row",
    // position:"relative"
    // justifyContent:""


  },
  availabilityContainer:{
    flexDirection:"row",
    left: 220,
    paddingBottom:60

  },
  availabilityToggle:{
    width: 49,
    height: 26,
    top: 37,
    right: -50
  },
  currentLocation:{
    top:10,
    paddingLeft:10
  },
  locationImage:{
    width: 50,
    height:50,
    top: 10,
  },
  locationText:{
    // fontFamily:"",
    fontWeight:'300',
    fontSize:24,
    
  },
  toggleText:{
    color: "#959595",
    fontWeight:"300",
    fontSize: 16,
    top: 42,
    left: 30,
    width: 75,
    height: 22
  },
  unavailableIcon:{
    width: 35,
    height: 35.26,
    top: 0,
    left: 16
  },
  unavailableText:{
      // fontFamily: "OpenSans",
      color:"#5F5F5F",
      fontWeight: "400",
      fontSize: 18,
      top: 25,
      left: 64
  },
  textFont:{
    // fontFamily: 'Open Sans Bold', 
    fontWeight: '400',
    fontSize: 14,

  },
  
})
export default TherapistAvailability;