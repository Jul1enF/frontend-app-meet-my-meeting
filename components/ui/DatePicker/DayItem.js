import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useMemo } from "react";

import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'

import { DateTime } from "luxon";
import { isSameDay } from "@utils/timeFunctions";

export default function DayItem({ date, currentMonth, nextMonth, previousMonth, disabled, chosenDate, setChosenDate, updateViewedDate}) {

const today = useMemo(()=> DateTime.now(), [])

const isToday = isSameDay(date, today, true)
const isSelected = isSameDay(date, chosenDate, true)

const opacity = disabled ? 0.1 :
!currentMonth ? 0.5 : 1

const textColor = isToday && !isSelected ? { color : appStyle.strongRed} : {}

    return (
        <TouchableOpacity style={[styles.mainContainer, {opacity}, isSelected && styles.selected]} activeOpacity={!disabled ? 0.6 : 0.1} onPress={()=>{
            if (!disabled){
                const itemDate = date.set({ hour : chosenDate.hour, minute : chosenDate.minute})
                setChosenDate(itemDate)

                if (!currentMonth) nextMonth ? updateViewedDate(true) : updateViewedDate(false)
            }
        }}>
            <Text style={[styles.dayNumber, textColor]} >
                {date.day}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent : "center",
        alignItems : "center",
        width: "12%",
        aspectRatio : 1,
    },
    selected : {
        backgroundColor: appStyle.strongRed,
        borderRadius : "50%",
    },
    dayNumber: {
        ...appStyle.regularText,
        color : appStyle.fontColorDarkBg,
        fontWeight : "500",
    }
})