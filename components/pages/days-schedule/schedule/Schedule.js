import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo, memo, useState, useCallback } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useDayEventsSchedule from '@hooks/useDayEventsSchedule';
import EventItem from './EventItem';
import ModalPageWrapper from '@components/layout/ModalPageWrapper';

import { toParisDt, isBetween } from '@utils/timeFunctions';
import Feather from '@expo/vector-icons/Feather';


export default memo(function Schedule({ scheduleContext }) {

    // SelectedAppointmentType for redaction of appointements
    const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)
    const appointmentDuration = useMemo(() => {
        if (!selectedAppointmentType) return null
        return selectedAppointmentType.default_duration
    }, [selectedAppointmentType])

    // State to display the redaction component of an event
    const [eventRedaction, setEventRedaction] = useState(false)

    // Memoised props
    const { appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedEmployee, selectedDate, defaultSchedule } = scheduleContext


    const appointmentGapMin = useMemo(() => appointmentGapMs / 1000 / 60, [appointmentGapMs])
    const minuteHeight = phoneDevice ? RPW(1.5) : 8

    // Hook to get the events, the appointments slots and the working hours
    const { appointmentsSlots, concernedEvents, minWorkingHour, maxWorkingHour } = useDayEventsSchedule(selectedDate, selectedEmployee, events, closures, absences, appointmentGapMs, defaultSchedule, appointmentDuration)


    // Memo of the working hours
    const dtDayWorkingHours = useMemo(() => {
        if (!minWorkingHour && !maxWorkingHour && !concernedEvents.length) return null
        return {
            dtDayStart: minWorkingHour ?? concernedEvents[0]?.start,
            dtDayEnd: maxWorkingHour ?? concernedEvents[0]?.end,
        }
    }, [minWorkingHour, maxWorkingHour, concernedEvents])


    // useCallBack function for construction of the grid
    const getGrid = useCallback((timeGrid) => {
        const grid = []
        if (!dtDayWorkingHours) return null
        const { dtDayStart, dtDayEnd } = dtDayWorkingHours

        let start = dtDayStart

        let displayPlusIcon = timeGrid ? false : true

        while (start <= dtDayEnd) {
            const nextStart = start.plus({ minutes: appointmentGapMin })
            const borderBottomWidth = !nextStart.minute ? phoneDevice ? 2 : 4 : 1

            if (concernedEvents?.length && !timeGrid) {
                let shouldDisplayIcon = true
                for (let event of concernedEvents) {
                    if (isBetween(event.start, start, event.end)) {
                        shouldDisplayIcon = false
                        break;
                    }
                }
                displayPlusIcon = shouldDisplayIcon
            }

            grid.push(
                <View key={start.toISO()} style={{ height: appointmentGapMin * minuteHeight, borderBottomWidth, borderBottomColor: appStyle.strongBlack, alignItems: "center", paddingTop: phoneDevice ? RPW(2) : 10, width: "100%" }}>

                    {timeGrid && <Text style={{ ...appStyle.regularText, fontWeight: "500" }}>
                        {start.toFormat("HH:mm")}
                    </Text>}

                    {displayPlusIcon &&
                        <TouchableOpacity activeOpacity={0.6} style={styles.plusIconContainer}
                        onPress={()=>setEventRedaction(true)}
                        >

                            <Feather name="plus-circle" size={phoneDevice ? RPW(6.5) : 40} color={appStyle.strongBlack} />
                            
                        </TouchableOpacity>
                    }

                </View>
            )

            start = start.plus({ minutes: appointmentGapMin })
        }

        return grid
    }, [dtDayWorkingHours, appointmentGapMin, minuteHeight, concernedEvents])


    // Memo of the two different grid
    const grid = useMemo(() => getGrid(false), [getGrid])
    const timeGrid = useMemo(() => getGrid(true), [getGrid])



    return (
        <View style={styles.mainContainer}>
            <View style={{ width: phoneDevice ? RPW(16) : 100, backgroundColor: appStyle.darkWhite2 }}>
                {timeGrid}
            </View>

            <View style={styles.columnContainer}>

                {grid}

                {concernedEvents.map((e) =>
                    <EventItem {...e} minuteHeight={minuteHeight} dtDayWorkingHours={dtDayWorkingHours} key={toParisDt(e.start).toISO()} />)}
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        backgroundColor: appStyle.pageBody.backgroundColor,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    columnContainer: {
        flex: 1,
        alignItems: "center"
    },
    plusIconContainer: {
        width: phoneDevice ? RPW(10) : 50,
        aspectRatio: 1,
        position: "absolute",
        top: phoneDevice ? RPW(2) : 10,
        right: phoneDevice ? RPW(2) : 10,
        alignItems : "flex-end"
    }
})