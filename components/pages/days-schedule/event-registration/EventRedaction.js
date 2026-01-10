import { Text, View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useScheduleFreeSlots from '@hooks/useScheduleFreeSlots';
import useAutocompleteLists from './useAutocompleteLists';
import Autocomplete from '@components/ui/Autocomplete';
import AppointmentInputs from './inputs/AppointmentInputs';
import VacationInputs from './inputs/VacationInputs';
import BreakInputs from './inputs/BreakInputs';
import EventSaving from './EventSaving';


export default function EventRedaction({ redactionContext }) {

    const { selectedEmployee, eventStart, setEventStart, oldEvent, appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedDate, jwtToken, resetAndRenewEvents } = redactionContext

    const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)
    const [client, setClient] = useState(null)
    const [unregisteredClient, setUnregisteredClient] = useState({ first_name: "", last_name: "" })
    const [category, setCategory] = useState("appointment")
    const [description, setDescription] = useState("")
    const [vacationStart, setVacationStart] = useState(eventStart ? eventStart.startOf('day') : null)
    const [vacationEnd, setVacationEnd] = useState(eventStart ? eventStart.endOf('day') : null)
    const [breakDuration, setBreakDuration] = useState(0)

    // Settings of the event duration depending on the last duration to have been modified
    const [eventDuration, setEventDuration] = useState(null)
    const prevDurations = useRef({})
    useEffect(() => {
        const appDuration = selectedAppointmentType?.default_duration
        if (prevDurations.current.breakDuration !== breakDuration) setEventDuration(breakDuration)
        else if (prevDurations.current.appDuration !== appDuration) {
            setEventDuration(appDuration)
        }
        prevDurations.current = { breakDuration, appDuration }
    }, [breakDuration, selectedAppointmentType])


    const { appointmentsSlots } = useScheduleFreeSlots(selectedDate, selectedEmployee, events, closures, absences, appointmentGapMs, eventDuration)

    const { categoriesList } = useAutocompleteLists(appointmentTypes, users, appointmentsSlots, eventStart, selectedEmployee)


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
                            <AppointmentInputs redactionContext={redactionContext} setClient={setClient} unregisteredClient={unregisteredClient} setUnregisteredClient={setUnregisteredClient} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} appointmentsSlots={appointmentsSlots} />
                        }

                        {(category === "absence" || category === "closure") &&
                            <VacationInputs vacationStart={vacationStart} setVacationStart={setVacationStart} vacationEnd={vacationEnd} setVacationEnd={setVacationEnd} description={description} setDescription={setDescription} category={category} selectedEmployee={selectedEmployee} />
                        }

                        {category === "break" &&
                            <BreakInputs breakDuration={breakDuration} setBreakDuration={setBreakDuration} eventStart={eventStart} setEventStart={setEventStart} appointmentsSlots={appointmentsSlots} description={description} setDescription={setDescription} />
                        }


                        <EventSaving selectedEmployee={selectedEmployee} eventStart={eventStart} setEventStart={setEventStart} oldEvent={oldEvent} jwtToken={jwtToken} selectedAppointmentType={selectedAppointmentType} client={client} unregisteredClient={unregisteredClient} category={category} description={description} vacationStart={vacationStart} vacationEnd={vacationEnd} breakDuration={breakDuration} appointmentsSlots={appointmentsSlots} resetAndRenewEvents={resetAndRenewEvents} />

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