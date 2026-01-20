import { View, TouchableOpacity, StyleSheet } from "react-native";
import { memo, useState, useRef } from 'react';
import { useSelector } from "react-redux";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import ConfirmationModal from "@components/ui/ConfirmationModal";
import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';
import { toParisDt } from "@utils/timeFunctions";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';


export default memo(function UpdateButtons({ event, setEventStart, setOldEvent, eventMinDuration, resetAndRenewEvents }) {

    const { category, _id } = event

    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})


    // Var for the conditionnal diplay of the icons depending on the height of the event and it's category (for the different background colors)
    const iconSize = eventMinDuration <= 20 ? (phoneDevice ? RPW(5.2) : 28) : (phoneDevice ? RPW(6.5) : 35)
    const iconColor = (category === "closure" || category === "absence" || category === "dayOff") ? appStyle.brightGrey : appStyle.strongGrey
    const hitSlop = eventMinDuration <= 20 ? (phoneDevice ? RPW(5) : 25) : (phoneDevice ? RPW(4.5) : 20)
    const top = (category === "closure" || category === "absence" || category === "dayOff") ? (phoneDevice ? RPW(4) : 30) : (phoneDevice ? 0 : -5)



    // States and function to delete the event
    const deleteRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const deleteEvent = async () => {
        // If it as a lunch break suppression we post an event to know later to not display the default one
        const isLunchBreak = category === "lunchBreak"
        const body = { eventToSave: { ...event, lunch_break_modification: "suppression" } }

        // Params for suppression
        const params = _id.toString()

        const data = await request({
            path: !isLunchBreak ? "/events/delete-event" : "/events/create-or-update",
            method: !isLunchBreak ? "DELETE" : "PUT",
            functionRef: deleteRef,
            jwtToken,
            setSessionExpired,
            setModalVisible: setConfirmationModalVisible,
            setWarning: setFetchWarning,
            ...(isLunchBreak && { body }),
            ...(!isLunchBreak && { params }),
        })

        if (data?.result) {
            const delay = data.delay ?? 0
            if (!isLunchBreak) {
                setTimeout(() => resetAndRenewEvents({ _id, category }, "delete", "schedule"), delay)
            }
            // If it is a lunchBreak a new event was created or and old one updated (if the lunch break was already modified)
            else {
                setTimeout(() => resetAndRenewEvents(data.eventSaved, _id ? "update" : "create", "schedule"), delay)
            }

        }
    }

    if (category === "dayOff") return <></>

    return (
        <>
            <View style={{ width: "100%", position: "absolute", top }}>
                {category !== "dayOff" &&
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={[styles.iconContainer, styles.editContainer]}
                        onPress={() => {
                            setOldEvent(event)
                            setEventStart(toParisDt(event.start))
                        }}
                        hitSlop={hitSlop}
                    >

                        <MaterialCommunityIcons name="pencil" size={iconSize} color={iconColor} />

                    </TouchableOpacity>
                }


                <TouchableOpacity
                    activeOpacity={0.6}
                    style={[styles.iconContainer, styles.deleteContainer]}
                    onPress={()=> setConfirmationModalVisible(true)}
                    hitSlop={hitSlop}
                >

                    <Entypo name="circle-with-cross" size={iconSize} color={iconColor} />

                </TouchableOpacity>
            </View>


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir supprimer cet évènement ?"} confirmationBtnText={"Oui, supprimer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={deleteEvent} />
        </>
    )
})

const styles = StyleSheet.create({
    iconContainer: {
        position: "absolute",
        top: phoneDevice ? RPW(0.5) : 10,
    },
    editContainer: {
        left: phoneDevice ? RPW(1) : -5,
        alignItems: "flex-start"
    },
    deleteContainer: {
        right: phoneDevice ? RPW(1) : -5,
        alignItems: "flex-end"
    }
})