import { View, Text, StyleSheet } from "react-native";
import { useState, useMemo } from "react";

import DayItem from "./DayItem";
import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"
import moment from 'moment/min/moment-with-locales'


import { getMonthDays } from "@components/ui/DatePicker/datePickerUtils";
import { upperCaseInitial } from "@utils/timeFunctions";

export default function Calendar({ chosenDate, setChosenDate, setCalendarVisible }) {
    moment.locale('fr')

    const [viewedDate, setViewedDate] = useState(chosenDate)
    const viewedYear = viewedDate.getFullYear()
    const viewedMonth = viewedDate.getMonth()

    const daysItems = useMemo(() => getMonthDays(viewedYear, viewedMonth), [viewedYear, viewedMonth])

    const updateViewedDate = (increment) => {
        if (increment) setViewedDate(new Date(viewedYear, viewedMonth + 1))
        else setViewedDate(new Date(viewedYear, viewedMonth - 1))
    }

    const monthName = upperCaseInitial(moment(viewedDate).format("MMMM YYYY"))

    const daysName = useMemo(() => {
        const daysName = []
        for (let i = 1; i <= 7; i++) {
            const name = upperCaseInitial(moment().day(i).format("dd"))
            daysName.push(name)
        }
        return daysName
    },[])


    return (
        <View style={styles.mainContainer} >
            <MaterialDesignIcons name="close" color={appStyle.brightGrey} size={phoneDevice ? RPW(4.8) : 32} style={styles.closeIcon} onPress={() => setCalendarVisible(false)} />

            <View style={styles.monthHeader}>
                <FontAwesome5 name="chevron-left" color={appStyle.brightGrey} size={phoneDevice ? RPW(4.2) : 25} onPress={() => updateViewedDate(false)} />

                <Text style={styles.monthText}>
                    {monthName}
                </Text>

                <FontAwesome5 name="chevron-right" color={appStyle.brightGrey} size={phoneDevice ? RPW(4.2) : 25} onPress={() => updateViewedDate(true)} />
            </View>

            <View style={styles.daysNameContainer} >
                {daysName.map((e, i) => <Text style={styles.dayName} key={i}>{e}</Text>)}
            </View>

            <View style={styles.daysContainer} key={`${viewedYear}-${viewedMonth}`}>
                {daysItems.map((e, i) => <DayItem key={i} {...e} chosenDate={chosenDate} setChosenDate={setChosenDate} updateViewedDate={updateViewedDate} />)}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        ...appStyle.card,
        width: phoneDevice ? RPW(90) : appStyle.regularItemWidth,
        paddingTop: phoneDevice ? RPW(5.7) : 35,
        paddingBottom: phoneDevice ? RPW(6.5) : 30,
    },
    closeIcon: {
        position: "absolute",
        zIndex: 10,
        top: phoneDevice ? RPW(1.2) : 7,
        right: phoneDevice ? RPW(1) : 6,
    },
    monthHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: phoneDevice ? RPW(10) : 60,
    },
    monthText: {
        ...appStyle.pageSubtitle,
        color: appStyle.fontColorDarkBg,
        fontWeight: "700",
    },
    daysNameContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: "2.66%",
        height: phoneDevice ? RPW(8) : 50,
        marginTop: phoneDevice ? RPW(1.8) : 19,
    },
    dayName: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
        width: "12%",
        textAlign: "center",
    },
    daysContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        columnGap: "2.66%",
        rowGap: phoneDevice ? RPW(1.5) : 10,
        marginTop: phoneDevice ? RPW(1.8) : 19,
    }
})