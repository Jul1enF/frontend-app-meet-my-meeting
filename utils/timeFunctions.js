import { DateTime } from "luxon"

export const toLocaleDt = (date) => DateTime.fromJSDate(date)
export const toTimeStamp = (dt) => dt.toUTC().toJSDate()

// To write words with an upper case initial
export const upperCaseInitial = (name) => name.slice(0, 1).toUpperCase() + name.slice(1)

// Have index of a day in week with monday = 0
export const LocaleDayIndex = (date) => {
    const index = toLocaleDt(date).weekday
    return index - 1
}


// Convert to zone Europe/Paris for accurate comparisons
export const toParisDt = (date) => {
    if (date instanceof Date) return DateTime.fromJSDate(date, { zone: "Europe/Paris" })
    else if (typeof date === "string") return DateTime.fromISO(date, { zone: "Europe/Paris" })
    else if (DateTime.isDateTime(date)) {
        if (date.zoneName === "Europe/Paris") return date
        else return date.setZone("Europe/Paris")
    }
}

// Function to compare date without the time
export function isSameDay(dateA, dateB) {
    if (!dateA || !dateB) return false

    const parisDateA = toParisDt(dateA)
    const parisDateB = toParisDt(dateB)

    return parisDateA.hasSame(parisDateB, "day")
}

// Function to know if dates are before or after
export function isBefore(dateBefore, dateAfter, canBeEquals) {
    const parisDateBefore = toParisDt(dateBefore)
    const parisDateAfter = toParisDt(dateAfter)

    return canBeEquals ? parisDateBefore <= parisDateAfter : parisDateBefore < parisDateAfter
}

// Function to know if a date is in between two other
export function isBetween(dateBefore, dateBetween, dateAfter, canBeEquals) {
    const parisDateBefore = toParisDt(dateBefore)
    const parisDateBetween = toParisDt(dateBetween)
    const parisDateAfter = toParisDt(dateAfter)

    if (canBeEquals) return parisDateBefore <= parisDateBetween && parisDateBetween <= parisDateAfter
    return parisDateBefore <= parisDateBetween && parisDateBetween < parisDateAfter
}

// Function to get the duration between two date
export function getDuration(start, end) {
    return toParisDt(end).diff(toParisDt(start)).milliseconds
}


// Function to create a dtDate from a string hour in Paris time zone
export const datefromStringHour = (stringHour, dtDay) => DateTime.fromFormat(stringHour, "HH:mm", { zone: "Europe/Paris" }).set({ year: dtDay.year, month: dtDay.month, day: dtDay.day })