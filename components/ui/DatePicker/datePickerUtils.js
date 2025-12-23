import { DateTime } from "luxon"

export const getMonthDays = (viewedYear, viewedMonth) => {
    const firstDayOfMonth = DateTime.now().set({ year : viewedYear, month : viewedMonth, day : 1})
    const firstDayOfMonthIndex = firstDayOfMonth.weekday

    const daysInViewedMonth = firstDayOfMonth.daysInMonth

    const days = []

    const setToMidnight = (date) => date.set({ hour : 0, minute : 0, second : 0, millisecond : 0})

    const today = setToMidnight(DateTime.now())

    const isDisabled = (date) => date < today

    // Add days of the previous month
    for (let i = firstDayOfMonthIndex - 1; i > 0; i--) {
        const date = firstDayOfMonth.minus({days : i})

        days.push({
            date,
            currentMonth: false,
            previousMonth: true,
            disabled: isDisabled(date)
        })
    }

    // Add days for the current month 
    for (let i = 0; i < daysInViewedMonth; i++) {
        const date = firstDayOfMonth.plus({days : i})

        days.push({
            date,
            currentMonth: true,
            disabled: isDisabled(date)
        })
    }


    // Add days for next month

    let nextMonthDay = 1
    while (days.length % 7 !== 0) {
        const date = DateTime.now().set({ year : viewedYear, month : viewedMonth + 1, day : nextMonthDay})

        days.push({
            date,
            currentMonth: false,
            nextMonth: true,
            disabled: isDisabled(date)
        })
        nextMonthDay++
    }

    return days
}
