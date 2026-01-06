import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useAutocompleteLists from './useAutocompleteLists';
import Autocomplete from '@components/ui/Autocomplete';


export default function AppointmentRedaction({ setScheduleInformations, selectedEmployee, appointmentsSlots, appointmentStart, setAppointmentStart, isNewAppointment, appointmentTypes, users, selectedAppointmentType, setSelectedAppointmentType }) {

    const { appointmentsList, usersList, appointmentsSlotsList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, appointmentStart)

    const [user, setUser] = useState()
    const [unregisteredUser, setUnregisteredUser] = useState({ first_name: "", last_name: "" })
  
    return (
        <>
            <KeyboardAvoidingView style={{ width: "100%", height: "100%" }} keyboardVerticalOffset={phoneDevice ? 30 : 150} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={[appStyle.pageBody, { flex: "auto" }]} keyboardShouldPersistTaps="handled">

                    {/* <KeyboardAwareScrollView
                    style={{ width: "100%", height: "100%" }}
                    contentContainerStyle={[appStyle.pageBody, {flex : "auto"}]}
                    bottomOffset={Platform.OS === 'ios' ? 40 : 20}
                > */}


                    <Text style={appStyle.pageTitle}>
                        {isNewAppointment ? "Nouveau RDV :" : "Modifier un RDV :"}
                    </Text>

                    <View style={[appStyle.card, { width: appStyle.largeItemWidth, paddingBottom: phoneDevice ? RPW(12) : 80 }]}>

                        <Autocomplete
                            data={appointmentsList}
                            placeholderText={"Choix du RDV"}
                            setSelectedItem={(item) => setSelectedAppointmentType(item?.appointment ?? null)}
                            emptyText="Aucun résultat"
                            width="100%"
                            inputStyle={{height: "auto", paddingTop: phoneDevice ? RPW(2.5) : 22, paddingBottom : phoneDevice ? RPW(2.5) : 22}}
                            inputContainerStyle={{height: "auto"}}
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
                            setSelectedItem={(item) => setAppointmentStart(item?.start ?? null)}
                            emptyText={ !selectedAppointmentType ? "Merci de sélectionner un RDV" : "Aucun créneau disponible"}
                            width="100%"
                            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight : "700" }}
                            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
                        />

                        <Autocomplete
                            data={usersList}
                            placeholderText={"Utilisateur ( inscrit )"}
                            setSelectedItem={(item) => setUser(item?.user ?? null)}
                            emptyText="Aucun résultat"
                            width="100%"
                            inputStyle={{height: "auto", paddingTop: phoneDevice ? RPW(2.5) : 22, paddingBottom : phoneDevice ? RPW(2.5) : 22}}
                            inputContainerStyle={{height: "auto"}}
                            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40 }}
                            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
                            bold="700"
                            multiline={true}
                        />



                    </View>

                    {/* </KeyboardAwareScrollView> */}

                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        ...appStyle.card,
        marginTop: appStyle.mediumMarginTop,
    },
})