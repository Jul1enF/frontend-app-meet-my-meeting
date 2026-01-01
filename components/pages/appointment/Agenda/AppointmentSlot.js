import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, memo } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import { DateTime } from 'luxon';


export default memo(function AppointmentSlot({ start, employees }) {

    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.mainContainer} >
            <Text style={styles.hourText}>
                {start.toFormat("HH:mm")}
            </Text>
        </TouchableOpacity>
    )

})

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: appStyle.brightGrey,
        padding: phoneDevice ? RPW(2) : 15,
        borderRadius: appStyle.regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(2) : 15,
    },
    hourText: {
        ...appStyle.regularText,
        textAlign: "center",
    }
})