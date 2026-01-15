import { View, Text } from 'react-native';
import { useState, useRef } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';

import Button from '@components/ui/Button';
import ConfirmationModal from '@components/ui/ConfirmationModal';


export default function EventSaving({ selectedEmployee, eventStart, oldEvent, jwtToken, selectedAppointmentType: appType, setSelectedAppointmentType, client, unregisteredClient, category, description, vacationStart, vacationEnd, breakDuration, appointmentsSlots, resetAndRenewEvents }) {

    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [eventWarning, setEventWarning] = useState("")
    const [fetchWarning, setFetchWarning] = useState({})
    const [eventToSave, setEventToSave] = useState(null)

    // Function to display a warning message if the form is not valid
    const displayWarning = (message) => {
        setEventWarning(message)
        setTimeout(() => setEventWarning(""), 4000)
    }

    let event = {}

    // Function to check that the form is valid and set the fetch settings
    const eventValidation = () => {

        // Appointment
        if (category === "appointment") {
            if (!appType || (!client && !unregisteredClient.first_name && !unregisteredClient.last_name)) {
                displayWarning("Erreur : Informations manquantes")
                return
            }
            if (client && (unregisteredClient.first_name || unregisteredClient.last_name)) {
                displayWarning("Erreur : Deux clients différents sélectionnés")
                return
            }
            if (!appointmentsSlots.some(e => e.start.toMillis() === eventStart.toMillis())) {
                displayWarning(appointmentsSlots.length ? "Erreur : Le rdv ne rentre pas dans le créneau" : "Erreur : Aucun créneau disponible ce jour pour ces critères !")
                return
            }

            const unregistered_client = (!unregisteredClient.first_name && !unregisteredClient.last_name) ? null : unregisteredClient

            event = {
                ...(oldEvent ?? event),
                start: eventStart.toUTC().toJSDate(),
                end: eventStart.plus({ minutes: appType.default_duration }).toUTC().toJSDate(),
                appointment_type: appType._id,
                client,
                unregistered_client,
                employee: selectedEmployee._id,
                category,
            }
        }

        // Break
        if (category === "break" || category === "lunchBreak") {
            if (!breakDuration || (!description && category === "break")) {
                displayWarning("Erreur : Informations manquantes")
                return
            }
            if (!appointmentsSlots.some(e => e.start.toMillis() === eventStart.toMillis())) {
                displayWarning("Erreur : La pause ne rentre pas dans le créneau")
                return
            }

            event = {
                ...(oldEvent ?? event),
                start: eventStart.toUTC().toJSDate(),
                end: eventStart.plus({ minutes: breakDuration }).toUTC().toJSDate(),
                description,
                employee: selectedEmployee._id,
                category,
            }
        }

        //Vacations
        if (category === "absence" || category === "closure") {
            if (vacationEnd < vacationStart) {
                displayWarning("Erreur : La date de fin est inférieure à la date de début")
                return
            }
            if (!description) {
                displayWarning("Erreur : Description manquante")
                return
            }

            event = {
                ...(oldEvent ?? event),
                start: vacationStart.toUTC().toJSDate(),
                end: vacationEnd.toUTC().toJSDate(),
                description,
                employee: selectedEmployee._id,
                category,
            }
        }

        // For a closure all employees are concerned, not juste one, so we don't put that field
        category === "closure" && delete event.employee

        // Case where default start and end were setted for an old event (for the schedule display)
        if (event.defaultStart || event.defaultEnd) {
            delete event.defaultStart
            delete event.defaultEnd
        }

        // If it is a creation of a lunch break we put the marker to signal that it's and update and not a suppression of the default one
        if (category === "lunchBreak") event.lunch_break_modification = "update"

        setEventToSave(event)

        setConfirmationModalVisible(true)
    }




    // States and function to register the event
    const registerRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const registerEvent = async () => {

        const data = await request({
            path: "/events/create-or-update",
            method: "PUT",
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
            setTimeout(() => resetAndRenewEvents(eventSaved, oldEvent?._id ? "update" : "create"), delay)
        }
        else if (data.delay) {
            setTimeout(() => {
                data.appointmentTypeError && setSelectedAppointmentType(null)
                resetAndRenewEvents()
            }, data.delay)
        }
    }

    return (
        <>
            <Text style={[appStyle.warning, !eventWarning && { height: 0, marginTop: 0 }]}>
                {eventWarning}
            </Text>

            <Button func={eventValidation} text={!oldEvent ? "Enregistrer l'évènement" : "Modifier l'évènement"} style={{ height: appStyle.mediumItemHeight, marginTop: appStyle.largeMarginTop }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, letterSpacing: phoneDevice ? RPW(0.3) : 2 }} />


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={`Êtes vous sûr(e) de vouloir ${!oldEvent ? "enregistrer" : "modifier"} cet évènement ?`} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={registerEvent} />
        </>
    )
}
