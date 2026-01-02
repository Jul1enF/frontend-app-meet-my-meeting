import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';


export default function SelectedAppointment({ informationsArray }) {

    const rows = informationsArray.map((e, i) => {
        return (
            <View key={i} style={styles.row} >
                { e.category && <Text style={styles.selectedAppointmentCategory}>
                    {e.category} :
                </Text> }

                <Text style={styles.selectedAppointmentTitle}>
                    {e.title}
                </Text>
            </View>
        )
    })

    return (
        <View style={styles.selectedAppointmentContainer} >
            {rows}
        </View>
    )
}

const styles = StyleSheet.create({
    selectedAppointmentContainer: {
        ...appStyle.largeItem,
        height: "auto",
        paddingVertical: phoneDevice ? RPW(2) : 12,
        borderWidth: phoneDevice ? 2 : 3,
        borderColor: appStyle.strongBlack,
        rowGap: phoneDevice ? RPW(1.5) : 10,
        columnGap : phoneDevice ? RPW(3) : 25,
        flexDirection : "row",
         alignItems: "center",
        flexWrap: "wrap",
    },
    row: {
        flexDirection: "row",
        rowGap: phoneDevice ? RPW(1.5) : 10,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        flexWrap: "wrap",
    },
    selectedAppointmentCategory: {
        ...(phoneDevice ? appStyle.pageSubtitle : appStyle.largeText),
        fontWeight: phoneDevice ? "900" : "700",
        marginRight: phoneDevice ? RPW(2) : 10,
    },
    selectedAppointmentTitle: {
        ...appStyle.largeText,
        textAlign: "center",
        fontWeight: "500",
        color: appStyle.strongBlack,
    }
})