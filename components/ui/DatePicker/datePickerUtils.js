// Change of the week index to have weeks starting with monday
const correctedDayIndex = (index) => {
    if (index === 0) return 6
    else return index - 1
}

export const getMonthDays = (viewedYear, viewedMonth) => {
    const firstDayOfMonth = new Date(viewedYear, viewedMonth, 1)
    const firstDayOfMonthIndex = correctedDayIndex(firstDayOfMonth.getDay())

    const daysInViewedMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewedYear, viewedMonth, 0).getDate()

    const days = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isDisabled = (date) => today - date > 0

    // Add days of the previous month
    for (let i = firstDayOfMonthIndex; i > 0; i--) {
        const date = new Date(viewedYear, viewedMonth - 1, daysInPrevMonth - i)

        days.push({
            date,
            currentMonth: false,
            previousMonth: true,
            disabled: isDisabled(date)
        })
    }

    // Add days for the current month 
    for (let i = 1; i <= daysInViewedMonth; i++) {
        const date = new Date(viewedYear, viewedMonth, i)

        days.push({
            date,
            currentMonth: true,
            disabled: isDisabled(date)
        })
    }


    // Add days for next month

    let nextMonthDay = 1
    while (days.length % 7 !== 0) {
        const date = new Date(viewedYear, viewedMonth + 1, nextMonthDay)

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



export function isSameDay(dateA, dateB) {
    if (!dateA || !dateB) return false

    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    )
}