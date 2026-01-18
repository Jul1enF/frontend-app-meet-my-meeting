import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteEvent } from "@reducers/user";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { toParisDt } from "@utils/timeFunctions";

import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';

import LabelValue from "@components/text/LabelValue";
import Entypo from '@expo/vector-icons/Entypo';
import ConfirmationModal from "@components/ui/ConfirmationModal";


export default function AppointmentItem({ start, employee, appointment_type, _id, employees, jwtToken, resetAndRenewEvents }) {

    const dispatch = useDispatch()
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})

    const { category, title, price, default_duration } = appointment_type

    const getEmployeeName = (employee) => {
        const employeeFound = employees?.find(e => e._id.toString() === employee.toString())
        if (!employeeFound) return "Ce professionnel ne fait plus partie de l'équipe !"
        const { first_name, last_name } = employeeFound
        return `${first_name ? (first_name + " ") : ""}${last_name ?? ""}`
    }


    const informationsArray = [
        { label: "Date :", details: toParisDt(start).toFormat("dd/MM/yy") },
        { label: "Heure :", details: toParisDt(start).toFormat("HH:mm") },
        { label: "RDV :", details: ` ${!category ? "" : category + "  -  "}${title}  -  ${price} €  •  ${default_duration} min` },
        { label: "Avec :", details: getEmployeeName(employee) }

    ]


    // States and function to delete the appointment
    const deleteRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const deleteAppointment = async () => {

        const data = await request({
            path: "/appointments/delete-appointment",
            method: "DELETE",
            functionRef: deleteRef,
            jwtToken,
            setSessionExpired,
            params: _id.toString(),
            setModalVisible: setConfirmationModalVisible,
            setWarning: setFetchWarning,
        })

        if (data?.result) {
            const delay = data.delay ?? 0
            setTimeout(() => {
                resetAndRenewEvents({ _id, category }, "delete", "appointments")
                dispatch(deleteEvent(_id))
            }, delay)
        }
    }

    return (
        <View style={styles.mainContainer} >

            <TouchableOpacity activeOpacity={0.6} style={styles.iconContainer}
                hitSlop={{left : phoneDevice ? RPW(9) : 55, bottom : phoneDevice ? RPW(10) : 55}}
                onPress={() => setConfirmationModalVisible(true)}>
    
                <Entypo name="circle-with-cross" size={phoneDevice ? RPW(6) : 37} color={appStyle.strongGrey} />

            </TouchableOpacity>

            <View style={styles.row} >
                {
                    informationsArray.map((e, i) =>
                        <LabelValue key={i} {...e} labelStyle={styles.label} detailsStyle={styles.details} index={i} lastIndex={informationsArray.length - 1} />
                    )
                }

            </View>


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir supprimer ce RDV ?"} confirmationBtnText={"Oui, supprimer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={deleteAppointment} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: phoneDevice ? 3 : 4,
        borderColor: appStyle.strongRed,
        borderRadius: appStyle.regularItemBorderRadius,
        width: phoneDevice ? RPW(90) : 600,
        paddingHorizontal: appStyle.regularItem.paddingHorizontal,
        paddingBottom: phoneDevice ? RPW(3) : 15,
        paddingTop: phoneDevice ? RPW(4.5) : 30,
        marginBottom: phoneDevice ? RPW(4) : 20,
    },
    iconContainer: {
        position: "absolute",
        top: phoneDevice ? RPW(0.5) : 4,
        right: phoneDevice ? RPW(0.5) : 4,
        alignItems: "flex-end",
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
    },
    label: {
        ...appStyle.labelText,
        fontWeight: phoneDevice ? "900" : "700",
        lineHeight: "auto"
    },
    details: {
        ...appStyle.largeText,
        fontWeight: "500",
        lineHeight: phoneDevice ? RPW(8) : 48,
    }
})