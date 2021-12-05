import React from 'react';
import { Formik } from 'formik';
import {Text, TextInput, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome,FontAwesome5,MaterialCommunityIcons,SimpleLineIcons } from '@expo/vector-icons';
import * as yup from 'yup';
import "yup-phone";
import Constants from "expo-constants";
import colors from '../../config/colors';
import { useNavigation } from "@react-navigation/native";
import registerApi from '../../api/register';



const ReviewSchema = yup.object({
    fname : yup.string().required().min(1).label("First Name"),
    lname : yup.string().required().min(1).label("Last Name"),
    email : yup.string().required().email().label("Email"),
    password : yup.string().required().min(6).label("Password"),
    phone: yup.string().phone().required().label("Phone"),
    addressL1 : yup.string().required().label("Street Address"),
    addressL2 : yup.string().label("Address Line 2"),
    city : yup.string('City must be string').required('City is required').label("City"),
    state : yup.string('State must be string').required('State is required').label("State"),
    zipcode : yup.string().required().min(5).label("ZipCode")

})

function TherapistForm(props){
    const navigation = useNavigation();
    const register_therapist = async(values) => {
        let register_response = await registerApi.registerTherapist(values);
        register_response.status === 200 ? navigation.navigate("TherapistRegistrationPending") : Alert.alert("Error while registration. Please try again.")
    }

    return (
       <ScrollView style={styles.container}>
           <View style={styles.header}>
               <Image source= {require("../../assets/logo_crop.png")} style={styles.logo}/>
               <Text style={styles.headerText}>Recovery On The Go</Text>
           </View>
           <Text style={styles.accountText}>Create your account</Text>
           <Formik
           initialValues={{fname:"" , lname:'' ,email :'', phone:'', 
           password:'' , addressL1:'', addressL2:'', city:'', state:'' , zipcode:''}}
           validationSchema={ReviewSchema}
           onSubmit={(values,actions) => {
               register_therapist(values)
               actions.resetForm()
           }}
           >
            {(props) => (
                <View>
                    <View style={styles.inputContainer}>
                        <View>
                        <FontAwesome5 name="user-alt" size={16} color="black" 
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="First Name"
                    onChangeText={props.handleChange('fname')}
                    value={props.values.fname}
                    onBlur={props.handleBlur('fname')}
                    textContentType="givenName"
                    />
                    </View>
                    <Text style={styles.errorText}> { props.touched.fname && props.errors.fname}</Text>
                    <View style={styles.inputContainer}>
                        <View>
                        <FontAwesome5 name="user-alt" size={16} color="black" 
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="Last Name"
                    onChangeText={props.handleChange('lname')}
                    value={props.values.lname}
                    onBlur={props.handleBlur('lname')}
                    textContentType="familyName"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.lname && props.errors.lname}</Text>
                    
                    <View style={styles.inputContainer}>
                        <View>
                        <MaterialCommunityIcons name="email-open" size={16} color="black" 
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="Email"
                    onChangeText={props.handleChange('email')}
                    value={props.values.email}
                    keyboardType= "email-address"
                    onBlur={props.handleBlur('email')}
                    textContentType="emailAddress"
                    autoCorrect={false}
                    autoCapitalize= "none"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.email && props.errors.email}</Text>

                    <View style={styles.inputContainer}>
                        <View>
                        <MaterialCommunityIcons name="key-variant" size={16} color="black" 
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    autoCorrect={false}
                    autoCapitalize= "none"
                    placeholder="Password"
                    onChangeText={props.handleChange('password')}
                    value={props.values.password}
                    keyboardType="visible-password"
                    onBlur={props.handleBlur('password')}
                    textContentType="newPassword"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.password && props.errors.password}</Text>


                    <View style={styles.inputContainer}>
                        <View>
                        <MaterialCommunityIcons name="phone" size={16} color="black" 
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="Phone"
                    onChangeText={props.handleChange('phone')}
                    value={props.values.phone}
                    keyboardType="phone-pad"
                    onBlur={props.handleBlur('phone')}
                    textContentType="telephoneNumber"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.phone && props.errors.phone}</Text>
    
                   
                    <View style={styles.inputContainerAddress}>
                        <View>
                        <FontAwesome name="address-book" size={16} color="black"
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="Street Address"
                    onChangeText={props.handleChange('addressL1')}
                    value={props.values.addressL1}
                    onBlur={props.handleBlur('addressL1')}
                    textContentType="streetAddressLine1"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.addressL1 && props.errors.addressL1}</Text>

                    <View style={styles.inputContainerAddress}>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="Apt, Suite, Floor, Building"
                    onChangeText={props.handleChange('addressL2')}
                    value={props.values.addressL2}
                    onBlur={props.handleBlur('addressL2')}
                    textContentType="streetAddressLine2"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.addressL2 && props.errors.addressL2}</Text>

                    <View style={styles.inputContainerCityState}>
                    <View style={{width: "45%"}}>
                    <View style={styles.inputContainerCity}>
                        <View>
                        <MaterialCommunityIcons name="city" size={16} color="black" 
                        style={{paddingRight:'5%'}}/>
                        </View>
                        <TextInput
                        placeholder="City"
                        onChangeText={props.handleChange('city')}
                        value={props.values.city}
                        onBlur={props.handleBlur('city')}
                        textContentType="addressCity"
                        />
                    </View>
                    <Text style={styles.errorTextCityState}> {props.touched.city && props.errors.city}</Text>
                    </View>
                    
                    <View style={{marginHorizontal: "10%", width: "45%"}} >
                    <View style={styles.inputContainerState}>
                    <TextInput
                    placeholder="State"
                    onChangeText={props.handleChange('state')}
                    value={props.values.state}
                    onBlur={props.handleBlur('state')}
                    textContentType="addressState"
                    />
                    </View>
                    <Text style={styles.errorTextCityState}> {props.touched.state && props.errors.state}</Text>
                    </View>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <View>
                        <SimpleLineIcons name="location-pin" size={16} color="black"
                        style={{paddingRight:'5%'}}/>
                        </View>
                    <TextInput
                    style={{flex:1,flexWrap:'wrap'}}
                    placeholder="Zipcode"
                    onChangeText={props.handleChange('zipcode')}
                    value={props.values.zipcode}
                    onBlur={props.handleBlur('zipcode')}
                    textContentType="postalCode"
                    />
                    </View>
                    <Text style={styles.errorText}> {props.touched.zipcode && props.errors.zipcode}</Text>

                    <TouchableOpacity style={styles.button} onPress={props.handleSubmit}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

            )}

           </Formik>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    accountText:{
        fontSize: 25,
        color: colors.dullblack,
        marginBottom: "5%",
        textAlign: "center"
        
    },
    button:{
        backgroundColor: colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '30%',
        marginVertical: 10,
        marginLeft: "35%",
        marginBottom: 50
    },
    buttonText:{
        color: colors.secondary,
        fontSize: 18,
        fontWeight: 'bold'
    },
    container:{
        paddingTop: Constants.statusBarHeight,
        flex:1,
    },
    header:{
        flexDirection:"row",
        width: "100%",
        height: 100,
        backgroundColor:colors.primary,
        marginBottom:"5%",
        justifyContent: "center",
        alignItems: "center",
        // borderRadius:25,
        // borderTopStartRadius: 25,
        // borderTopEndRadius:25
    },
    headerText:{
        color:colors.secondary,
        fontSize:16,
        marginLeft:"0%",
        fontWeight:"bold",
    },
    errorText:{
        marginHorizontal:"5%",
        padding:"1%",
        color: colors.grey,
        fontWeight:"bold",
        fontSize:15
    },
    errorTextCityState:{
        marginHorizontal:"5%",
        padding:"2%",
        color: colors.grey,
        fontWeight:"bold",
        fontSize:15
    },
    inputContainer:{
        flexDirection:'row',
        borderWidth:1,
        borderRadius:15,
        padding:'2%',
        marginHorizontal:"10%"
    },
    inputContainerAddress:{
        flexDirection:'row',
        borderBottomWidth:1,
        paddingHorizontal:'2%',
        paddingBottom: '2%',
        marginHorizontal:"10%"
    },
    inputContainerCity: {
        flexDirection:'row',
        borderWidth:1,
        borderRadius:15,
        paddingVertical:'4%',
        paddingHorizontal:"2%",
    },
    inputContainerCityState:{
        flexDirection:'row',
        marginHorizontal:"10%"
    },
    inputContainerState: {
        borderWidth:1,
        borderRadius:15,
        paddingVertical:'4%',
        paddingHorizontal:"7%",
    },
    logo: {
        flex: 0.3,
        resizeMode: 'contain'
    }
    
})

export default TherapistForm;