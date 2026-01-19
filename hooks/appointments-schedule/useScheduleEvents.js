import { useMemo } from "react";
import { isBefore, isSameDay, isBetween, datefromStringHour } from "@utils/timeFunctions";


export default function useScheduleEvents(dtDate, selectedEmployees, events, closures, absences, defaultSchedule) {


    // Force the date to be a the begining of the day (to display in the schedule past day events)
    const dtDay = useMemo(()=> dtDate.startOf('day'),[dtDate])


    // FORCE AN ARRAY FOR THE EMPLOYEE(S)
    const selectedEmployeesArray = useMemo(() => {
        if (!selectedEmployees) return []
        return Array.isArray(selectedEmployees)
            ? selectedEmployees
            : [selectedEmployees]
    }, [selectedEmployees])




    // INDEX OF THE DAY (CONVERT FOR US WITH MONDAY = 0)
    const dayIndex = useMemo(
        () => dtDay ? dtDay.weekday - 1 : null,
        [dtDay]
    )




    // MEMO OF THE DEFAULT START AND END OF DAYS FOR CLOSURE/ABSENCE
    const defaultStart = useMemo(() => defaultSchedule?.start ?? "09:00", [defaultSchedule])
    const defaultEnd = useMemo(() => defaultSchedule?.end ?? "19:00", [defaultSchedule])






    // GET THE WORKING HOURS AND OFF DAY EVENTS OF THE SELECTED EMPLOYEE(S)
    const selectedEmployeesAvailabilities = useMemo(() => {

        let minWorkingHour
        let maxWorkingHour
        const employeesAvailable = []
        const defaultLunchBreaks = []
        const concernedAbsenceEvents = []

        if (!selectedEmployeesArray || !dtDay || !absences) return { employeesAvailable, defaultLunchBreaks, noEmployeesAvailability : true, minWorkingHour, maxWorkingHour, concernedAbsenceEvents }


        // LOOP TO SEARCH FOR POSSIBLE OFF DAY EVENTS
        selectedEmployeesArray.forEach((employee) => {
            const employeeDay = employee.schedule[dayIndex]

            // The contract of the employee is over
            if (employee.contract_end && isBefore(employee.contract_end, dtDay)) return

            // The employee is not available (day off)
            if (!employeeDay.enabled) {
                // add an event to be displayed on the employee schedule
                concernedAbsenceEvents.push({ defaultStart: datefromStringHour(defaultStart, dtDay), defaultEnd: datefromStringHour(defaultEnd, dtDay), employee: employee._id, category: "dayOff" })

                return
            }

            // The employee is not available (absence which is always full-day (00:00 → 23:59 Paris time))
            const employeeAbsence = absences.find(absence =>
                absence.employee.toString() === employee._id.toString() &&
                isBetween(absence.start, dtDay, absence.end)
            )
            if (employeeAbsence) {
                // add an event to be displayed on the employee schedule
                concernedAbsenceEvents.push({ ...employeeAbsence, defaultStart: datefromStringHour(defaultStart, dtDay), defaultEnd: datefromStringHour(defaultEnd, dtDay),  })

                return
            }

            // No return has been made, the employee is available, we push it without useless infos and with his start and end timing
            const dtEmployeeStart = datefromStringHour(employeeDay.start, dtDay)
            const dtEmployeeEnd = datefromStringHour(employeeDay.end, dtDay)

            const { __v, schedule, updatedAt, ...employeeInformations } = employee

            employeesAvailable.push({ ...employeeInformations, dtEmployeeStart, dtEmployeeEnd })

            // Registration of the lunch break
            employeeDay.break.enabled && defaultLunchBreaks.push({
                start: datefromStringHour(employeeDay.break.start, dtDay),
                end: datefromStringHour(employeeDay.break.end, dtDay),
                employee: employee._id.toString(),
                category: "lunchBreak",
            })


            // Comparison of the schedule hours know when the shop opens and closes

            if (!minWorkingHour) minWorkingHour = dtEmployeeStart
            else {
                if (isBefore(dtEmployeeStart, minWorkingHour)) minWorkingHour = dtEmployeeStart
            }

            if (!maxWorkingHour) maxWorkingHour = dtEmployeeEnd
            else {
                if (isBefore(maxWorkingHour, dtEmployeeEnd)) maxWorkingHour = dtEmployeeEnd
            }
        })


        const noEmployeesAvailability = employeesAvailable.length ? false : true

        return { employeesAvailable, defaultLunchBreaks, noEmployeesAvailability, minWorkingHour, maxWorkingHour, concernedAbsenceEvents }

    }, [selectedEmployeesArray, dtDay, absences, defaultStart, defaultEnd])






    // VERIFICATION THAT THE SHOP IS NOT CLOSED OR ALL EMPLOYEES ABSENT
    const eventsAvailability = useMemo(() => {

        const concernedClosureEvents = []

        if (!dtDay || !closures || !absences) return { noAvailabilities: true, concernedClosureEvents }

        // closures are always full-day (00:00 → 23:59 Paris time)
        const closureHappening = closures.find(closure =>
            isBetween(closure.start, dtDay, closure.end)
        )

        if (closureHappening) {
            // add an event to be displayed on the employee schedule
            concernedClosureEvents.push({ ...closureHappening, defaultStart: datefromStringHour(defaultStart, dtDay), defaultEnd: datefromStringHour(defaultEnd, dtDay) })

            return { noAvailabilities: true, concernedClosureEvents }
        }

        const { noEmployeesAvailability } = selectedEmployeesAvailabilities

        return { noAvailabilities: noEmployeesAvailability, concernedClosureEvents }


    }, [dtDay, closures, selectedEmployeesAvailabilities.noEmployeesAvailability, defaultStart, defaultEnd])






    // GET THE EVENTS OF THE DAY AND THE FREE APPOINTMENT SLOTS
    const dayEventsSchedule = useMemo(() => {

        let concernedEvents = []

        const { noAvailabilities, concernedClosureEvents } = eventsAvailability

        const { concernedAbsenceEvents, minWorkingHour, maxWorkingHour, employeesAvailable, defaultLunchBreaks } = selectedEmployeesAvailabilities


        // We add to concernedEvents (used in an employee schedule) the releavant informations depending on the situation. A closure (shop is closed) has priority for the display on an absence
        const isClosed = concernedClosureEvents.length > 0
        concernedEvents = isClosed ? [...concernedClosureEvents] :
            [...concernedAbsenceEvents]

        // Return in case of lack of informations or no availabilities
        if (!dtDay || !events || noAvailabilities || !minWorkingHour || !maxWorkingHour || !employeesAvailable.length || !defaultLunchBreaks) {

            return { concernedEvents, minWorkingHour: isClosed ? null : minWorkingHour, maxWorkingHour: isClosed ? null : maxWorkingHour }
        }


        // Array to register pontentials modified lunch break
        const modifiedLunchBreaks = []


        // LOOP TO GET THE EVENTS OF THE CONCERNED DAY
        for (let event of events) {

            if (isSameDay(event.start, dtDay)
                && employeesAvailable.some(e => e._id.toString() === event.employee.toString())) {

                concernedEvents.push(event)

                // If the event is a modified or suppressed lunch break for this day
                event.category === "lunchBreak" && modifiedLunchBreaks.push(event)

            }

            // Because the events are already sorted by date, if we already found some but not anymore, we break (only futur days events remains)
            else if (!isSameDay(event.start, dtDay) && concernedEvents.length) {
                break;
            }
        }

        // Add the default lunck breaks if they have not been modified 
        for (let lunchBreak of defaultLunchBreaks) {

            if (!modifiedLunchBreaks.some(e => e.employee.toString() === lunchBreak.employee) ) {

                concernedEvents.push(lunchBreak)
            }
        }

        return { concernedEvents, minWorkingHour, maxWorkingHour }

    }, [eventsAvailability, selectedEmployeesAvailabilities, events, dtDay])


    return dayEventsSchedule
}