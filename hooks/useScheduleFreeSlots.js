import { useMemo } from "react";
import { isBefore, isSameDay, isBetween, getDuration, datefromStringHour, toParisDt } from "@utils/timeFunctions";


export default function useScheduleFreeSlots(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, eventDuration) {

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

            // The contract of the employee is over
            if (employee.contract_end && isBefore(employee.contract_end, dtDay)) return

            // The employee is not available (day off)
            if (!employeeDay.enabled) return

            // The employee is not available (absence which is always full-day (00:00 → 23:59 Paris time))
            const employeeAbsence = absences.find(absence =>
                absence.employee._id.toString() === employee._id.toString() &&
                isBetween(absence.start, dtDay, absence.end)
            )
            if (employeeAbsence) return


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
                category: "defaultLunchBreak",
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

        return { employeesAvailable, defaultLunchBreaks, noEmployeesAvailability, minWorkingHour, maxWorkingHour }

    }, [selectedEmployeesArray, dtDay, absences])






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


    }, [dtDay, closures, selectedEmployeesAvailabilities.noEmployeesAvailability])






    // GET THE FREE APPOINTMENT SLOTS
    const dayFreeSlots = useMemo(() => {

        const appointmentsSlots = []

        const { noAvailabilities } = appointmentsAvailability

        const { minWorkingHour, maxWorkingHour, employeesAvailable, defaultLunchBreaks } = selectedEmployeesAvailabilities


        // Return in case of lack of informations (null to know that the slots have not been calculated)
        if (!dtDay || !events || !appointmentGapMs || !eventDuration) {

            return { appointmentsSlots : null }
        }

        // Return in case of no availabilities
        if ( noAvailabilities || !minWorkingHour || !maxWorkingHour || !employeesAvailable.length || !defaultLunchBreaks) {

            return { appointmentsSlots }
        }

        // Create a map to register the occupied slots
        const occupiedSlots = new Map()

        const fiveMinutesInMs = 1000 * 60 * 5

        // Array to register pontentials modified lunch break
        const modifiedLunchBreaks = []

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
                
                if(!eventHasBeenFound) eventHasBeenFound = true

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
                event.category === "lunchBreak" && modifiedLunchBreaks.push(event)

            }
            // Because the events are already sorted by date, if we already found some but not anymore, we break (only futur days events remains)
            else if (eventHasBeenFound) {
                break;
            }
        }

        // Add the default lunck breaks if they have not been modified
        for (let lunchBreak of defaultLunchBreaks) {

            if (!modifiedLunchBreaks.length || !modifiedLunchBreaks.some(e => e.employee.toString() === lunchBreak.employee)) {

                setOccupiedSlots(lunchBreak.start, lunchBreak.end, lunchBreak.employee)
            }
        }



        // SETTINGS FOR A LOOP TO DETERMINE THE FREE APPOINTMENTS SLOTS OF THE DAY
        let dtAppointmentStart = dtDay
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
        while (isBefore(dtAppointmentStart.plus({ minutes: eventDuration }), maxWorkingHour, true)) {
            if (firstLoop) {
                dtAppointmentStart = getFirstAppointmentSlot()
                firstLoop = false
            }

            // Remove the employee that are not working throughout the entire appointment duration (their day of work is over)
            const workingEmployees = employeesAvailable.filter(e => {
                return dtAppointmentStart >= e.dtEmployeeStart &&
                    dtAppointmentStart.plus({ minutes: eventDuration }) <= e.dtEmployeeEnd
            })
            const employeesNumber = workingEmployees.length


            const dtAppointmentEndMs = dtAppointmentStart.plus({ minutes: eventDuration }).toMillis()

            // Check if there is an event registered for the start of the event
            const slotOccupied = occupiedSlots.get(dtAppointmentStart.toMillis())


            // If there is at least an employee available for the start
            if (!slotOccupied || slotOccupied.length !== employeesNumber) {


                // Function to remove an employee present in an occupied slot
                const setSlotAvailabilities = (slot) => workingEmployees.filter(e => !slot.includes(e._id.toString()))
                

                // New array of employees to determine the employees that are free during the all appointment
                let appointmentFreeEmployees = !slotOccupied ?
                    workingEmployees :
                    setSlotAvailabilities(slotOccupied)


                // Loop to check that the employees are available until the end for that appointment slot
                let slotChecked = dtAppointmentStart.toMillis() + fiveMinutesInMs

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


                employees.length && appointmentsSlots.push({ start: dtAppointmentStart, employees })
            }
            dtAppointmentStart = dtAppointmentStart.plus({ milliseconds: appointmentGapMs })
        }

        return { appointmentsSlots }

    }, [appointmentsAvailability, selectedEmployeesAvailabilities, events, dtDay, appointmentGapMs, eventDuration])


    return dayFreeSlots
}