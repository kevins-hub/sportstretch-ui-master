import React from 'react';
import { Formik } from 'formik';
import {Text, TextInput, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5,MaterialCommunityIcons } from '@expo/vector-icons';
import * as yup from 'yup';
import "yup-phone";
import Constants from "expo-constants";
import colors from '../../config/colors';
import registerApi from '../../api/register';
import { useNavigation } from '@react-navigation/core';



const ReviewSchema = yup.object({
    fname : yup.string().required().min(1).label("First Name"),
    lname : yup.string().required().min(1).label("Last Name"),
    email : yup.string().required().email().label("Email"),
    password : yup.string().required().min(6).label("Password"),
    phone: yup.string().phone().required().max(10).label("Phone")
})

function AthleteForm(props){
    const navigation = useNavigation();
    const handleSubmit = async (values) => {
        const athlete = {
            email : values.email,
            firstName : values.fname,
            lastName : values.lname,
            password : values.password,
            mobile : values.phone
        }
        registerApi.registerAthlete(athlete);
        alert('Registration successful.');
        navigation.navigate("Login");
    }

    return (
       <View style={styles.container}>
           <View style={styles.headerConatiner}>
               <Image source= {require("../../assets/logo_crop.png")} style={styles.logo}/>
               <Text style={styles.headerText}>Recovery On The Go</Text>
           </View>
           
           <View style={styles.CaptionContainer}>
                <Text style={styles.accountText}>Create your account</Text>
           </View>

           <Formik
           initialValues={{fname:'' , lname:'' ,email :'', phone:'', 
           password:''}}
           validationSchema={ReviewSchema}
           onSubmit={(values,actions) => {
               handleSubmit(values);
               actions.resetForm();
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
                            placeholder="Password"
                            onChangeText={props.handleChange('password')}
                            value={props.values.password}
                            keyboardType="visible-password"
                            onBlur={props.handleBlur('password')}
                            textContentType="newPassword"
                            autoCapitalize= "none"
                            secureTextEntry={true}
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
                        <TouchableOpacity  onPress={props.handleSubmit}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </View>    
                        </TouchableOpacity>
                </View>

            )}

           </Formik>

        </View>
    )
}

const styles = StyleSheet.create({
    accountText:{
        fontSize: 25,
        color: colors.dullblack,
        //marginBottom: "5%",
        textAlign: "center"
        
    },
    button:{
        backgroundColor: colors.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 15,
        width: '30%',
        margin: 30,
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
    headerConatiner:{
        flexDirection:"row",
        width: "100%",
        height: "15%",
        backgroundColor:colors.primary,
        justifyContent: "center",
        alignItems: "center",
        
    },
    headerText:{
       color:colors.secondary,
        fontStyle: 'italic',
        fontWeight: '500',
        fontSize: 20,
    },
    CaptionContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
        padding: 10,

    },
    errorText:{
        marginHorizontal:"10%",
        padding:"1%",
        color: colors.grey,
        fontWeight:"400",
        fontSize:12,
        fontStyle: 'italic',
    },
    
    inputContainer:{
        flexDirection:'row',
        borderWidth:1,
        borderRadius:15,
        padding:'2%',
        marginHorizontal:"10%"
    
    },
    
    
    logo: {
        width: 60,
        height: 60,
        margin: 10,
    }
    
})

export default AthleteForm;