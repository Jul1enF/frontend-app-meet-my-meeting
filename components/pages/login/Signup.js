import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState, useRef } from 'react';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '@components/ui/Button';
import { useDispatch } from 'react-redux';
import { login } from 'reducers/user'
import request from '@utils/request';
import { useRouter } from 'expo-router';


import { RPH, RPW, phoneDevice } from 'utils/dimensions'
import { appStyle } from 'styles/appStyle';
import MyTextInput from '@components/ui/MyTextInput';

export default function Signup({ setSignForm, func }) {
    const router = useRouter()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [confirmedPasswordVisible, setConfirmedPasswordVisible] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [warning, setWarning] = useState({})

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const dispatch = useDispatch()


    // SIGNUP LOGIC
    // Function trigerred by clicking on signup + ref to block the button once pressed until the function is over
    const signupRef = useRef(true)
    const signupClick = async () => {
        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        if (!firstName || !lastName || !email || !password || !confirmedPassword) {
            setWarning({ text: "Erreur : tous les champs ne sont pas remplis" })
            return
        }
        if (password !== confirmedPassword) {
            setWarning({ text: "Erreur de confirmation du mot de passe" })
            return
        }
        if (!regexMail.test(email)) {
            setWarning({ text: "Adresse mail non valide !" })
            return
        }

        const data = await request({
            path: "/users/signup", method: "POST", functionRef: signupRef, setWarning,
            body: {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            }
        })

        if (data?.result) {
            dispatch(login(data.user))
            setLastName("")
            setFirstName("")
            setEmail("")
            setPassword("")
            setConfirmedPassword("")
            if (typeof func === "function") func()
            else router.push("/")
        }
    }





    return (
        <>
            {/* <KeyboardAvoidingView style={{ width: "100%", height: "100%" }} keyboardVerticalOffset={phoneDevice ? 30 : 150} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={[appStyle.pageBody, { flex: "auto" }]} keyboardShouldPersistTaps="handled" > */}

            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}
                contentContainerStyle={[
                    appStyle.pageBody,
                    { flex: "auto" }
                ]} keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
                bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            >

                <Text style={appStyle.pageTitle}>S'inscrire</Text>


                <View style={appStyle.card}>

                    <MyTextInput style={styles.input}
                        onChangeText={(e) => {
                            setFirstName(e)
                            setWarning({})
                        }}
                        value={firstName}
                        placeholder='Prénom'
                        placeholderTextColor={appStyle.placeholderColor}
                        autoCapitalize="words"
                        autoCorrect={false}
                    >
                    </MyTextInput>

                    <MyTextInput style={styles.input}
                        onChangeText={(e) => {
                            setLastName(e)
                            setWarning({})
                        }}
                        value={lastName}
                        placeholder='Nom'
                        placeholderTextColor={appStyle.placeholderColor}
                        autoCapitalize="words"
                        autoCorrect={false}
                    >
                    </MyTextInput>

                    <MyTextInput style={styles.input}
                        onChangeText={(e) => {
                            setEmail(e)
                            setWarning({})
                        }}
                        value={email}
                        placeholder='Email'
                        placeholderTextColor={appStyle.placeholderColor}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    >
                    </MyTextInput>



                    <MyTextInput style={[styles.input, styles.passwordInput]}
                        onChangeText={(e) => {
                            setPassword(e)
                            setWarning('')
                        }}
                        value={password}
                        autoCapitalize='none'
                        placeholder='Mot de passe'
                        placeholderTextColor={appStyle.placeholderColor}
                        secureTextEntry={!passwordVisible}
                    >

                        <TouchableOpacity activeOpacity={0.6} style={appStyle.inputIconContainer} onPress={() => setPasswordVisible(!passwordVisible)} >
                            <FontAwesome
                                name={passwordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} >
                            </FontAwesome>
                        </TouchableOpacity>

                    </MyTextInput>



                    <MyTextInput style={[styles.input, styles.passwordInput]}
                        onChangeText={(e) => {
                            setConfirmedPassword(e)
                            setWarning('')
                        }}
                        value={confirmedPassword}
                        autoCapitalize='none'
                        placeholder='Confirmation mot de passe'
                        placeholderTextColor={appStyle.placeholderColor}
                        secureTextEntry={!confirmedPasswordVisible}
                    >

                        <TouchableOpacity activeOpacity={0.6} onPress={() => setConfirmedPasswordVisible(!confirmedPasswordVisible)} style={appStyle.inputIconContainer} >
                            <FontAwesome
                                name={confirmedPasswordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} >
                            </FontAwesome>
                        </TouchableOpacity>

                    </MyTextInput>



                    <Button text="S'inscrire" func={signupClick} />

                    <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                        {warning?.text}
                    </Text>


                    <TouchableOpacity style={{ width: "100%", alignItems: "center", marginTop: phoneDevice ? RPW(5) : 40 }} activeOpacity={0.5} onPress={() => setSignForm("signin")} >
                        <Text style={[appStyle.regularText, { color: appStyle.fontColorDarkBg }]}>
                            Déjà un compte  ?
                        </Text>

                        <View style={styles.signupButton} >
                            <MaterialIcons name="login" color={appStyle.brightRed} size={phoneDevice ? RPW(4) : 30} />
                            <Text style={[{ ...appStyle.regularText }, { color: appStyle.brightRed, marginLeft: phoneDevice ? RPW(2) : 15 }]}>
                                Se connecter
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </KeyboardAwareScrollView>

            {/* </ScrollView>
            </KeyboardAvoidingView> */}
        </>
    );
}

const styles = StyleSheet.create({
    warning: {
        ...appStyle.warning,
        marginTop: phoneDevice ? RPW(2) : 15,
    },
    input: {
        ...appStyle.input.base,
        color: appStyle.fontColorDarkBg,
    },
    passwordInput: {
        ...appStyle.input.withIcon,
    },
    signupButton: {
        ...appStyle.button,
        flexDirection: "row",
        marginTop: phoneDevice ? RPW(1.1) : 10,
    }
});