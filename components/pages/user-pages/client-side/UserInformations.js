import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useState, useRef } from "react"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { useDispatch } from "react-redux"
import { changeUserInfos } from "@reducers/user"

import Button from "@components/ui/Button"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useSessionExpired from "@hooks/useSessionExpired"
import MyTextInput from "@components/ui/MyTextInput"
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
            jwtToken: user.jwtToken,
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

            <MyTextInput style={styles.input}
                onChangeText={(e) => {
                    setEmail(e)
                    setFormWarning("")
                }}
                value={email}
                placeholder='Email'
                placeholderTextColor={appStyle.placeholderColor}
                keyboardType='email-address'
                autoCapitalize='none'
            >
            </MyTextInput>


            <Text style={styles.label}>
                Changer mon prénom
            </Text>

            <MyTextInput style={styles.input}
                onChangeText={(e) => {
                    setFirstName(e)
                    setFormWarning("")
                }}
                value={firstName}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            >
            </MyTextInput>


            <Text style={styles.label}>
                Changer mon nom
            </Text>

            <MyTextInput style={styles.input}
                onChangeText={(e) => {
                    setLastName(e)
                    setFormWarning("")
                }}
                value={lastName}
                placeholder='Nom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            >
            </MyTextInput>


            <Text style={styles.label}>
                Changer mon mot de passe
            </Text>



            <MyTextInput style={[styles.input, styles.passwordInput]}
                onChangeText={(e) => {
                    setOldPassword(e)
                    setFormWarning("")
                }}
                value={oldPassword}
                autoCapitalize='none'
                placeholder='Ancien mot de passe'
                placeholderTextColor={appStyle.placeholderColor}
                secureTextEntry={!oldPasswordVisible}
            >

                <TouchableOpacity activeOpacity={0.6} style={appStyle.inputIconContainer} onPress={() => setOldPasswordVisible(prev => !prev)} >
                    <FontAwesome
                        name={oldPasswordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} >
                    </FontAwesome>
                </TouchableOpacity>

            </MyTextInput>


            <MyTextInput style={[styles.input, styles.passwordInput]}
                onChangeText={(e) => {
                    setPassword(e)
                    setFormWarning("")
                }}
                value={password}
                autoCapitalize='none'
                placeholder='Nouveau mot de passe'
                placeholderTextColor={appStyle.placeholderColor}
                secureTextEntry={!passwordVisible}
            >

                <TouchableOpacity activeOpacity={0.6} style={appStyle.inputIconContainer} onPress={() => setPasswordVisible(prev => !prev)}>
                    <FontAwesome
                        name={passwordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} >
                    </FontAwesome>
                </TouchableOpacity>

            </MyTextInput>



            <MyTextInput style={[styles.input, styles.passwordInput]}
                onChangeText={(e) => {
                    setConfirmedPassword(e)
                    setFormWarning("")
                }}
                value={confirmedPassword}
                autoCapitalize='none'
                placeholder='Confirmation du mot de passe'
                placeholderTextColor={appStyle.placeholderColor}
                secureTextEntry={!confirmedPasswordVisible}
            >

                <TouchableOpacity activeOpacity={0.6} style={appStyle.inputIconContainer} onPress={() => setConfirmedPasswordVisible(prev => !prev)} >
                    <FontAwesome
                        name={confirmedPasswordVisible ? "eye-slash" : "eye"} color={appStyle.placeholderColor} size={appStyle.inputIconSize} >
                    </FontAwesome>
                </TouchableOpacity>

            </MyTextInput>



            <Text style={[appStyle.warning, !formWarning && { height: 0, marginTop: 0 }]}>
                {formWarning}
            </Text>

            <Button func={checkUserInformationsForm} text={"Enregistrer les modifications"} style={{...appStyle.mediumItemHeight, width: "100%", marginTop: appStyle.largeMarginTop }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, letterSpacing: phoneDevice ? RPW(0.3) : 2 }} />


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir enregistrer ces modifications ?"} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={updateUser} />
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        ...appStyle.labelText,
        textAlign: "center",
        color: appStyle.fontColorDarkBg,
        marginTop: appStyle.regularMarginTop,
    },
    input: {
        ...appStyle.input.baseLargeCard,
        color: appStyle.fontColorDarkBg,
    },
    passwordInput: {
        ...appStyle.input.withIcon,
        fontWeight: "700",
        color: appStyle.fontColorDarkBg,
    },
})