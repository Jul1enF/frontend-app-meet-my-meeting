import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState, useRef } from "react"
import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import { useSelector } from "react-redux";

import ConfirmationModal from "@components/ui/ConfirmationModal";
import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';
import { eventCatTranslation } from "constants/translations";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';


export default function WorkingOverrideButtons({ concernedEvents, setOldEvent, selectedDate, selectedEmployee, resetAndRenewEvents }) {

    const role = useSelector((state) => state.user.value.role)
    const _id = useSelector((state) => state.user.value._id)
    const firstEvent = concernedEvents[0]
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})


    // Vars to know what is possible to do with the current day displayed :

    let dayCategory

    // If it is a normal working day, there is no special event at the begining of concernedEvents Array, only categories : appointment, break or lunchBreak
    if (!concernedEvents.length || firstEvent.category === "break" || firstEvent.category === "lunchBreak" || firstEvent.category === "appointment") {
        dayCategory = "workingDay"
    }
    else {
        dayCategory = firstEvent.category
    }

    const canModify = role !== "employee" || _id?.toString() === selectedEmployee?._id?.toString()
    const isEditable = (dayCategory === "workingDay" || dayCategory === "workingOverride") && canModify
    const isDeletable = (dayCategory === "workingOverride" || dayCategory === "dayOff") && canModify



    // Function called when edit icon is pressed
    const editPress = () => {
        // If it is a workingDay, we have to create an oldEvent, because there is none
        if (dayCategory === "workingDay") {
            const baseDate = selectedDate.set({ second: 0, millisecond: 0 })
            setOldEvent({ start: baseDate, end: baseDate, employee: selectedEmployee._id.toString(), category: dayCategory })
        } else {
            setOldEvent(firstEvent)
        }
    }

    // Function called when delete icon is pressed
    const deletePress = () => {
        // If it is a dayOff, it is not a suppression but a post of a new working override so we set oldEvent with it to display workingOverrideRedaction
        if (dayCategory === "dayOff") setOldEvent(firstEvent)
        else setConfirmationModalVisible(true)
    }


    
    // Function to delete a workingOverride
    const deleteRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const deleteWorkingOverride = async () => {

        const params = [firstEvent._id.toString(), firstEvent.employee.toString()]

        const data = await request({
            path: "/events/delete-working-override",
            method: "DELETE",
            functionRef: deleteRef,
            sendToken : true,
            setSessionExpired,
            setModalVisible: setConfirmationModalVisible,
            setWarning: setFetchWarning,
            params,
        })

        if (data?.result) {
            const delay = data.delay ?? 0
            setTimeout(() => resetAndRenewEvents(firstEvent, "delete", "schedule"), delay)
        }
        else if (data?.delay) {
            setTimeout(() => {
                resetAndRenewEvents()
            }, data.delay)
        }
    }



    return (
        <View style={styles.mainContainer}>

            {isEditable &&
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={[styles.iconContainer, styles.editContainer]}
                    onPress={editPress}
                >

                    <MaterialCommunityIcons name="pencil" size={phoneDevice ? RPW(6) : 35} color={appStyle.strongBlack} />

                </TouchableOpacity>
            }


            <Text style={[appStyle.labelText, { lineHeight: "auto" }]}>
                {eventCatTranslation[dayCategory]}
            </Text>


            {isDeletable &&
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={[styles.iconContainer, styles.deleteContainer]}
                    onPress={deletePress}
                >

                    <Entypo name="circle-with-cross" size={phoneDevice ? RPW(6.3) : 38} color={appStyle.strongBlack} />

                </TouchableOpacity>
            }

            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir supprimer les modifications apportées à cette journée ?"} confirmationBtnText={"Oui, supprimer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={deleteWorkingOverride} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        paddingVertical: phoneDevice ? RPW(2) : 20,
        backgroundColor: "rgba(210, 144, 29, 0.22)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: phoneDevice ? RPW(2) : 14
    },
    iconContainer: {
        position: "absolute",
        width: phoneDevice ? RPW(12) : 75,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    editContainer: {
        left: 0,
    },
    deleteContainer: {
        right: 0,
    }
})