import { Text, View, StyleSheet } from 'react-native';
import { useState, memo } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import useDayEventsSchedule from '../useDayEventsSchedule';
import AppointmentSlot from './AppointmentSlot';
import { DateTime } from 'luxon';


export default memo(function DayColumn({ dayColumnUtils, width, dtDay, selectedEmployees }) {

    const { selectedAppointmentSlot, setSelectedAppointmentSlot, events, closures, absences, appointmentGapMs, sortFreeEmployees, appointmentDuration } = dayColumnUtils

    const { appointmentsSlots } = useDayEventsSchedule(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration)

    const slots = appointmentsSlots.map((e, i)=> <AppointmentSlot key={e.start.toMillis()} {...e} /> )

    return (
        <View style={[{ width, alignItems: "center", minHeight : phoneDevice ? RPW(38) : 250, marginTop : appStyle.regularMarginTop }]} >
            <View style={styles.dayTitleContainer}>

                <Text style={styles.dayTitle} >
                    {dtDay.toFormat("ccc")}
                </Text>

                <Text style={styles.dayTitle} >
                    {dtDay.toFormat("dd MMM")}
                </Text>

            </View>

             {slots}

        </View>
    )
})

const styles = StyleSheet.create({
    dayTitle: {
        ...appStyle.regularText,
        textAlign: "center",
        paddingVertical: phoneDevice ? RPW(0.8) : 4,
        fontWeight : "500"
    },
    dayTitleContainer : {
        borderBottomWidth : 1,
        borderBottomColor : appStyle.mediumGrey,
        width : "100%",
        paddingBottom : phoneDevice ? RPW(0.8) : 4,
        marginBottom : phoneDevice ? RPW(2) : 10,
    }
})
