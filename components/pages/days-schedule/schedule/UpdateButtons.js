import { View, TouchableOpacity, StyleSheet } from "react-native";
import { memo, useState, useRef } from 'react';
import { useSelector } from "react-redux";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import ConfirmationModal from "@components/ui/ConfirmationModal";
import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';


export default memo(function UpdateButtons({ category, setEventStart, setOldEvent, eventMinDuration, paddingTop, _id, resetAndRenewEvents }) {
    const jwtToken = useSelector((state)=> state.user.value.jwtToken)
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})


    // Var for the conditionnal diplay of the icons depending on the height of the event and it's category (for the different background colors)
    const iconSize = eventMinDuration <= 20 ? (phoneDevice ? RPW(5.2) : 28) : (phoneDevice ? RPW(6.5) : 35)
    const iconColor = category === ("closure" || "absence") ? appStyle.brightGrey : appStyle.strongGrey
    const containerWidth = eventMinDuration <= 20 ? (phoneDevice ? RPW(8.5) : 45) : (phoneDevice ? RPW(10) : 50)


    // States and function to delete the event
    const deleteRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const deleteEvent = async () => {
        const data = await request({
            path : "events/delete-event",
            method : "DELETE",
            jwtToken,
            setSessionExpired,
            params : _id,
            setWarning : setFetchWarning,
        })

        if (data?.result){
            const delay = data.delay ?? 0
            setTimeout(() => resetAndRenewEvents( {_id} , "delete"), delay)
        }
    }

    if (category === "dayOff"){
        return <></>
    }
    return (
        <>
            <View style={{ width: "100%", position: "absolute", top: phoneDevice ? 0 : -5 }}>
                <TouchableOpacity activeOpacity={0.6} style={[styles.iconContainer, styles.editContainer, { width: containerWidth }]}>

                    <MaterialCommunityIcons name="pencil" size={iconSize} color={iconColor} />

                </TouchableOpacity>


                <TouchableOpacity activeOpacity={0.6} style={[styles.iconContainer, styles.deleteContainer, { width: containerWidth }]} 
                onPress={()=>setConfirmationModalVisible(true)}>

                    <Entypo name="circle-with-cross" size={iconSize} color={iconColor} />

                </TouchableOpacity>
            </View>


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir supprimer cet évènement ?"} confirmationBtnText={"Oui, supprimer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={deleteEvent} />
        </>
    )
})

const styles = StyleSheet.create({
    iconContainer: {
        aspectRatio: 1,
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