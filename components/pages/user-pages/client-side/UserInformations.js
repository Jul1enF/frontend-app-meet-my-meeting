import { View, Text, StyleSheet, TextInput } from "react-native"
import { useState, useRef } from "react"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { useDispatch } from "react-redux"
import { changeUserInfos } from "@reducers/user"

import Button from "@components/ui/Button"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useSessionExpired from "@hooks/useSessionExpired"
import ConfirmationModal from "@components/ui/ConfirmationModal"
import request from "@utils/request"


export default function UserInformations({ user }) {
    const dispatch = useDispatch()

    const [email, setEmail] = useState(user.email ?? "")
    const [firstName, setFirstName] = useState(user.first_name ?? "")
    const [lastName, setLastName] = useState(user.last_name ?? "")
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmedPasswordVisible, setConfirmedPasswordVisible] = useState(false)

    const [formWarning, setFormWarning] = useState("")
    const [fetchWarning, setFetchWarning] = useState({})
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)


    // Function called when user wants to submit the form to check the informations before calling the confirmation modal
    const checkUserInformationsForm = () => {
        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

        if (!email || !firstName || !lastName) {
            setFormWarning("Erreur : Informations manquantes !")
        } else if (!regexMail.test(email)) {
            setFormWarning("Erreur : Adresse mail non valide !")
        } else if (password && password !== confirmedPassword) {
            setFormWarning("Erreur de confirmation du mot de passe !")
        } else if (password && !oldPassword) {
            setFormWarning("Erreur : Merci de renseigner votre ancien mot de passe !")
        }
        else {
            setConfirmationModalVisible(true)
        }
    }


    // Function and states to send the modifications to the backend
    const updateUserRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const updateUser = async () => {
        const body = { updatedUser: { email, first_name: firstName, last_name: lastName }, oldPassword, password }

        const data = await request({
            path: '/users/update-user',
            method: "PUT",
            body,
            jwtToken : user.jwtToken,
            setSessionExpired,
            functionRef: updateUserRef,
            setWarning: setFetchWarning,
            setModalVisible: setConfirmationModalVisible,
        })
        if (data?.result) {
            const { userSaved } = data
            dispatch(changeUserInfos(userSaved))
        }
    }


    return (
        <>
            <Text style={[appStyle.pageSubtitle, { color: appStyle.lightGrey3 }]}>
                Changer mes informations
            </Text>

            <Text style={[styles.label, { marginTop: appStyle.largeMarginTop }]}>
                Changer mon email
            </Text>

            <TextInput style={styles.input}
                onChangeText={(e) => {
                    setEmail(e)
                    setFormWarning("")
                }}
                value={email}
                placeholder='Email'
                placeholderTextColor={appStyle.placeholderColor}
                keyboardType='email-address'
                autoCapitalize='none'>
            </TextInput>


            <Text style={styles.label}>
                Changer mon prénom
            </Text>

            <TextInput style={styles.input}
                onChangeText={(e) => {
                    setFirstName(e)
                    setFormWarning("")
                }}
                value={firstName}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words">
            </TextInput>


            <Text style={styles.label}>
                Changer mon nom
            </Text>

            <TextInput style={styles.input}
                onChangeText={(e) => {
                    setLastName(e)
                    setFormWarning("")
                }}
                value={lastName}
                placeholder='Nom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words">
            </TextInput>


            <Text style={styles.label}>
                Changer mon mot de passe
            </Text>


            <View style={[styles.input, styles.passwordContainer]} >
                <TextInput style={styles.passwordInput}
                    onChangeText={(e) => {
                        setOldPassword(e)
                        setFormWarning("")
                    }}
                    value={oldPassword}
                    autoCapitalize='none'
                    placeholder='Ancien mot de passe'
                    placeholderTextColor={appStyle.placeholderColor}
                    secureTextEntry={!oldPasswordVisible}>
                </TextInput>
                <FontAwesome
                    name={oldPasswordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} onPress={() => setOldPasswordVisible(prev => !prev)}>
                </FontAwesome>
            </View>


            <View style={[styles.input, styles.passwordContainer]} >
                <TextInput style={styles.passwordInput}
                    onChangeText={(e) => {
                        setPassword(e)
                        setFormWarning("")
                    }}
                    value={password}
                    autoCapitalize='none'
                    placeholder='Nouveau mot de passe'
                    placeholderTextColor={appStyle.placeholderColor}
                    secureTextEntry={!passwordVisible}>
                </TextInput>
                <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} onPress={() => setPasswordVisible(prev => !prev)}>
                </FontAwesome>
            </View>

            <View style={[styles.input, styles.passwordContainer]} >
                <TextInput style={styles.passwordInput}
                    onChangeText={(e) => {
                        setConfirmedPassword(e)
                        setFormWarning("")
                    }}
                    value={confirmedPassword}
                    autoCapitalize='none'
                    placeholder='Confirmation du mot de passe'
                    placeholderTextColor={appStyle.placeholderColor}
                    secureTextEntry={!confirmedPasswordVisible}>
                </TextInput>
                <FontAwesome
                    name={confirmedPasswordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} onPress={() => setConfirmedPasswordVisible(prev => !prev)}>
                </FontAwesome>
            </View>


            <Text style={[appStyle.warning, !formWarning && { height: 0, marginTop: 0 }]}>
                {formWarning}
            </Text>

            <Button func={checkUserInformationsForm} text={"Enregistrer les modifications"} marginTop={appStyle.largeMarginTop} style={{ height: appStyle.regularItemHeight * (phoneDevice ? 1.2 : 1.25), width: "100%" }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, letterSpacing: phoneDevice ? RPW(0.3) : 2 }} />


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir enregistrer ces modifications ?"} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={updateUser} />
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        ...appStyle.labelText,
        color: appStyle.fontColorDarkBg,
        marginTop: appStyle.regularMarginTop,
    },
    input: {
        ...appStyle.input.baseLarge,
        width: "100%",
        color: appStyle.fontColorDarkBg,
        fontWeight: "700"
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    passwordInput: {
        ...appStyle.input.withIcon,
        color: appStyle.fontColorDarkBg,
    },
})