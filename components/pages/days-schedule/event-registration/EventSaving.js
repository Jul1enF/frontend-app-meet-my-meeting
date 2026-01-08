import { View, Text } from 'react-native';
import { useState, useRef } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';

import Button from '@components/ui/Button';
import ConfirmationModal from '@components/ui/ConfirmationModal';


export default function EventSaving({ setScheduleInformations, selectedEmployee, eventStart, setEventStart, oldEvent, jwtToken, selectedAppointmentType: appType, client, unregisteredClient, category, description, vacationStart, vacationEnd, breakDuration, appointmentsSlots, resetAndRenewEvents }) {

    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [eventWarning, setEventWarning] = useState("")
    const [fetchWarning, setFetchWarning] = useState({})
    const [eventToSave, setEventToSave] = useState(null)
    const [path, setPath] = useState("null")
    const [method, setMethod] = useState("")

    // Function to display a warning message if the form is not valid
    const displayWarning = (message) => {
        setEventWarning(message)
        setTimeout(() => setEventWarning(""), 4000)
    }

    // Function to check that the form is valid
    const eventValidation = () => {
        if (category === "appointment") {
            if (!appType || (!client && !unregisteredClient.first_name && !unregisteredClient.last_name)) {
                displayWarning("Erreur : Informations manquantes")
                return
            }
            if (!appointmentsSlots.some(e => e.start.toMillis() === eventStart.toMillis())) {
                displayWarning("Erreur : Le rdv ne rentre pas dans le créneau")
                return
            }

            const unregistered_client = (!unregisteredClient.first_name && !unregisteredClient.last_name) ? null : unregisteredClient

            setEventToSave({
                start: eventStart.toUTC().toJSDate(),
                end: eventStart.plus({ minutes: appType.default_duration }).toUTC().toJSDate(),
                employee: selectedEmployee._id,
                category: "appointment",
                appointment_type: appType._id,
                client,
                unregistered_client,
                proRegistration: true,
            })

            if (!oldEvent) {
                setPath("appointments/appointment-registration")
                setMethod("POST")
            }

            setConfirmationModalVisible(true)
        }
    }




    // States and function to register the event
    const registerRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const registerEvent = async () => {
        const data = await request({
            path,
            method,
            body: { eventToSave },
            jwtToken,
            setSessionExpired,
            functionRef: registerRef,
            setWarning: setFetchWarning,
            setModalVisible: setConfirmationModalVisible,
        })

        if (data?.result) {
            const { eventSaved } = data
            const delay = data.delay ?? 0
            setTimeout(() => resetAndRenewEvents(eventSaved), delay)
        }
        else if (data.delay) {
            setTimeout(() => resetAndRenewEvents(), data.delay)
        }
    }

    return (
        <>
            <Text style={[appStyle.warning, !eventWarning && { height: 0, marginTop: 0 }]}>
                {eventWarning}
            </Text>

            <Button func={eventValidation} text="Enregistrer l'évènement" marginTop={appStyle.largeMarginTop} style={{ height: appStyle.regularItemHeight * (phoneDevice ? 1.2 : 1.25) }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, letterSpacing: phoneDevice ? RPW(0.3) : 2 }} />


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir enregistrer cet évènement ?"} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={registerEvent} />
        </>
    )
}
