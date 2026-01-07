import { TextInput, Text, View } from "react-native";

import Autocomplete from "@components/ui/Autocomplete"
import useAutocompleteLists from "./useAutocompleteLists"

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function AppointmentInputs({ appointmentTypes, users, appointmentsSlots, selectedAppointmentType, appointmentStart, setSelectedAppointmentType, setAppointmentStart, setUser, unregisteredUser, setUnregisteredUser }) {

    const { appointmentsList, usersList, appointmentsSlotsList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, appointmentStart)

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

            <Autocomplete
                key={appointmentsSlotsList.length}
                data={appointmentsSlotsList}
                placeholderText={"Horaire"}
                initialValue={"initialValue"}
                showClear={false}
                editable={false}
                setSelectedItem={(item) => item?.start && setAppointmentStart(item?.start)}
                emptyText={!selectedAppointmentType ? "Merci de sélectionner un RDV" : "Aucun créneau disponible"}
                width="100%"
                suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight: "700" }}
                listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
            />

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

            <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.regularMarginTop * 1.5 }}>
                Utilisateur non enregistré
            </Text>

            <TextInput
                style={{ ...appStyle.input.baseLarge, width: "100%", fontWeight: "700" }}
                onChangeText={(e) => {
                    setUnregisteredUser(prev => ({...prev, first_name : e}))
                }}
                value={unregisteredUser.first_name}
                placeholder='Prénom'
                placeholderTextColor={appStyle.placeholderColor}
                autoCapitalize="words"
            />
        </>
    )
}