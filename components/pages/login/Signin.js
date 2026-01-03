import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useState, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '@components/ui/Button';
import { useDispatch } from 'react-redux';
import { login } from 'reducers/user'
import request from '@utils/request';
import { useRouter } from 'expo-router';

import { RPH, RPW, phoneDevice } from 'utils/dimensions'
import { appStyle } from 'styles/appStyle';

export default function Signin({ setSignForm, func }) {
    const router  = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [warning, setWarning] = useState({})

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const dispatch = useDispatch()


    // Function trigerred by clicking on signin + ref to block the button once pressed until the function is over
    const signinRef = useRef(true)
    const signinClick = async () => {

        if (!email || !password) {
            setWarning({ text: "Erreur : tous les champs ne sont pas remplis" })
            return
        }

        const data = await request({
            path: "users/signin", method: "POST", functionRef: signinRef, setWarning,
            body: {
                email,
                password,
            }
        })

        if (data) {
            dispatch(login(data.user))
            if (typeof func === "function") func()
            else router.push("/home")
        }

    }


    return (
        <>
            <KeyboardAvoidingView style={{ width: "100%", height: "100%" }} keyboardVerticalOffset={phoneDevice ? 30 : 150} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={[appStyle.pageBody, { flex: "auto" }]} keyboardShouldPersistTaps="handled">

                    {/* <KeyboardAwareScrollView
                style={{ width: "100%", height: "100%" }}
                contentContainerStyle={[appStyle.pageBody, { flex : "auto" }]}
                bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            > */}

                    <Text style={appStyle.pageTitle}>Se connecter</Text>

                    <View style={appStyle.card}>

                        <TextInput style={styles.input}
                            onChangeText={(e) => {
                                setEmail(e)
                                setWarning({})
                            }}
                            value={email}
                            placeholder='Email'
                            placeholderTextColor={appStyle.placeholderColor}
                            keyboardType='email-address'
                            autoCapitalize='none'>
                        </TextInput>

                        <View style={styles.passwordInputContainer} >
                            <TextInput style={styles.passwordInput}
                                onChangeText={(e) => {
                                    setPassword(e)
                                    setWarning({})
                                }}
                                value={password}
                                autoCapitalize='none'
                                placeholder='Mot de passe'
                                placeholderTextColor={appStyle.placeholderColor}
                                secureTextEntry={!passwordVisible}>
                            </TextInput>
                            <FontAwesome
                                name={passwordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} onPress={() => setPasswordVisible(!passwordVisible)}>
                            </FontAwesome>
                        </View>

                        <Button text="Se connecter" func={signinClick} />

                        <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop : 0 }]}>
                            {warning?.text}
                        </Text>

                        <TouchableOpacity activeOpacity={0.5} style={{ width: "100%", alignItems: "center", marginTop: phoneDevice ? RPW(5) : 40 }} onPress={() => setSignForm("signup")}>
                            <Text style={[appStyle.regularText, { color: appStyle.fontColorDarkBg }]}>
                                Pas encore de compte ?
                            </Text>

                            <View style={styles.signupButton} >
                                <MaterialIcons name="login" color={appStyle.brightRed} size={phoneDevice ? RPW(4) : 30} />
                                <Text style={[{ ...appStyle.regularText }, { color: appStyle.brightRed, marginLeft: phoneDevice ? RPW(2) : 15 }]}>
                                    Créer un compte
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>


                    {/* </KeyboardAwareScrollView> */}


                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        ...appStyle.input.base,
        color: appStyle.fontColorDarkBg,
    },
    passwordInputContainer: {
        ...appStyle.input.base,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    passwordInput: {
        ...appStyle.input.withIcon,
        color: appStyle.fontColorDarkBg,
    },
    signupButton: {
        ...appStyle.button,
        flexDirection: "row",
        marginTop: phoneDevice ? RPW(1.1) : 10,
    }
});