import { TextInput, Text, View } from "react-native";
import { useEffect, useState, useMemo } from "react";

import Autocomplete from "@components/ui/Autocomplete"
import useAutocompleteLists from "../useAutocompleteLists"

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function AppointmentInputs({ redactionContext, setClient, unregisteredClient, setUnregisteredClient, selectedAppointmentType, setSelectedAppointmentType, appointmentsSlots }) {

    // Props coming from the root
    const { eventStart, setEventStart, appointmentTypes, users, selectedEmployee } = redactionContext

    // Creation with a hook of the autocomplete lists
    const { appointmentsList, usersList, appointmentsSlotsList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, eventStart)

    const [slotWarning, setSlotWarning] = useState("")

    // Set an error if the appointment start time selected doesn't fit with the appointment selected duration in a schedule slot
    useEffect(() => {
        if (!selectedAppointmentType || !appointmentsSlotsList.length) return
        if (appointmentsSlotsList.length && !appointmentsSlotsList.some(e =>
            e.start.toMillis() === eventStart.toMillis()
        )) {
            setSlotWarning("Erreur : le rdv ne rentre pas dans le créneau ! Merci de choisir un autre horaire ci dessous :")
            setTimeout(() => setSlotWarning(""), 5000)
        }
    }, [selectedAppointmentType, appointmentsSlotsList])



    // Memoisation of the Autocomplete for the appointments slots and the users

    const slotsAutocomplete = useMemo(() => (
        <Autocomplete
            key={appointmentsSlotsList.length}
            data={appointmentsSlotsList}
            placeholderText={eventStart ? eventStart.toFormat("HH : mm") : "Horaire"}
            initialValue={"initialValue"}
            showClear={false}
            editable={false}
            setSelectedItem={(item) => item?.start && setEventStart(item?.start)}
            emptyText={!selectedAppointmentType ? "Merci de sélectionner un RDV" : "Aucun créneau disponible"}
            width="100%"
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight: "700" }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
        />
    ), [appointmentsSlotsList, eventStart, selectedAppointmentType])


    const usersAutocomplete = useMemo(() => (
        <Autocomplete
            data={usersList}
            placeholderText={"Utilisateur ( inscrit )"}
            setSelectedItem={(item) => setClient(item?.user ?? null)}
            emptyText="Aucun résultat"
            width="100%"
            inputStyle={{ height: "auto", paddingTop: phoneDevice ? RPW(3) : 22, paddingBottom: phoneDevice ? RPW(3) : 22, minHeight: appStyle.largeItemHeight }}
            inputContainerStyle={{ height: "auto" }}
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40 }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
            bold="700"
            multiline={true}
        />
    ), [usersList])




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
                    setUnregisteredClient(prev => ({ ...prev, last_name: e }))
                }}
                value={unregisteredClient.last_name}
                placeholder='Nom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />

            <TextInput
                style={{ ...appStyle.input.baseLarge, width: "100%", fontWeight: "700", color: appStyle.fontColorDarkBg }}
                onChangeText={(e) => {
                    setUnregisteredClient(prev => ({ ...prev, first_name: e }))
                }}
                value={unregisteredClient.first_name}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />


            <Text style={{...appStyle.regularText, marginTop : appStyle.mediumMarginTop, color : appStyle.fontColorDarkBg, fontWeight : "500"}}>
                <Text style={{...appStyle.largeText, color : appStyle.fontColorDarkBg, fontWeight : "700"}}>
                    Avec :
                </Text>
                {`  ${selectedEmployee.first_name}`}
            </Text>

        </>
    )
}