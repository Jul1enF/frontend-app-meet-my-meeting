import { View, StyleSheet, Text, Platform } from "react-native";
import { useState, useMemo, useRef } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Autocomplete from "@components/ui/Autocomplete";
import UserInformations from "./UserInformations";
import UserSchedule from "./UserSchedule";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { dayValidation } from "../../../user-schedule/scheduleUtils";
import request from "@utils/request";

import Button from "@components/ui/Button";
import ConfirmationModal from "@components/ui/ConfirmationModal";


export default function UserProfile({ selectedUser: user, jwtToken, setUserInformations, setSessionExpired, defaultSchedule }) {

    const rolesData = [
        { id: "1", title: "Gérant", role: "owner" },
        { id: "2", title: "Administrateur", role: "admin" },
        { id: "3", title: "Employé", role: "employee" },
        { id: "4", title: "Client", role: "client" },
    ]

    const index = rolesData.findIndex(e => e.role === user.role)
    const [newRole, setNewRole] = useState(rolesData[index])

    let userDefaultSchedule = {}
    if (defaultSchedule) {
        for (let i = 0; i < 7; i++) {
            userDefaultSchedule[i] = defaultSchedule
        }
    }

    const oldSchedule = user.schedule ?? userDefaultSchedule;
    const [newSchedule, setNewSchedule] = useState(oldSchedule)
    const scheduleArray = Object.values(newSchedule)

    const [contractEnd, setContractEnd] = useState(user.contract_end)


    const [warning, setWarning] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const validateUpdate = () => {

        if (!newRole) {
            setWarning("Erreur : merci de choisir le statut de l'utilisateur")
            setTimeout(() => setWarning(""), 4000)
            return
        }

        for (let day of scheduleArray) {
            const { dayError, breakError } = dayValidation(day, true)
            if (dayError || breakError) {
                setWarning(dayError ?? breakError)
                setTimeout(() => setWarning(""), 5000)
                return
            }
        }

         setModalVisible(true)
    }



    const updateUserRef = useRef(true)

    const updateUserPress = async () => {
        const { role } = newRole
        const body = {
            _id: user._id,
            userToSave: {
                role,
                schedule: role === "client" ? null : newSchedule,
                contract_end: role === "client" ? null :
                    contractEnd ? contractEnd.toUTC().toJSDate() : null,
            }
        }

        const data = await request({ path: "/pros/update-user", method: "PUT", body, jwtToken, setSessionExpired, functionRef: updateUserRef, setWarning: setFetchWarning, setModalVisible })

        if (data?.result) {
            setUserInformations(
                prev => ({
                    ...prev,
                    allUsers: prev.allUsers.map(e => {
                        if (e._id === user._id) {
                            return data.userSaved
                        } else {
                            return e
                        }
                    })
                })
            )
        }
    }


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}
            contentContainerStyle={[
                appStyle.pageBody,
                { flex: "auto" }
            ]}
            bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            overScrollMode="never"
            bounces={false}
        >

            <Text style={appStyle.pageTitle}>
                Utilisateur
            </Text>

            <View style={appStyle.largeCard}>

                <UserInformations user={user} />


                <Text style={[appStyle.pageSubtitle, { color: appStyle.fontColorDarkBg, marginTop: appStyle.largeMarginTop }]}>
                    Statut :
                </Text>

                <Autocomplete data={rolesData} setSelectedItem={setNewRole} placeholderText={"Statut de l'utilisateur"} width={"100%"} initialValue={newRole} emptyText="Aucun résultat" />

                {(newRole?.role && newRole?.role !== "client") &&
                    <UserSchedule scheduleArray={scheduleArray} setNewSchedule={setNewSchedule}
                        contractEnd={contractEnd} setContractEnd={setContractEnd}
                    />
                }

                <Text style={[appStyle.warning, !warning && { height: 0, marginTop: 0 }]}>
                    {warning}
                </Text>

                <Button func={() => validateUpdate()} text="Enregistrer les modifications" style={{ ...appStyle.largeCardItem, marginTop: appStyle.largeMarginTop }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg }} />

            </View>

            < ConfirmationModal visible={modalVisible} closeModal={() => setModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir enregistrer ces modifications ?"} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={updateUserPress} />

        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({

})