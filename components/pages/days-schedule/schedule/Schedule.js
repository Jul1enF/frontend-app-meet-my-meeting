import { Text, View, StyleSheet } from 'react-native';
import { useMemo, memo, useState, useCallback } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useDayEventsSchedule from '@hooks/useDayEventsSchedule';


export default memo(function Schedule({ scheduleContext }) {

    const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)
    const appointmentDuration = useMemo(() => {
        if (!selectedAppointmentType) return null
        return selectedAppointmentType.default_duration
    }, [selectedAppointmentType])

    const { appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedEmployee, selectedDate } = scheduleContext

    const timeGridWidth = phoneDevice ? RPW(16) : 100
    const appointmentGapMin = useMemo(() => appointmentGapMs / 1000 / 60, [appointmentGapMs])
    const minuteHeight = phoneDevice ? RPW(1) : 8

    const { appointmentsSlots, concernedEvents, minWorkingHour, maxWorkingHour } = useDayEventsSchedule(selectedDate, selectedEmployee, events, closures, absences, appointmentGapMs, appointmentDuration)

    const dtDayWorkingHours = useMemo(() => {
        if (!minWorkingHour && !maxWorkingHour && !concernedEvents.length) return null
        return {
            dtDayStart: minWorkingHour ?? concernedEvents[0]?.start,
            dtDayEnd: maxWorkingHour ?? concernedEvents[0]?.end,
        }
    }, [minWorkingHour, maxWorkingHour, concernedEvents])


    const getGrid = useCallback((timeGrid) => {
        const grid = []
        if (!dtDayWorkingHours) return null
        const { dtDayStart, dtDayEnd } = dtDayWorkingHours

        let start = dtDayStart

        while (start <= dtDayEnd) {
            const nextStart = start.plus({ minutes: appointmentGapMin })
            const borderBottomWidth = !nextStart.minute ? phoneDevice ? 2 : 4 : 1

            grid.push(
                <View key={start.toISO()} style={{ height: appointmentGapMin * minuteHeight, borderBottomWidth, borderBottomColor: appStyle.strongBlack, alignItems: "center", paddingTop: phoneDevice ? RPW(2) : 10 }}>

                    {timeGrid && <Text style={{ ...appStyle.regularText, fontWeight: "500" }}>
                        {start.toFormat("HH:mm")}
                    </Text>}

                </View>
            )

            start = start.plus({ minutes: appointmentGapMin })
        }

        return grid
    }, [dtDayWorkingHours, appointmentGapMin, minuteHeight])


    const grid = useMemo(() => getGrid(false), [getGrid])
    const timeGrid = useMemo(() => getGrid(true), [getGrid])

    return (
        <View style={styles.mainContainer}>
            <View style={{ width: timeGridWidth, backgroundColor: appStyle.darkWhite2 }}>
                {timeGrid}
            </View>

            <View style={styles.columnContainer}>
                {grid}
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
        width: "100%",
    }
})