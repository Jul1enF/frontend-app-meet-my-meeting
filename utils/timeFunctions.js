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


// Convert to dtUTC whatever the entring format is
const toDtUTC = (date) => {
    if (date instanceof Date) return DateTime.fromJSDate(date).toUTC()
    else if (typeof date === "string") return DateTime.fromISO(date).toUTC()
    else if (DateTime.isDateTime(date)) return date.toUTC()
}


// Function to compare date without the time
export function isSameDay(dateA, dateB) {
    if (!dateA || !dateB) return false

    const utcDateA = toDtUTC(dateA)
    const utcDateB = toDtUTC(dateB)

    return utcDateA.hasSame(utcDateB, "day")
}

// Function to know if dates are before or after
export function isBefore (dateBefore, dateAfter, canBeEquals) {
    const utcDateBefore = toDtUTC(dateBefore)
    const utcDateAfter = toDtUTC(dateAfter)

    return canBeEquals ? utcDateBefore <= utcDateAfter : utcDateBefore < utcDateAfter
}

// Function to know if a date is in between two other
export function isBetween (dateBefore, dateBetween, dateAfter) {
    const utcDateBefore = toDtUTC(dateBefore)
    const utcDateBetween = toDtUTC(dateBetween)
    const utcDateAfter = toDtUTC(dateAfter)

    return utcDateBefore <= utcDateBetween && utcDateBetween < utcDateAfter
}

// Function to get the duration between two date
export function getDuration (start, end) {
    return toDtUTC(start).diff(toDtUTC(end)).milliseconds
}


// Function to create a dtDate from a string hour in Paris time zone
export const datefromStringHour = (stringHour, dtDay) => DateTime.fromFormat(stringHour, "HH:mm", { zone: "Europe/Paris" }).set({ year: dtDay.year, month: dtDay.month, day: dtDay.day })