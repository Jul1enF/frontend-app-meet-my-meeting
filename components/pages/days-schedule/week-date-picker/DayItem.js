import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { useMemo, memo } from "react";

import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'

import { DateTime } from "luxon";
import { isSameDay } from "@utils/timeFunctions";

export default memo(function DayItem({ date, currentMonth, disabled, selectedDate, setSelectedDate }) {

    const today = useMemo(() => DateTime.now({ zone: "Europe/Paris" }).startOf("day") , [])

    const isToday = isSameDay(date, today)
    const isSelected = isSameDay(date, selectedDate)

    const opacity = disabled ? 0.4 :
        !currentMonth ? 0.6 : 1

    const todayColor = isToday && !isSelected ? { color: appStyle.strongRed } : {}
    const todayFontStyle = isToday ? { fontSize : appStyle.largeText.fontSize , fontWeight : "700"} : {}

    return (
        <View style={[styles.mainContainer, { opacity }]}>
            <TouchableOpacity style={[styles.dayContainer, isSelected && styles.selected]} activeOpacity={!disabled ? 0.6 : 0.1} onPress={() => {
                const itemDate = date.set({ hour: selectedDate.hour, minute: selectedDate.minute })
                setSelectedDate(itemDate)

            }}>
                <Text style={[styles.dayNumber, todayColor, todayFontStyle]} >
                    {date.day}
                </Text>
            </TouchableOpacity>
        </View>
    )
})

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "12%",
    },
    dayContainer : {
        width: "100%",
        maxWidth : phoneDevice ? RPW(10) : 60,
        maxHeight : phoneDevice ? RPW(10) : 60,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    selected: {
        backgroundColor: appStyle.strongRed,
        borderRadius: "50%",
    },
    dayNumber: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
        fontWeight: "500",
    }
})