import { useMemo } from "react";
import { isBefore, isSameDay, isBetween, getDuration, datefromStringHour, toParisDt } from "@utils/timeFunctions";
import { DateTime } from "luxon";

export default function useScheduleFreeSlots(dtDate, selectedEmployees, events, closures, absences, workingOverrides, appointmentGapMs, eventDuration) {


    // Force the date to be a the actual time if it is the current day to not propose past slots
    const dtDay = useMemo(() => {
        const now = DateTime.now({ zone: "Europe/Paris" }).set({second : 0, millisecond : 0})
        return isSameDay(now, dtDate) ? now : dtDate.startOf("day")
    }, [dtDate])



    // FORCE AN ARRAY FOR THE EMPLOYEE(S)
    const selectedEmployeesArray = useMemo(() => {
        if (!selectedEmployees) return []

        // Case where user-appointments page just send an id to selectedEmployee because a former employee that is no longer part of the team was registered for the appointment
        if (selectedEmployees?._id && !selectedEmployees?.schedule) return []

        return Array.isArray(selectedEmployees)
            ? selectedEmployees
            : [selectedEmployees]
    }, [selectedEmployees])




    // INDEX OF THE DAY (CONVERT FOR US WITH MONDAY = 0)
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

            // The contract of the employee is over
            if (employee.contract_end && isBefore(employee.contract_end, dtDay)) return

            // The employee is not available and his dayOff has not been override
            const workingOverrideEvent = workingOverrides.find(e =>
                e.employee.toString() === employee._id.toString()
                && isSameDay(e.start, dtDay)
            )

            if (!employeeDay.enabled && !workingOverrideEvent) return

            // The employee is not available (absence which is always full-day (00:00 → 23:59 Paris time))
            const employeeAbsence = absences.find(absence =>
                absence.employee.toString() === employee._id.toString() &&
                isBetween(absence.start, dtDay, absence.end)
            )
            // Absence always wins over workingOverride (employee is not working at all)
            if (employeeAbsence) return


            // No return has been made, the employee is available, we push it without useless infos and with his start and end timing
            const dtEmployeeStart = workingOverrideEvent ? toParisDt(workingOverrideEvent.start) : datefromStringHour(employeeDay.start, dtDay)

            const dtEmployeeEnd = workingOverrideEvent ? toParisDt(workingOverrideEvent.end) : datefromStringHour(employeeDay.end, dtDay)

            const { __v, schedule, updatedAt, ...employeeInformations } = employee

            employeesAvailable.push({ ...employeeInformations, dtEmployeeStart, dtEmployeeEnd })

            // Registration of the lunch break
            if (workingOverrideEvent) {
                const { break: lunchBreak } = workingOverrideEvent.working_schedule

                lunchBreak.enabled && defaultLunchBreaks.push({
                    start: datefromStringHour(lunchBreak.start, dtDay),
                    end: datefromStringHour(lunchBreak.end, dtDay),
                    employee: employee._id.toString(),
                    category: "lunchBreak",
                })
            }
            else {
                employeeDay.break.enabled && defaultLunchBreaks.push({
                    start: datefromStringHour(employeeDay.break.start, dtDay),
                    end: datefromStringHour(employeeDay.break.end, dtDay),
                    employee: employee._id.toString(),
                    category: "lunchBreak",
                })
            }


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

        return { employeesAvailable, defaultLunchBreaks, noEmployeesAvailability, minWorkingHour, maxWorkingHour }

    }, [selectedEmployeesArray, dtDay, absences, workingOverrides])






    // VERIFICATION THAT THE SHOP IS NOT CLOSED OR ALL EMPLOYEES ABSENT
    const appointmentsAvailability = useMemo(() => {

        if (!dtDay || !closures) return { noAvailabilities: true }

        // closures are always full-day (00:00 → 23:59 Paris time)
        const closureHappening = closures.find(closure =>
            isBetween(closure.start, dtDay, closure.end)
        )

        if (closureHappening) {
            return { noAvailabilities: true }
        }

        const { noEmployeesAvailability } = selectedEmployeesAvailabilities

        return { noAvailabilities: noEmployeesAvailability }


    }, [dtDay, closures, selectedEmployeesAvailabilities])






    // GET THE FREE APPOINTMENT SLOTS
    const dayFreeSlots = useMemo(() => {

        const appointmentsSlots = []

        const { noAvailabilities } = appointmentsAvailability

        const { minWorkingHour, maxWorkingHour, employeesAvailable, defaultLunchBreaks } = selectedEmployeesAvailabilities


        // Return in case of lack of informations (null to know that the slots have not been calculated)
        if (!dtDay || !events || !appointmentGapMs || !eventDuration) {

            return { appointmentsSlots: null }
        }

        // Return in case of no availabilities
        if (noAvailabilities || !minWorkingHour || !maxWorkingHour || !employeesAvailable.length || !defaultLunchBreaks) {

            return { appointmentsSlots }
        }

        // Create a map to register the occupied slots
        const occupiedSlots = new Map()

        const fiveMinutesInMs = 1000 * 60 * 5


        // Var to see how busy is an employee (so that if no one is selected by the user we can selecte the least busy)
        const employeesWorkStatus = {}



        // FUNCTION WITH A LOOP TO BLOCK SCHEDULES SLOTS WHILE AN EVENT IS HAPPENING
        const setOccupiedSlots = (start, end, employeeId) => {

            let slotStart = toParisDt(start)
            let eventEnd = toParisDt(end)

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

        // Var to know if at least one event has been found
        let eventHasBeenFound

        // BLOCK SCHEDULES SLOTS WHEN THEY ARE OCCURING AND UPDATE EMPLOYEE STATUS
        for (let event of events) {

            if (isSameDay(event.start, dtDay)
                && employeesAvailable.some(e => e._id.toString() === event.employee.toString())) {

                if (!eventHasBeenFound) eventHasBeenFound = true

                const employeeId = event.employee.toString()

                // Actualise the amount of work of an employee (to sort them later by the less busy)
                if (!employeesWorkStatus[employeeId]) {
                    employeesWorkStatus[employeeId] = { eventCount: 1, msOfWork: getDuration(event.start, event.end) }
                } else {
                    employeesWorkStatus[employeeId].eventCount += 1
                    employeesWorkStatus[employeeId].msOfWork += getDuration(event.start, event.end)
                }

                // Block schedule slots
                setOccupiedSlots(event.start, event.end, employeeId)

            }
            // Because the events are already sorted by date, if we already found some but not anymore, we break (only futur days events remains)
            else if (!isSameDay(event.start, dtDay) && eventHasBeenFound) {
                break;
            }
        }

        // Add the default lunck breaks
        for (let lunchBreak of defaultLunchBreaks) {
            setOccupiedSlots(lunchBreak.start, lunchBreak.end, lunchBreak.employee)
        }


        // SETTINGS FOR A LOOP TO DETERMINE THE FREE EVENTS SLOTS OF THE DAY
        let dtSlotStart = dtDay
        let firstLoop = true

        // For the first loop, get the first slot available for an appointment depending on the time of the request and appointments gaps
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
        while (isBefore(dtSlotStart.plus({ minutes: eventDuration }), maxWorkingHour, true)) {
            if (firstLoop) {
                dtSlotStart = getFirstAppointmentSlot()
                firstLoop = false
            }

            // Remove the employee that are not working throughout the entire appointment duration (their day of work is over)
            const workingEmployees = employeesAvailable.filter(e => {
                return dtSlotStart >= e.dtEmployeeStart &&
                    dtSlotStart.plus({ minutes: eventDuration }) <= e.dtEmployeeEnd
            })
            const employeesNumber = workingEmployees.length

            const dtAppointmentEndMs = dtSlotStart.plus({ minutes: eventDuration }).toMillis()

            // Check if there is an event registered for the start of the event slot
            const slotOccupied = occupiedSlots.get(dtSlotStart.toMillis())

            // If there is at least an employee available for the start
            if (!slotOccupied || slotOccupied.length !== employeesNumber) {


                // Function to remove an employee present in an occupied slot
                const setSlotAvailabilities = (slot) => workingEmployees.filter(e => !slot.includes(e._id.toString()))


                // New array of employees to determine the employees that are free during the all appointment
                let appointmentFreeEmployees = !slotOccupied ?
                    workingEmployees :
                    setSlotAvailabilities(slotOccupied)


                // Loop to check that the employees are available until the end for that appointment slot
                let slotChecked = dtSlotStart.toMillis() + fiveMinutesInMs

                while (appointmentFreeEmployees.length > 0 && slotChecked < dtAppointmentEndMs) {
                    const slotCheckedOccupied = occupiedSlots.get(slotChecked)
                    if (slotCheckedOccupied) appointmentFreeEmployees = setSlotAvailabilities(slotCheckedOccupied)

                    slotChecked += fiveMinutesInMs
                }


                // Create a new array to add the work status to the appointmentFreeEmployees
                const employees = appointmentFreeEmployees.map(e => {
                    const employeeStatus = employeesWorkStatus[e._id.toString()]

                    if (!employeeStatus) return { ...e, eventCount: 0, msOfWork: 0 }
                    else return { ...e, ...employeeStatus }
                })


                employees.length && appointmentsSlots.push({ start: dtSlotStart, employees })
            }
            dtSlotStart = dtSlotStart.plus({ milliseconds: appointmentGapMs })
        }

        return { appointmentsSlots }

    }, [appointmentsAvailability, selectedEmployeesAvailabilities, events, dtDay, appointmentGapMs, eventDuration])


    return dayFreeSlots
}
