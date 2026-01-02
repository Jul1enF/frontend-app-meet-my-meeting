import { useMemo } from "react";
import { DateTime } from "luxon";
import { isBefore, isSameDay, isBetween, getDuration, datefromStringHour } from "@utils/timeFunctions";


export default function useDayEventsSchedule(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration) {

    // FORCE AN ARRAY FOR THE EMPLOYEE(S)
    const selectedEmployeesArray = useMemo(() => {
        if (!selectedEmployees) return []
        return Array.isArray(selectedEmployees)
            ? selectedEmployees
            : [selectedEmployees]
    }, [selectedEmployees])




    // INDEX OF THE DAY
    const dayIndex = useMemo(
        () => dtDay ? dtDay.weekday - 1 : null,
        [dtDay]
    )



    // GET THE WORKING HOURS AND AVAILABILITY OF THE SELECTED EMPLOYEE(S)
    const selectedEmployeesAvailabilities = useMemo(() => {

        if (!selectedEmployeesArray || !dtDay) return {}

        let minWorkingHour
        let maxWorkingHour
        const employeesAvailable = []
        const defaultLunchBreaks = []


        // LOOP TO DETERMINE SCHEDULE AND AVAILABILITY FOR EACH EMPLOYEE
        selectedEmployeesArray.forEach((employee) => {
            const employeeDay = employee.schedule[dayIndex]

            // The employee is not available (day off)
            if (!employeeDay.enabled) return

            // The employee is not available (absence which is always full-day (00:00 → 23:59 Paris time))
            const isAbsent = absences.some(absence =>
                absence.employee._id.toString() === employee._id.toString() &&
                isBetween(absence.start, dtDay, absence.end)
            )
            if (isAbsent) return


            // No return has been made, the employee is available, we push it without useless infos
            const { __v, schedule, updatedAt, ...employeeInformations } = employee
            employeesAvailable.push(employeeInformations)

            // Registration of the lunch break
            employeeDay.break.enabled && defaultLunchBreaks.push({
                start: datefromStringHour(employeeDay.break.start, dtDay),
                end: datefromStringHour(employeeDay.break.end, dtDay),
                employee: employee._id.toString(),
                category: "defaultLunchBreak",
            })

            // Comparison of the schedule hours
            const dtEmployeeStart = datefromStringHour(employeeDay.start, dtDay)
            const dtEmployeeEnd = datefromStringHour(employeeDay.end, dtDay)

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

        return { employeesAvailable, defaultLunchBreaks, noEmployeesAvailability, minWorkingHour, maxWorkingHour }

    }, [selectedEmployeesArray, dtDay, absences])





    // VERIFICATION THAT THE SHOP IS NOT CLOSED OR ALL EMPLOYEES ABSENT
    const noAppointmentsAvailable = useMemo(() => {
        if (!dtDay || !closures) return true

        // closures are always full-day (00:00 → 23:59 Paris time)
        const noAvailability = closures.some(closure =>
            isBetween(closure.start, dtDay, closure.end)
        )

        if (noAvailability) return noAvailability

        const { noEmployeesAvailability } = selectedEmployeesAvailabilities

        if (noEmployeesAvailability) return true
        else return false

    }, [dtDay, closures, selectedEmployeesAvailabilities.noEmployeesAvailability])





    // GET THE EVENTS OF THE DAY AND THE FREE APPOINTMENT SLOTS
    const dayEventsSchedule = useMemo(() => {

        const concernedEvents = []
        const appointmentsSlots = []

        if (!dtDay || !events || !appointmentGapMs || !appointmentDuration || noAppointmentsAvailable) return { appointmentsSlots, concernedEvents }


        const { minWorkingHour, maxWorkingHour, employeesAvailable, defaultLunchBreaks } = selectedEmployeesAvailabilities

        if (!minWorkingHour || !maxWorkingHour || !employeesAvailable.length || !defaultLunchBreaks) return { appointmentsSlots, concernedEvents }

        // Create a map to register the occupied slots
        const occupiedSlots = new Map()

        const fiveMinutesInMs = 1000 * 60 * 5

        // Array to register pontentials events representing a modified lunch break
        const lunchBreaksEvents = []

        // Var to see how busy is an employee
        const employeesWorkStatus = {}



        // FUNCTION WITH A LOOP TO BLOCK SCHEDULES SLOTS WHILE AN EVENT IS HAPPENING
        const setOccupiedSlots = (start, end, employeeId) => {
            let slotStart = DateTime.isDateTime(start) ? start.toUTC() : DateTime.fromJSDate(start).toUTC()
            let eventEnd = DateTime.isDateTime(end) ? end.toUTC() : DateTime.fromJSDate(end).toUTC()

            while (slotStart < eventEnd) {
                const slotKeyMs = slotStart.toMillis()

                // Set an array with the id(s) of the employee(s) currently busy
                const slotValue = occupiedSlots.has(slotKeyMs) ?
                    [...occupiedSlots.get(slotKeyMs), employeeId] :
                    [employeeId]

                occupiedSlots.set(slotKeyMs, slotValue)

                slotStart = slotStart.plus({ milliseconds: fiveMinutesInMs })
            }
        }


        // GET THE EVENTS OF THE CONCERNED DAY, BLOCK SCHEDULES SLOTS WHEN THEY ARE OCCURING AND UPDATE EMPLOYEE STATUS
        for (let event of events) {
            if (isSameDay(event.start, dtDay)
                && employeesAvailable.some(e => e._id.toString() === event.employee.toString())) {

                concernedEvents.push(event)

                const employeeId = event.employee.toString()

                // Actualise the amount of work of an employee
                if (!employeesWorkStatus[employeeId]) {
                    employeesWorkStatus[employeeId] = { eventCount: 1, msOfWork: getDuration(event.start, event.end) }
                } else {
                    employeesWorkStatus[employeeId].eventCount += 1
                    employeesWorkStatus[employeeId].msOfWork += getDuration(event.start, event.end)
                }

                // Block schedule slots
                setOccupiedSlots(event.start, event.end, employeeId)

                // If the event is a modified lunch break for this day
                event.category === "lunchBreak" && lunchBreaksEvents.push(event)
            }
            // Because the events are already sorted by date, if we already found some but not anymore, we break (only futur days events remains)
            else if (concernedEvents.length) {
                break;
            }
        }
        // Add the default lunck breaks if they have not been modified
        for (let lunchBreak of defaultLunchBreaks) {

            if (!lunchBreaksEvents.length || !lunchBreaksEvents.some(e => e.employee.toString() === lunchBreak.employee)) {

                concernedEvents.push(lunchBreak)
                setOccupiedSlots(lunchBreak.start, lunchBreak.end, lunchBreak.employee)
            }
        }



        // SETTINGS FOR A LOOP TO DETERMINE THE FREE APPOINTMENTS SLOTS OF THE DAY

        let dtAppointmentStart = dtDay
        let firstLoop = true

        const employeesNumber = employeesAvailable.length

        // Get the first slot available for an appointment depending on the time of the request and appointments gaps
        const getFirstAppointmentSlot = () => {
            if (isBefore(dtDay, minWorkingHour)) return minWorkingHour

            const openingDurationMs = dtDay.toMillis() - minWorkingHour.toMillis()

            // If the actual moment is not starting at the begining of a gap
            if (openingDurationMs % appointmentGapMs !== 0) {
                // Determine the number of time gaps to pass to get next appointmentSlot
                const gapsToPass = Math.ceil(openingDurationMs / appointmentGapMs)
                return minWorkingHour.plus({ milliseconds: gapsToPass * appointmentGapMs })
            }

            return dtDay
        }



        // LOOP TO DETERMINE THE FREE APPOINTMENTS SLOTS OF THE DAY
        while (isBefore(dtAppointmentStart.plus({ minutes: appointmentDuration }), maxWorkingHour, true)) {
            if (firstLoop) {
                dtAppointmentStart = getFirstAppointmentSlot()
                firstLoop = false
            }

            const dtAppointmentEndMs = dtAppointmentStart.plus({ minutes: appointmentDuration }).toMillis()

            // Check if there is an event registered for the start of the event
            const slotOccupied = occupiedSlots.get(dtAppointmentStart.toMillis())

            // If there is at least an employee available for the start
            if (!slotOccupied || slotOccupied.length !== employeesNumber) {

                // Array to determine the employees that are free during the all appointment
                let appointmentFreeEmployees = []

                const setSlotAvailabilities = (slot) => employeesAvailable.filter(e => !slot.includes(e._id.toString()))

                appointmentFreeEmployees = !slotOccupied ?
                    employeesAvailable :
                    setSlotAvailabilities(slotOccupied)


                // Check that the employees are available until the end for that appointment slot
                let slotChecked = dtAppointmentStart.toMillis() + fiveMinutesInMs

                while (appointmentFreeEmployees.length > 0 && slotChecked < dtAppointmentEndMs) {
                    const slotCheckedOccupied = occupiedSlots.get(slotChecked)
                    if (slotCheckedOccupied) appointmentFreeEmployees = setSlotAvailabilities(slotCheckedOccupied)

                    slotChecked += fiveMinutesInMs
                }

                // Add the work status of the employee
                const employees = []
                appointmentFreeEmployees.forEach(e => {
                    const employeeStatus = employeesWorkStatus[e._id.toString()]

                    !employeeStatus ? employees.push({ ...e, eventCount: 0, msOfWork: 0 }) :
                        employees.push({ ...e, ...employeeStatus })
                })

                appointmentFreeEmployees.length && appointmentsSlots.push({ start: dtAppointmentStart, employees })
            }
            dtAppointmentStart = dtAppointmentStart.plus({ milliseconds: appointmentGapMs })
        }

        return { appointmentsSlots, concernedEvents }

    }, [noAppointmentsAvailable, selectedEmployeesAvailabilities, events, dtDay, appointmentGapMs, appointmentDuration])


    return dayEventsSchedule
}