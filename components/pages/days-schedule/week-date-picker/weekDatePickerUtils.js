import { DateTime } from "luxon";
import { isBefore, isBetween, upperCaseInitial } from "@utils/timeFunctions";


export const getWeekDetails = (selectedDate, firstWeekDay) => {
    if (!selectedDate || !firstWeekDay) return {}

    const now = DateTime.now({ zone: "Europe/Paris" }).startOf("day")

    const weekDatesArray = []
    for (let i = 0; i < 7; i++) {
        weekDatesArray.push(firstWeekDay.plus({ days: i }))
    }

    let dtMonthAndYearViewed

    // If the selected date is displayed, we set the name of the current month and year to its
    if (isBetween(weekDatesArray[0], selectedDate, weekDatesArray[6], true)) {
        dtMonthAndYearViewed = selectedDate
    }
    // Else we try to find the month that is the most present in the displayed dates
    else {
        const monthAndYearStatusObject = weekDatesArray.reduce((acc, date) => {
            const key = date.month
            if (!acc[key]) acc[key] = { month: key, year: date.year, count: 1 }
            else acc[key].count += 1
            return acc
        }, {})

        const monthAndYearStatusArray = Object.values(monthAndYearStatusObject)
        monthAndYearStatusArray.sort((a, b) => b.count - a.count)

        const { year, month } = monthAndYearStatusArray[0]
        dtMonthAndYearViewed = now.set({ year, month })
    }


    // Settings to get an array of the days to display

    const dayStatus = (date) => {
        return {
            date,
            currentMonth: date.month === dtMonthAndYearViewed.month &&
                date.year === dtMonthAndYearViewed.year,
            disabled: isBefore(date, now),
            dayName: date.toFormat("ccc")
        }
    }

    const daysArray = weekDatesArray.map((e) => dayStatus(e))

    return { daysArray, monthName: upperCaseInitial(dtMonthAndYearViewed.toFormat("MMMM yyyy")) }
}