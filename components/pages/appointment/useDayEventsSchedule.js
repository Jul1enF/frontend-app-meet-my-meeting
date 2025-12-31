import { useMemo } from "react";
import { DateTime } from "luxon";
import { isBefore, isSameDay, isBetween } from "@utils/timeFunctions";

export default function useDayEventsSchedule(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration) {

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
        if (!dtDay || !closures) return true

        let noAvailability = false
        if (closures.length) {
            closures.forEach((closure) => {
                if (isBetween(closure.start, dtDay, closure.end)) noAvailability = true
            })
        }

        if (noAvailability) return noAvailability

        const { noEmployeesAvailability } = selectedEmployeesAvailabilities

        if (noEmployeesAvailability) return true
        else return false

    }, [dtDay, closures, selectedEmployeesAvailabilities.noEmployeesAvailability])



    const dayEventsSchedule = useMemo(() => {

        const concernedEvents = []
        const appointmentsSlots = []

        if (!dtDay || !events || !appointmentGapMs || !appointmentDuration || noAppointmentsAvailable) return { appointmentsSlots, concernedEvents }
        

        const { minWorkingHour, maxWorkingHour, employeesAvailable } = selectedEmployeesAvailabilities
        if (!minWorkingHour || !maxWorkingHour || !employeesAvailable?.length) return { appointmentsSlots, concernedEvents }

        const occupiedSlots = new Map()

        const fiveMinutesInMs = 1000 * 60 * 5

        // Get the events of the concercened day and block schedules slots when they are occurring
        for (let event of events) {
            if (isSameDay(event.start, dtDay)
                && employeesAvailable.some(e => e._id.toString() === event.employee.toString())) {
                concernedEvents.push(event)

                let slotStart = DateTime.fromJSDate(event.start).toUTC()
                let eventEnd = DateTime.fromJSDate(event.end).toUTC()

                while (slotStart < eventEnd) {
                    const slotKeyMs = slotStart.toMillis()

                    // Set an array with the id(s) of the employee(s) currently busy
                    const slotValue = occupiedSlots.has(slotKeyMs) ?
                        [...occupiedSlots.get(slotKeyMs), event.employee.toString()] :
                        [event.employee.toString()]

                    occupiedSlots.set(slotKeyMs, slotValue)

                    slotStart = slotStart.plus({ milliseconds: fiveMinutesInMs })
                }
            }
            // Because the events are already sorted by date, if we already found some but not anymore, we break (only futur days events remains)
            else if (concernedEvents.length) {
                break;
            }
        }

        // Settings for a loop to determine the free appointmentsSlots of the day

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

        // Loop to determine the free appointmentsSlots of the day
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

                appointmentFreeEmployees.length && appointmentsSlots.push({ start: dtAppointmentStart, employees: appointmentFreeEmployees })
            }
            dtAppointmentStart = dtAppointmentStart.plus({ milliseconds: appointmentGapMs })
        }

        return { appointmentsSlots, concernedEvents }

    }, [noAppointmentsAvailable, selectedEmployeesAvailabilities, events])


    return dayEventsSchedule
}


//Quand tu voudras scaler, on pourra :

// pré-compresser les slots
// ou passer sur des intervalles fusionnés