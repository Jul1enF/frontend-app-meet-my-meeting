import { useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { isBefore, isSameDay, isBetween, getDuration, datefromStringHour, toParisDt } from "@utils/timeFunctions";


export default function useDayEventsSchedule(dtDay, selectedEmployees, events, closures, absences, appointmentGapMs, defaultSchedule, appointmentDuration) {

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




    // MEMO OF THE DEFAULT START AND END OF DAYS FOR CLOSURE/ABSENCE
    const defaultStart = useMemo(()=> defaultSchedule?.start ?? 8, [defaultSchedule])
    const defaultEnd = useMemo(()=> defaultSchedule?.end ?? 19, [defaultSchedule])






    // GET THE WORKING HOURS AND AVAILABILITY OF THE SELECTED EMPLOYEE(S)
    const selectedEmployeesAvailabilities = useMemo(() => {

        if (!selectedEmployeesArray || !dtDay) return {}

        let minWorkingHour
        let maxWorkingHour
        const employeesAvailable = []
        const defaultLunchBreaks = []
        const concernedAbsenceEvents = []


        // LOOP TO DETERMINE SCHEDULE AND AVAILABILITY FOR EACH EMPLOYEE
        selectedEmployeesArray.forEach((employee) => {
            const employeeDay = employee.schedule[dayIndex]

            // The contract of the employee is over
            if (employee.contract_end && isBefore(employee.contract_end, dtDay)) return

            // The employee is not available (day off)
            if (!employeeDay.enabled) {
                // add an event to be displayed on the employee schedule
                concernedAbsenceEvents.push({ start: dtDay.set({ hours: defaultStart }), end: dtDay.set({ hours: defaultEnd }), employee: employee._id, category : "dayOff" })

                return
            }

            // The employee is not available (absence which is always full-day (00:00 → 23:59 Paris time))
            const employeeAbsence = absences.find(absence =>
                absence.employee._id.toString() === employee._id.toString() &&
                isBetween(absence.start, dtDay, absence.end)
            )
            if (employeeAbsence) {
                // add an event to be displayed on the employee schedule
                concernedAbsenceEvents.push({ ...employeeAbsence, start: dtDay.set({ hours: defaultStart }), end: dtDay.set({ hours: defaultEnd })})

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

        return { employeesAvailable, defaultLunchBreaks, noEmployeesAvailability, minWorkingHour, maxWorkingHour, concernedAbsenceEvents }

    }, [selectedEmployeesArray, dtDay, absences, defaultStart, defaultEnd])






    // VERIFICATION THAT THE SHOP IS NOT CLOSED OR ALL EMPLOYEES ABSENT
    const appointmentsAvailability = useMemo(() => {

        const concernedClosureEvents = []

        if (!dtDay || !closures) return { noAvailabilities: true, concernedClosureEvents}

        // closures are always full-day (00:00 → 23:59 Paris time)
        const closureHappening = closures.find(closure =>
            isBetween(closure.start, dtDay, closure.end)
        )

        if (closureHappening) {
            // add an event to be displayed on the employee schedule
            concernedClosureEvents.push({ ...closureHappening, start: dtDay.set({ hours: defaultStart }), end: dtDay.set({ hours: defaultEnd }) })

            return { noAvailabilities: true, concernedClosureEvents }
        }

        const { noEmployeesAvailability } = selectedEmployeesAvailabilities

        return { noAvailabilities: noEmployeesAvailability, concernedClosureEvents }


    }, [dtDay, closures, selectedEmployeesAvailabilities.noEmployeesAvailability, defaultStart, defaultEnd])






    // GET THE EVENTS OF THE DAY AND THE FREE APPOINTMENT SLOTS
    const dayEventsSchedule = useMemo(() => {

        let concernedEvents = []
        const appointmentsSlots = []

        const { noAvailabilities, concernedClosureEvents } = appointmentsAvailability

        const { concernedAbsenceEvents, minWorkingHour, maxWorkingHour, employeesAvailable, defaultLunchBreaks } = selectedEmployeesAvailabilities


        // We add to concernedEvents (used in an employee schedul) the releavant informations depending on the situation (shop closed or employee is absent )
        concernedEvents = concernedClosureEvents.length ? [...concernedClosureEvents] :
        [...concernedAbsenceEvents]

        // Return in case of lack of informations or no availabilities
        if (!dtDay || !events || !appointmentGapMs || noAvailabilities || !minWorkingHour || !maxWorkingHour || !employeesAvailable.length || !defaultLunchBreaks) {

            return { appointmentsSlots, concernedEvents, minWorkingHour, maxWorkingHour }
        }

        // Create a map to register the occupied slots
        const occupiedSlots = new Map()

        const fiveMinutesInMs = 1000 * 60 * 5

        // Array to register pontentials events representing a modified lunch break
        const lunchBreaksEvents = []

        // Var to see how busy is an employee
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

        // GET THE EVENTS OF THE CONCERNED DAY, BLOCK SCHEDULES SLOTS WHEN THEY ARE OCCURING AND UPDATE EMPLOYEE STATUS
        for (let event of events) {

            if (isSameDay(event.start, dtDay)
                && employeesAvailable.some(e => e._id.toString() === event.employee.toString())) {

                concernedEvents.push(event)
                
                // If we don't have the appointment duration, next iteration because we are only interested by the concernedEvents for the employee schedule
                if (!appointmentDuration ) continue;

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
                appointmentDuration && setOccupiedSlots(lunchBreak.start, lunchBreak.end, lunchBreak.employee)
            }
        }

        // If we don't have the appointment duration we return because we were only interesting on the concerned events to display them in the employee schedule
        if ( !appointmentDuration ) return { appointmentsSlots, concernedEvents, minWorkingHour, maxWorkingHour }


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
        while (isBefore(dtAppointmentStart.plus({ minutes: appointmentDuration }), maxWorkingHour, true)) {
            if (firstLoop) {
                dtAppointmentStart = getFirstAppointmentSlot()
                firstLoop = false
            }

            // Remove the employee that are not working throughout the entire appointment duration
            const workingEmployees = employeesAvailable.filter(e => {
                return dtAppointmentStart >= e.dtEmployeeStart &&
                    dtAppointmentStart.plus({ minutes: appointmentDuration }) <= e.dtEmployeeEnd
            })
            const employeesNumber = workingEmployees.length


            const dtAppointmentEndMs = dtAppointmentStart.plus({ minutes: appointmentDuration }).toMillis()

            // Check if there is an event registered for the start of the event
            const slotOccupied = occupiedSlots.get(dtAppointmentStart.toMillis())


            // If there is at least an employee available for the start
            if (!slotOccupied || slotOccupied.length !== employeesNumber) {

                // Array to determine the employees that are free during the all appointment
                let appointmentFreeEmployees = []

                const setSlotAvailabilities = (slot) => workingEmployees.filter(e => !slot.includes(e._id.toString()))

                appointmentFreeEmployees = !slotOccupied ?
                    workingEmployees :
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

        return { appointmentsSlots, concernedEvents, minWorkingHour, maxWorkingHour }

    }, [appointmentsAvailability, selectedEmployeesAvailabilities, events, dtDay, appointmentGapMs, appointmentDuration])


    return dayEventsSchedule
}