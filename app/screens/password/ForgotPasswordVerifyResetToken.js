import React from 'react';
import { Formik } from 'formik';
import {Text, TextInput, View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome5,MaterialCommunityIcons } from '@expo/vector-icons';
import * as yup from 'yup';
import "yup-phone";
import Constants from "expo-constants";
import colors from '../../config/colors';
import passwordApi from '../../api/password';
import { useNavigation } from '@react-navigation/core';
import { ScrollView } from 'react-native-gesture-handler';

const tokenSchema = yup.object({
    resetToken: yup.string().required().min(1).label("Reset Token")
})

function ForgotPasswordVerifyResetTokenForm(props) {
    const navigation = useNavigation();
    const authId = props.route.params.authId;

    const handleSubmit = async(values) => {
        try {
            const authResponse = await passwordApi.resetAuth(values.resetToken, authId);
            if (authResponse.status === 200) {
                navigation.navigate("ResetPassword", {authId: authId});
            } else {
                Alert.alert(`Error:${authResponse.data}, Please try again.`);
            }
        } catch (error) {
            Alert.alert("An error occured. Please try again later.")
        }
    }

    const handleBackToLogin = () => {
        navigation.navigate("Login");
    }

    return (
       <View style={styles.container}>
           <View style={styles.headerContainer}>
               <Image source= {require("../../assets/logo_crop.png")} style={styles.logo}/>
               <Text style={styles.headerText}>Recovery On The Go</Text>
           </View>
           <ScrollView keyboardShouldPersistTaps="handled"> 
            <Formik
            initialValues={{resetToken :''}}
            validationSchema={tokenSchema}
            onSubmit={async (values,actions) => {
                await handleSubmit(values);
                actions.resetForm();
            }}
            >
                {(props) => (
                    <View>
                        <Text style={styles.labelText}>One-time passcode:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                    style={{flex:1,flexWrap:'wrap'}}
                                    placeholder="Passcode"
                                    onChangeText={props.handleChange('resetToken')}
                                    value={props.values.resetToken}
                                    keyboardType= "numeric"
                                    onBlur={props.handleBlur('resetToken')}
                                    textContentType="oneTimeCode"
                                    autoCorrect={false}
                                    autoCapitalize= "none"
                                />
                        </View>
                        {/* <Text style={styles.errorText}> {props.touched.phone && props.errors.phone}</Text> */}
                            <TouchableOpacity  onPress={props.handleSubmit}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </View>    
                            </TouchableOpacity>
                    </View>

                )}

            </Formik>
            <View style={styles.backToLoginContainer}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={handleBackToLogin} style={styles.loginLink}>
                    <Text style={styles.loginLink}>Log in here</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    labelText:{
        fontSize: 16,
        color: colors.dullblack,
        marginTop: '20%',
        marginBottom: '5%',  
        marginLeft: '10%'
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
    headerContainer:{
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
    backToLoginContainer:{
        marginTop: '2%',
        alignItems: 'center'
    },
    loginLink:{
        marginTop: '1%',
        textDecorationLine: 'underline'
    },
    logo: {
        width: 60,
        height: 60,
        margin: 10,
    }
    
})

export default ForgotPasswordVerifyResetTokenForm;