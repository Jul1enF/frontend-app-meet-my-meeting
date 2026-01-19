import { Text, View, StyleSheet, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useScheduleFreeSlots from '@hooks/appointments-schedule/useScheduleFreeSlots';
import useAutocompleteLists from './useAutocompleteLists';
import Autocomplete from '@components/ui/Autocomplete';
import AppointmentInputs from '../inputs/AppointmentInputs';
import VacationInputs from '../inputs/VacationInputs';
import BreakInputs from '../inputs/BreakInputs';
import EventSaving from './EventSaving';
import { toParisDt, getMinDuration } from '@utils/timeFunctions';
import { eventCatTranslation } from 'constants/translations';


export default function EventRedaction({ eventRedactionContext, clientRedaction = false }) {

    // Context to know how to calcul the freeSlots, set an event and post it
    const { selectedEmployee, eventStart, setEventStart, oldEvent, events, closures, absences, workingOverrides, appointmentGapMs, selectedDate, resetAndRenewEvents } = eventRedactionContext

    // States to register the settings of the events
    const [selectedAppointmentType, setSelectedAppointmentType] = useState(oldEvent?.appointment_type ?? null)
    const [client, setClient] = useState(oldEvent?.client ?? null)
    const [unregisteredClient, setUnregisteredClient] = useState(oldEvent?.unregistered_client ?? { first_name: "", last_name: "" })
    const [category, setCategory] = useState(oldEvent?.category ?? "appointment")
    const [description, setDescription] = useState(oldEvent?.description ?? "")

    const [vacationStart, setVacationStart] = useState(
        (oldEvent?.category === ("absence" || "closure")) ? toParisDt(oldEvent.start) : eventStart ? eventStart.startOf('day') : null
    )
    const [vacationEnd, setVacationEnd] = useState(
        (oldEvent?.category === "absence" || oldEvent?.category === "closure") ? toParisDt(oldEvent.end) : eventStart ? eventStart.endOf('day') : null
    )
    const [breakDuration, setBreakDuration] = useState(
        /break/i.test(oldEvent?.category) ? getMinDuration(oldEvent.start, oldEvent.end) : 0
    )


    // Settings of the event duration depending on the last duration to have been modified (break or appointment)
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


    // Hook to get all the free appointments/breaks slots
    const { appointmentsSlots } = useScheduleFreeSlots(selectedDate, selectedEmployee, !oldEvent ? events : events.filter((e) => e._id !== oldEvent._id), closures, absences, workingOverrides, appointmentGapMs, eventDuration, oldEvent?.category === "lunchBreak")

    // Hook to get the autocomplete list for the category
    const { categoriesList } = useAutocompleteLists({ selectedEmployee })


    return (
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}
                contentContainerStyle={[
                    appStyle.pageBody,
                    { flex : "auto" }
                ]}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
                bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            >


                <Text style={appStyle.pageTitle}>
                    {!oldEvent ? "Nouvel évènement :" : `Modifier un ${clientRedaction ? "RDV" : "évènement"} :`}
                </Text>

                <View style={appStyle.largeCard}>

                    {oldEvent &&
                        <View style={{ borderBottomColor: appStyle.darkWhite, borderBottomWidth: phoneDevice ? 2 : 3, paddingBottom: phoneDevice ? RPW(1) : 6, marginBottom: phoneDevice ? RPW(1) : 10 }}>
                            <Text style={{ ...appStyle.pageSubtitle, color: appStyle.fontColorDarkBg, fontWeight: "700" }}>
                                {eventCatTranslation[category]} :
                            </Text>
                        </View>
                    }


                    {!oldEvent &&
                        <Autocomplete
                            data={categoriesList}
                            editable={false}
                            showClear={false}
                            setSelectedItem={(item) => setCategory(item?.category ?? null)}
                            initialValue={"initialValue"}
                            width="100%"
                        />
                    }


                    {category === "appointment" &&
                        <AppointmentInputs eventRedactionContext={eventRedactionContext} setClient={setClient} unregisteredClient={unregisteredClient} setUnregisteredClient={setUnregisteredClient} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} appointmentsSlots={appointmentsSlots} clientRedaction={clientRedaction} />
                    }


                    {(category === "absence" || category === "closure") &&
                        <VacationInputs vacationStart={vacationStart} setVacationStart={setVacationStart} vacationEnd={vacationEnd} setVacationEnd={setVacationEnd} description={description} setDescription={setDescription} category={category} selectedEmployee={selectedEmployee} />
                    }


                    {/break/i.test(category) &&
                        <BreakInputs breakDuration={breakDuration} setBreakDuration={setBreakDuration} eventStart={eventStart} setEventStart={setEventStart} appointmentsSlots={appointmentsSlots} description={description} setDescription={setDescription} category={category} />
                    }


                    <EventSaving selectedEmployee={selectedEmployee} eventStart={eventStart} oldEvent={oldEvent} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} client={client} unregisteredClient={unregisteredClient} category={category} description={description} vacationStart={vacationStart} vacationEnd={vacationEnd} breakDuration={breakDuration} appointmentsSlots={appointmentsSlots} resetAndRenewEvents={resetAndRenewEvents} clientRedaction={clientRedaction} />

                </View>

            </KeyboardAwareScrollView>
    );
}
