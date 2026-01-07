import { TextInput, Text, View } from "react-native";
import { useEffect, useState, useMemo } from "react";

import Autocomplete from "@components/ui/Autocomplete"
import useAutocompleteLists from "./useAutocompleteLists"

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function AppointmentInputs({ appointmentTypes, users, appointmentsSlots, selectedAppointmentType, appointmentStart, setSelectedAppointmentType, setAppointmentStart, setUser, unregisteredUser, setUnregisteredUser }) {

    const { appointmentsList, usersList, appointmentsSlotsList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, appointmentStart)

    const [slotWarning, setSlotWarning] = useState("")

    // Set an error if the appointment start time selected doesn't fit with the appointment selected duration in a schedule slot
    useEffect(() => {
        if (!selectedAppointmentType || !appointmentsSlotsList.length) return
        if (appointmentsSlotsList.length && !appointmentsSlotsList.some(e =>
            e.start.toMillis() === appointmentStart.toMillis()
        )) {
            setSlotWarning("Erreur : le rdv ne rentre pas dans le créneau ! Merci de choisir un autre horaire.")
            setTimeout(() => setSlotWarning(""), 5000)
        }
    }, [selectedAppointmentType, appointmentsSlotsList])


    // Memoisation of the Autocomplete for the appointments slots and the users

    const slotsAutocomplete = useMemo(() => (
        <Autocomplete
            key={appointmentsSlotsList.length}
            data={appointmentsSlotsList}
            placeholderText={appointmentStart ? appointmentStart.toFormat("HH : mm") : "Horaire"}
            initialValue={"initialValue"}
            showClear={false}
            editable={false}
            setSelectedItem={(item) => item?.start && setAppointmentStart(item?.start)}
            emptyText={!selectedAppointmentType ? "Merci de sélectionner un RDV" : "Aucun créneau disponible"}
            width="100%"
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight: "700" }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
        />
    ), [appointmentsSlotsList, appointmentStart, selectedAppointmentType])


    const usersAutocomplete = useMemo(() => (
        <Autocomplete
            data={usersList}
            placeholderText={"Utilisateur ( inscrit )"}
            setSelectedItem={(item) => setUser(item?.user ?? null)}
            emptyText="Aucun résultat"
            width="100%"
            inputStyle={{ height: "auto", paddingTop: phoneDevice ? RPW(3) : 22, paddingBottom: phoneDevice ? RPW(3) : 22, minHeight: appStyle.largeItemHeight }}
            inputContainerStyle={{ height: "auto" }}
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40 }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
            bold="700"
            multiline={true}
        />
    ), [])

    return (
        <>
            <Autocomplete
                data={appointmentsList}
                placeholderText={"Choix du RDV"}
                setSelectedItem={(item) => setSelectedAppointmentType(item?.appointment ?? null)}
                emptyText="Aucun résultat"
                width="100%"
                inputStyle={{ height: "auto", paddingTop: phoneDevice ? RPW(2.5) : 22, paddingBottom: phoneDevice ? RPW(2.5) : 22, minHeight: appStyle.largeItemHeight }}
                inputContainerStyle={{ height: "auto" }}
                suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6.5) : 40 }}
                listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(2.5) : 22 }}
                bold="700"
                multiline={true}
            />

            <Text style={[appStyle.warning, !slotWarning && { height: 0, marginTop: 0 }]}>
                {slotWarning}
            </Text>


            {slotsAutocomplete}

            {usersAutocomplete}

            <Text style={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop, fontWeight : "600" }}>
                Utilisateur non enregistré :
            </Text>

            <TextInput
                style={{ ...appStyle.input.baseLarge, width: "100%", fontWeight: "700", color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredUser(prev => ({ ...prev, last_name: e }))
                }}
                value={unregisteredUser.last_name}
                placeholder='Nom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />

            <TextInput
                style={{ ...appStyle.input.baseLarge, width: "100%", fontWeight: "700", color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredUser(prev => ({ ...prev, first_name: e }))
                }}
                value={unregisteredUser.first_name}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />
        </>
    )
}