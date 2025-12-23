import { DateTime } from "luxon"

export const toLocaleDt = (date) => DateTime.fromJSDate(date)
export const toParisDt = (date) => DateTime.fromJSDate(date, { zone: "Europe/Paris" })
export const toTimeStamp = (dt) => dt.toUTC().toJSDate()

// To write words with an upper case initial
export const upperCaseInitial = (name) => name.slice(0, 1).toUpperCase() + name.slice(1)

// Have index of a day in week with monday = 0
export const LocaleDayIndex = (date) => {
    const index = toLocaleDt(date).weekday
    return index - 1
}

// Function to compare date without the time
export function isSameDay(dateA, dateB, dtDates) {
    if (!dateA || !dateB) return false

    if (dtDates) {
        return (
            dateA.year === dateB.year && dateA.month === dateB.month && dateA.day === dateB.day
        )
    }
    else {
        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        )
    }
}