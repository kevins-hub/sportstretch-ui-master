import React,{ useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View ,SafeAreaView, Switch, Image, Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import therapistsApi from '../../api/therapists';
import AuthContext from '../../auth/context';

function TherapistAvailability(props) {
    const { user, setUser } = useContext(AuthContext);

    const [isEnabled, setIsEnabled] = useState(user.userObj.status);

    const setAvailabilityStatus = () => {
      return isEnabled ? ( 
        <View style={styles.availabilityContainer}>
          <Image source= {require("../../assets/available.jpeg")}style={styles.locationImage}/>
          <View style={styles.currentLocation}>
            <Text style={styles.locationText}>{user.userObj.city}, {user.userObj.state}</Text>
            <Text style={styles.textFont}>Athletes will connect to you </Text>
            </View>
        </View>
      ) : (<View style={ styles.availabilityContainer}>
        <View style={styles.unavailableIcon}>
          <MaterialCommunityIcons name="map-marker-off"  size={35} color="#959595"/>
        </View>
        <Text style={styles.unavailableText}>You are unavailable to athletes</Text>
      
    </View>)
    }

    const [isAvailable,setIsAvailable] = useState(
      setAvailabilityStatus
    )

    const toggleSwitch = async() => {
      let avail_status= await therapistsApi.setAvailability(user.userObj.therapist_id, { availability_status : !isEnabled });
      avail_status.data.availability_status==!isEnabled? setIsEnabled(previousState => !previousState): Alert.alert("Error while updating availability. Please try again.")   
    }

   
    useEffect(() => {       //runs when page re-renders or songs change but not for age 
    setIsAvailable(
      setAvailabilityStatus
    )
    },[isEnabled]);

    return (
        <View style={{ marginTop: 10}}>
            {isAvailable}
            <View style={styles.availabilityToggleContainer}>
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
  availabilityContainer:{
    backgroundColor:"white",
    // width : 390,
    // height : 50,
    flexDirection:"row",
    height: 50,
    marginLeft: 5

    // position:"relative"
    // justifyContent:""


  },
  availabilityToggleContainer:{
    flexDirection:"row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20
    // right: -180
    // paddingBottom:60

  },
  availabilityToggle:{
    // width: 49,
    // height: 26,
    // top: 37,
    // right: -50
    marginLeft: 10,
    marginRight: 20
  },
  currentLocation:{
    // top:10,
    // paddingLeft:10
  },
  locationImage:{
    width: 50,
    height:50,
    // top: 10,
  },
  locationText:{
    fontWeight:'300',
    fontSize:24,
    
  },
  toggleText:{
    color: "#959595",
    fontWeight:"300",
    fontSize: 16,
    // top: 42,
    // left: 30,
    // width: 75,
    // height: 22
  },
  unavailableIcon:{
    // width: 35,
    // height: 35.26,
    // top: 0,
    // left: 16
    paddingTop: 10
  },
  unavailableText:{
      color:"#5F5F5F",
      fontWeight: "400",
      fontSize: 18,
      paddingTop: 15,
      // left: 64
  },
  textFont:{
    // fontFamily: 'Open Sans Bold', 
    fontWeight: '400',
    fontSize: 14,

  },
  
})
export default TherapistAvailability;