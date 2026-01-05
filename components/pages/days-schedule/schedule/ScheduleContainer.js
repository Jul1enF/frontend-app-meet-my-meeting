import { Text, View, StyleSheet } from 'react-native';
import { useMemo, memo, useState } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useLayoutSpaces from '@hooks/useLayoutSpaces';
import useDayEventsSchedule from '@hooks/useDayEventsSchedule';


export default memo(function ScheduleContainer ({ scheduleContext }) {
    const [selectedAppointmentType, setSelectedAppointmentType]= useState(null)
    const appointmentDuration = useMemo(()=>{
        if (!selectedAppointmentType) return null
        return selectedAppointmentType.default_duration
    },[selectedAppointmentType])

    const { appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedEmployee, selectedDate } = scheduleContext

    const timeGridWidth = phoneDevice ? RPW(15) : 100
    const appointmentGapMin = useMemo(()=> appointmentGapMs / 1000 / 60, [appointmentGapMs])
    const minuteHeight = phoneDevice ? RPW(2) : 15

    const { appointmentsSlots, concernedEvents } = useDayEventsSchedule(selectedDate, selectedEmployee, events, closures, absences, appointmentGapMs, appointmentDuration)

    console.log("CONCERNED EVENTS :", concernedEvents)

    return (
        <View style={styles.mainContainer}>
            <View style={[{width : timeGridWidth, height : 1000, backgroundColor : "red"}]}>

            </View>

            <View style={styles.columnContainer}>

            </View>

        </View>
    )
})

const styles = StyleSheet.create({
    mainContainer : {
        width : "100%",
        backgroundColor : appStyle.pageBody.backgroundColor,
        alignItems : "flex-start",
        justifyContent : "flex-start",
        flexDirection : "row",
    },
    columnContainer : {
        width : "100%",
    }
})