import { useMemo } from "react";
import { DateTime } from "luxon";
import { isBefore, isSameDay, isBetween } from "@utils/timeFunctions";

export default function useFreeAppointmentSlots(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration) {

    // Have necessarily an Array for the employee(s)
    const selectedEmployeesArray = useMemo(() => {
        if (!selectedEmployees) return []
        return Array.isArray(selectedEmployees)
            ? selectedEmployees
            : [selectedEmployees]
    }, [selectedEmployees])

    // Index of the day
    const dayIndex = useMemo(
        () => dtDay ? dtDay.weekday - 1 : null,
        [dtDay]
    )

    // Get the working hours and availability of the selected employee(s)
    const selectedEmployeesAvailabilities = useMemo(() => {

        if (!selectedEmployeesArray || !dtDay) return {}

        let minWorkingHour
        let maxWorkingHour
        const employeesAvailable = []

        // Loop to determine schedule and availability for each employee
        selectedEmployeesArray.forEach((employee) => {
            const employeeDay = employee.schedule[dayIndex]

            // The employee is not available (day off)
            if (!employeeDay.enabled) return

            // The employee is not available (day off)
            const isAbsent = absences.some(absence =>
                absence.employee._id.toString() === employee._id.toString() &&
                isBetween(absence.start, dtDay, absence.end)
            )
            if (isAbsent) return

            // No return has been made, the employee is available
            employeesAvailable.push(employee)

            // Comparison of the schedule hours
            const dtEmployeeStart = DateTime.fromFormat(employeeDay.start, "HH:mm", { zone: "Europe/Paris" }).set({ year: dtDay.year, month: dtDay.month, day: dtDay.day })
            const dtEmployeeEnd = DateTime.fromFormat(employeeDay.end, "HH:mm", { zone: "Europe/Paris" }).set({ year: dtDay.year, month: dtDay.month, day: dtDay.day })

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

        // Sort in alphabetical first name order
        employeesAvailable.length && employeesAvailable.sort((a, b) => {
            if (a.first_name < b.first_name) return -1
            if (a.first_name > b.first_name) return 1
            return 0;
        })

        return { employeesAvailable, noEmployeesAvailability, minWorkingHour, maxWorkingHour }

    }, [selectedEmployeesArray, dtDay])




    // Verification that the shop is not closed
    const noAppointmentsAvailable = useMemo(() => {
        if (!dtDay || !closures) return null

        let noAvailability = false
        if (closures.length) {
            closures.forEach((closure) => {
                if (isBetween(closure.start, dtDay, closure.end)) noAvailability = true
            })
        }

        if (noAvailability) return noAvailability

        const { noEmployeesAvailability } = selectedEmployeesAvailabilities

        if (noEmployeesAvailability) return noEmployeesAvailability

    }, [dtDay, closures, selectedEmployeesAvailabilities.noEmployeesAvailability])



    const freeSlots = useMemo(() => {

        if (!dtDay || !events || !appointmentGapMs || !appointmentDuration) return null

        if (noAppointmentsAvailable) return null

        const { minWorkingHour, maxWorkingHour, employeesAvailable } = selectedEmployeesAvailabilities
        if (!minWorkingHour || !maxWorkingHour || !employeesAvailable?.length) return null

        const concernedEvents = []

        for (let event of events) {
            if (isSameDay(event.start, dtDay)
                && employeesAvailable.some(e => e._id.toString() === event.employee.toString())) {
                concernedEvents.push(event)
            }
            // Because the events are already sorted by date, if we already found some but not anymore, we break (only futur days events remains)
            else if (concernedEvents.length) {
                break;
            }
        }

        // Loop to determine the free appointmentsSlots of the day
        const appointmentsSlots = []

        let dtAppointmentStart = dtDay
        let firstLoop = true

        // Get the first slot available for an appointment depending on the time and appointments gaps
        const getFirstSlot = () => {
            if (dtDay < minWorkingHour) return minWorkingHour

            const openingDurationMs = dtDay.toMillis() - minWorkingHour.toMillis()

            // If the actual moment is not starting at the begining of a gap
            if (!openingDurationMs % appointmentGapMs === 0) {
                // Determine the number of time gaps to pass to get next appointmentSlot
                const gapsToPass = Math.ceil(openingDurationMs / appointmentGapMs)
                return minWorkingHour.plus({ milliseconds: gapsToPass * appointmentGapMs })
            }
        }

        while (isBefore(dtAppointmentStart.plus({ minutes: appointmentDuration }), maxWorkingHour, true)) {
            if (firstLoop) {
                dtAppointmentStart = getFirstSlot()
                firstLoop = false
            }

            const appointmentEnd = dtAppointmentStart.plus({ minutes: appointmentDuration })

            // Check that the appointment using that slot is not starting or ending over an other one
            // NO CHECK OF THE END YET !!!!!
            const eventsAtThisTime = concernedEvents.filter(e => isBetween(e.start, dtAppointmentStart, e.end))

            if (eventsAtThisTime.length !== employeesAvailable.length) appointmentsSlots.push(dtAppointmentStart)

            dtAppointmentStart = dtAppointmentStart.plus({ milliseconds: appointmentGapMs })
        }

        return appointmentsSlots

    }, [noAppointmentsAvailable, selectedEmployeesAvailabilities, events])


    return freeSlots
}