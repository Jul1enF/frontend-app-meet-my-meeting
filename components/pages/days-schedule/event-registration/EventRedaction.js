import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useAutocompleteLists from './useAutocompleteLists';
import Autocomplete from '@components/ui/Autocomplete';
import AppointmentInputs from './AppointmentInputs';
import VacationInputs from './VacationInputs';
import BreakInputs from './BreakInputs';


export default function EventRedaction({ redactionContext }) {

    const { setScheduleInformations, selectedEmployee, appointmentsSlots, eventStart, setEventStart, oldEvent, appointmentTypes, users, selectedAppointmentType, setSelectedAppointmentType, jwtToken } = redactionContext

    const { categoriesList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, eventStart)

    const [client, setClient] = useState()
    const [unregisteredUser, setUnregisteredUser] = useState({ first_name: "", last_name: "" })
    const [category, setCategory] = useState("appointment")
    const [description, setDescription] = useState("")
    const [vacationStart, setVacationStart] = useState(eventStart.startOf('day'))
    const [vacationEnd, setVacationEnd] = useState(eventStart.startOf('day'))


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
                            setSelectedItem={(item) => setCategory(item?.category ?? null) }
                            initialValue={"initialValue"}
                            width="100%"
                        />

                        {category === "appointment" &&
                            <AppointmentInputs redactionContext={redactionContext} setClient={setClient} unregisteredUser={unregisteredUser} setUnregisteredUser={setUnregisteredUser} />
                        }

                        {(category === "absence" || category === "closure") &&
                            <VacationInputs vacationStart={vacationStart} setVacationStart={setVacationStart} vacationEnd={vacationEnd} setVacationEnd={setVacationEnd} description={description} setDescription={setDescription} category={category} />
                        }

                        {category === "break" && 
                            <BreakInputs breakDuration={breakDuration} setBreakDuration={setBreakDuration} eventStart={eventStart} setEventStart={setEventStart} appointmentsSlots={appointmentsSlots} />
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