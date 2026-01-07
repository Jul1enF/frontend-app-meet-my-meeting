import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useAutocompleteLists from './useAutocompleteLists';
import Autocomplete from '@components/ui/Autocomplete';
import AppointmentInputs from './AppointmentInputs';


export default function EventRedaction({ setScheduleInformations, selectedEmployee, appointmentsSlots, appointmentStart, setAppointmentStart, oldEvent, appointmentTypes, users, selectedAppointmentType, setSelectedAppointmentType }) {

    const { categoriesList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, appointmentStart)

    const [user, setUser] = useState()
    const [unregisteredUser, setUnregisteredUser] = useState({ first_name: "", last_name: "" })
    const [category, setCategory] = useState("appointment")

  
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
                        {!oldEvent ? "Nouvel évènement :" : "Modifier un évènement :"}
                    </Text>

                    <View style={[appStyle.card, { width: appStyle.largeItemWidth, paddingBottom: phoneDevice ? RPW(12) : 80 }]}>


                        <Autocomplete
                            data={categoriesList}
                            editable={false}
                            showClear={false}
                            setSelectedItem={(item) => setCategory(item?.category ?? null)}
                            initialValue={"initialValue"}
                            width="100%"
                        />

                        {category === "appointment" && 

                        <AppointmentInputs appointmentTypes={appointmentTypes} users={users} appointmentsSlots={appointmentsSlots} appointmentStart={appointmentStart} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} setAppointmentStart={setAppointmentStart} setUser={setUser} unregisteredUser={unregisteredUser} setUnregisteredUser={setUnregisteredUser} />
                        }

                       



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
        marginTop: appStyle.largeMarginTop,
    },
})