import { View, StyleSheet } from "react-native";
import { useState } from "react";

import DayItem from "./DayItem";
import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'

export default function Calendar({ chosenDate }) {
    const [viewedYear, setViewedYear] = useState(new Date(2026, 2, 17).getFullYear())
    const [viewedMonth, setViewedMonth] = useState(new Date(2026, 2, 17).getMonth())


    // Change of the week index to have weeks starting with monday
    const correctedDayIndex = (index) => {
        if (index === 0) return 6
        else return index - 1
    }

    const isDisabled = (date) => {
        if (new Date() - date < 0) return true
        else return false
    }

    const getMonthDays = (viewedYear, viewedMonth) => {
        const firstDayOfMonth = new Date(viewedYear, viewedMonth, 1)
        const firstDayOfMonthIndex = correctedDayIndex(firstDayOfMonth.getDay())

        const daysInViewedMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate()
        const daysInPrevMonth = new Date(viewedYear, viewedMonth, 0).getDate()

        const days = []

        // Add days of the previous month
        for (let i = firstDayOfMonthIndex ; i > 0 ; i--){
            const date = new Date(viewedYear, viewedMonth - 1, daysInPrevMonth - i)

            days.push({
                date,
                currentMonth : false,
                disabled : isDisabled(date)
            })
        }

        // Add days for the current month 
        for (let i = 1 ; i <= daysInViewedMonth ; i++ ){
            const date = new Date(viewedYear, viewedMonth, i)

            days.push({
                date,
                currentMonth : false,
                disabled : isDisabled(date)
            })
        }

        
        const lastDayOfMonthIndex = correctedDayIndex(days[days.length -1].date.getDay())

         console.log("lastDayOfMonthIndex :", lastDayOfMonthIndex)

        // RAJOUTER WEEK INDEX
        // RAJOUTER USEMEMO ??

        return days
    }

    const daysItems = getMonthDays(viewedYear, viewedMonth)

    const days = daysItems.map((e,i)=> <DayItem key={i} dayNumber={e.date.getDate()} />)


    return (
        <View style={styles.mainContainer} >
            {days}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        ...appStyle.card,
        flexDirection : "row",
        flexWrap : "wrap",
        width : RPW(90),
    },
})