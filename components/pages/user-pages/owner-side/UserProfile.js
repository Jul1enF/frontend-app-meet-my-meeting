import { View, StyleSheet, Text } from "react-native";
import { useState, useMemo, useRef } from "react";

import Autocomplete from "@components/ui/Autocomplete";
import UserInformations from "./UserInformations";
import UserSchedule from "../schedule/UserSchedule";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { userDefaultSchedule } from "constants/userDefaultSchedule";
import { createScheduleActions, dayValidation } from "../schedule/scheduleUtils";
import request from "@utils/request";

import Button from "@components/ui/Button";
import ConfirmationModal from "@components/ui/ConfirmationModal";


export default function UserProfile({ selectedUser: user, jwtToken, setAllUsers, setSessionExpired }) {

    const rolesData = [
        { id: "1", title: "Gérant", role: "owner" },
        { id: "2", title: "Administrateur", role: "admin" },
        { id: "3", title: "Employé", role: "employee" },
        { id: "4", title: "Client", role: "client" },
    ]

    const index = rolesData.findIndex(e => e.role === user.role)
    const [newRole, setNewRole] = useState(rolesData[index])

    const oldSchedule = user.schedule ?? userDefaultSchedule;
    const [newSchedule, setNewSchedule] = useState(oldSchedule)
    const scheduleArray = Object.values(newSchedule)

    const [contractEnd, setContractEnd] = useState(user.contract_end)

    const scheduleActions = useMemo(() => {
        return createScheduleActions(setNewSchedule)
    }, [])

    const [warning, setWarning] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const validateUpdate = () => {
        let error
        if (!newRole) {
            setWarning("Erreur : merci de choisir le statut de l'utilisateur")
            error = true
        } else {
            for (let day of scheduleArray) {
                const { dayError, breakError } = dayValidation(day, true)
                if (dayError) {
                    setWarning(dayError)
                    error = true
                    break;
                } else if (breakError) {
                    setWarning(breakError)
                    error = true
                    break;
                }
            }
        }

        if (error) {
            setTimeout(() => setWarning(false), 5500)
            return
        } else setModalVisible(true)
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

        const data = await request({ path: "pros/update-user", method: "PUT", body, jwtToken, setSessionExpired, functionRef: updateUserRef, setWarning: setFetchWarning, setModalVisible })

        if (data?.result) {
            setAllUsers(prev => prev.map(e => {
                if (e._id === user._id) {
                    return data.userSaved
                } else {
                    return e
                }
            }))
        }
    }


    return (
        <>
            <View style={appStyle.pageBody}>

                <Text style={appStyle.pageTitle}>
                    Utilisateur
                </Text>

                <View style={[appStyle.card, { width: appStyle.largeItemWidth, paddingBottom: phoneDevice ? RPW(12) : 80 }]}>

                    <UserInformations user={user} />


                    <Text style={[appStyle.pageSubtitle, { color: appStyle.fontColorDarkBg, marginTop: appStyle.largeMarginTop }]}>
                        Statut :
                    </Text>

                    <Autocomplete data={rolesData} setSelectedItem={setNewRole} placeholderText={"Statut de l'utilisateur"} width={"100%"} initialValue={newRole} emptyText="Aucun résultat" />

                    {(newRole?.role && newRole?.role !== "client") &&
                        <UserSchedule scheduleArray={scheduleArray} scheduleActions={scheduleActions}
                            contractEnd={contractEnd} setContractEnd={setContractEnd}
                        />
                    }

                    <Text style={[appStyle.warning, !warning && { height: 0, marginTop: 0 }]}>
                        {warning}
                    </Text>

                    <Button func={() => validateUpdate()} text="Enregistrer les modifications" marginTop={appStyle.largeMarginTop} style={{ width: "100%", height: appStyle.largeItemHeight }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg }} />

                </View>

                < ConfirmationModal visible={modalVisible} closeModal={() => setModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir enregistrer ces modifications ?"} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={updateUserPress} />

            </View>
        </>
    )
}

const styles = StyleSheet.create({

})