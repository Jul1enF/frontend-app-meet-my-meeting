import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, memo, useMemo, useCallback, useLayoutEffect } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useDayEventsSchedule from './useDayEventsSchedule';
import AppointmentSlot from './AppointmentSlot';
import { slotPressed } from './agendaUtils';

export default memo(function DayColumn({ agendaUtils, width, dtDay }) {

    const { setSelectedAppointmentSlot, events, closures, absences, appointmentGapMs, sortFreeEmployees, appointmentDuration, selectedEmployees, employeesAutocompleteList } = agendaUtils

    const { appointmentsSlots, concernedEvents } = useDayEventsSchedule(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration)


    // Function when a slot is pressed in a useCallBack to be memoised
    const onSlotPress = useCallback((start, employees) => {
        slotPressed(start, employees, setSelectedAppointmentSlot, sortFreeEmployees, concernedEvents, employeesAutocompleteList)
    }, [sortFreeEmployees, concernedEvents, employeesAutocompleteList])

    // useMemo to create a memoised version of the informations that will be passed to the slots
    const slots = useMemo(() => {
        return appointmentsSlots.map(e => ({
            key: e.start.toMillis(),
            props: e,
            onPress: () => onSlotPress(e.start, e.employees),
        }))
    }, [appointmentsSlots, onSlotPress])


    // State for the list status
    const [entireListVisible, setEntireListVisible] = useState(true)
    const [isOverflowing, setIsOverflowing] = useState(false)

    // Reset the list status when the slots changes
    useLayoutEffect(() => {
        setIsOverflowing(false)
        setEntireListVisible(true)
    }, [appointmentsSlots])

    // Max height at first sight for the column
    const maxHeight = phoneDevice ? RPW(152) : 1050

    // Function used on the layout of the column to set the list status
    const onLayoutColumn = useCallback((e) => {
        if (isOverflowing) return

        const { height } = e.nativeEvent.layout
        if (height > maxHeight) {
            setEntireListVisible(false)
            setIsOverflowing(true)
        }
    }, [isOverflowing])



    return (
        <View style={{ width, alignItems: "center", minHeight: phoneDevice ? RPW(38) : 250, marginTop: appStyle.regularMarginTop }} >
            <View style={styles.dayTitleContainer}>

                <Text style={styles.dayTitle} >
                    {dtDay.toFormat("ccc")}
                </Text>

                <Text style={styles.dayTitle} >
                    {dtDay.toFormat("dd MMM")}
                </Text>

            </View>

            <View
                style={[{ width: "100%", alignItems: "center", overflow: "hidden" }, !entireListVisible && { maxHeight }]}
                onLayout={onLayoutColumn}
            >

                {slots.map(slot => (
                    <TouchableOpacity
                        key={slot.key}
                        activeOpacity={0.6}
                        onPress={slot.onPress}
                    >
                        <AppointmentSlot {...slot.props} />
                    </TouchableOpacity>
                ))}

            </View>

            {isOverflowing && <TouchableOpacity activeOpacity={0.6} style={styles.visibilityButton} onPress={() => setEntireListVisible(!entireListVisible)} >
                <Text style={styles.visibilityText}>
                    {entireListVisible ? "Voir moins" : "Voir plus"}
                </Text>
            </TouchableOpacity>}

        </View>
    )
})

const styles = StyleSheet.create({
    dayTitle: {
        ...appStyle.regularText,
        textAlign: "center",
        paddingVertical: phoneDevice ? RPW(0.8) : 4,
        fontWeight: "500"
    },
    dayTitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: appStyle.mediumGrey,
        width: "100%",
        paddingBottom: phoneDevice ? RPW(0.8) : 4,
        marginBottom: phoneDevice ? RPW(2) : 10,
    },
    visibilityButton: {
        backgroundColor: appStyle.strongBlack,
        paddingVertical: phoneDevice ? RPW(2) : 15,
        paddingHorizontal: phoneDevice ? RPW(3) : 30,
        borderRadius: appStyle.regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(2) : 15,
    },
    visibilityText: {
        ...appStyle.regularText,
        textAlign: "center",
        color: appStyle.fontColorDarkBg,
        fontWeight: "500",
    }
})
