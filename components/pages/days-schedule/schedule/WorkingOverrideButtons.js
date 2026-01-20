import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import { useSelector } from "react-redux";

import ConfirmationModal from "@components/ui/ConfirmationModal";
import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';
import { eventCatTranslation } from "constants/translations";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';


export default function WorkingOverrideButtons({ concernedEvents, setOldEvent, selectedDate, selectedEmployee }) {

    const role = useSelector((state)=> state.user.value.role)
    const _id = useSelector((state)=> state.user.value._id) 
    const firstEvent = concernedEvents[0]

    let dayCategory
    // If it is a normal working day, there is no special event at the begining of concernedEvents Array, only categories appointment, break or lunchBreak
    if (!concernedEvents.length || firstEvent.category === "break" || firstEvent.category === "lunchBreak" || firstEvent.category === "appointment") {
        dayCategory = "workingDay"
    }
    else {
        dayCategory = firstEvent.category
    }

    const canModify = role !== "employee" || _id?.toString() === selectedEmployee?._id?.toString()
    const isEditable = (dayCategory === "workingDay" || dayCategory === "workingOverride") && canModify
    const isDeletable = (dayCategory === "workingOverride" || dayCategory === "dayOff") && canModify

    const editPress = () => {
        // If it is a workingDay, we have to create an oldEvent, because there is none
        if (dayCategory === "workingDay"){
            const baseDate = selectedDate.set({second : 0, millisecond : 0})
            setOldEvent({ start : baseDate, end : baseDate, employee : selectedEmployee._id.toString(), category : dayCategory})
        }else{
            setOldEvent(firstEvent)
        }
    }

    const deletePress = () => {
        // If it is a dayOff, it is not a suppression but a post of a new working override so we set oldEvent with it to display workingOverrideRedaction
        if (dayCategory === "dayOff") setOldEvent(firstEvent)
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