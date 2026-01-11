import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo, memo, useState, useCallback, useEffect } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useScheduleEvents from '@hooks/useScheduleEvents';
import EventItem from './EventItem';

import { toParisDt, isBetween } from '@utils/timeFunctions';
import Feather from '@expo/vector-icons/Feather';


export default memo(function Schedule({ scheduleContext }) {


    // Memoised props
    const { events, closures, absences, appointmentGapMs, selectedEmployee, selectedDate, defaultSchedule, setEventStart, setOldEvent, resetAndRenewEvents } = scheduleContext


    // Height of one minutes and appointment gap duration in minutes
    const appointmentGapMin = useMemo(() => appointmentGapMs / 1000 / 60, [appointmentGapMs])
    const minuteHeight = phoneDevice ? RPW(1.5) : 8

    // Hook to get the events, the appointments slots and the working hours
    const { concernedEvents, minWorkingHour, maxWorkingHour } = useScheduleEvents(selectedDate, selectedEmployee, events, closures, absences, defaultSchedule)


    // Memo of the working hours
    const dtDayWorkingHours = useMemo(() => {
        if (!minWorkingHour && !maxWorkingHour && !concernedEvents.length) return null
        return {
            // If we don't have the min and max working hours it means it is a vacation (absence or closure) or a day off so we use the event default start and end (setted on defautlSchedule)
            dtDayStart: minWorkingHour ?? concernedEvents[0]?.defaultStart,
            dtDayEnd: maxWorkingHour ?? concernedEvents[0]?.defaultEnd,
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
            const dtSlotStart = start

            const nextStart = start.plus({ minutes: appointmentGapMin })
            const borderBottomWidth = !nextStart.minute ? phoneDevice ? 2 : 4 : 1

            // Logic to know if a plus icon (for adding an event) is displayed or not (because there is an event on that slot or it's the end of the day)
            if (concernedEvents?.length && !timeGrid) {
                let shouldDisplayIcon = true
                if (start.toMillis() === dtDayEnd.toMillis()) shouldDisplayIcon = false
                else {
                    for (let event of concernedEvents) {
                        if (isBetween(event.start, start, event.end)) {
                            shouldDisplayIcon = false
                            break;
                        }
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
                            onPress={() => setEventStart(dtSlotStart)}
                        >

                            <Feather name="plus-circle" size={phoneDevice ? RPW(6.5) : 40} color={appStyle.strongBlack} />

                        </TouchableOpacity>
                    }

                </View>
            )

            start = nextStart
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
                    <EventItem event={e} minuteHeight={minuteHeight} dtDayWorkingHours={dtDayWorkingHours} setEventStart={setEventStart} setOldEvent={setOldEvent} key={toParisDt(e.start ?? e.defaultStart).toISO()} resetAndRenewEvents={resetAndRenewEvents} />)}
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
        alignItems: "flex-end"
    }
})