import { useMemo } from "react";
import { DateTime } from "luxon";
import { isBefore } from "@utils/timeFunctions";

export default function useFreeAppointmentSlots(dtDay, selectedEmployees, events, closures, absences, appointmentGap) {

    // Get the working hours and availability of the selected employee(s)
    const selectedEmployeesAvailabilities = useMemo(()=>{
        if (!selectedEmployees || dtDay) return null

        let minWorkingHour 
        let maxWorkingHour
        let noAvailabilitiesCount = 0

        const dayIndex = dtDay.weekday - 1

        selectedEmployees.forEach((employee)=>{
            const employeeDay = employee.schedule[dayIndex]
            const dtEmployeeStart = DateTime.fromFormat(employeeDay.start, "HH:mm", { zone: "Europe/Paris" })
            const dtEmployeeEnd = DateTime.fromFormat(employeeDay.end, "HH:mm", { zone: "Europe/Paris" })

            // The employee is not available
            if (!employeeDay.enabled){
                noAvailabilitiesCount += 1
                return
            }

            if (!minWorkingHour) minWorkingHour = dtEmployeeStart
            else {
                if (isBefore(dtEmployeeStart < minWorkingHour)) minWorkingHour = dtEmployeeStart
            }

            if (!maxWorkingHour) maxWorkingHour = dtEmployeeEnd
            else {
                if (isBefore(maxWorkingHour < dtEmployeeEnd)) minWorkingHour = dtEmployeeStart
            }
        })

        const noEmployeeAvailability = noAvailabilitiesCount === selectedEmployees.length ? true : false

        return { noEmployeeAvailability, minWorkingHour, maxWorkingHour}

    },[selectedEmployees, dtDay])



    
    // Verification that the shop is not closed
    const noAppointmentsAvailable = useMemo(() => {
        if (!dtDay || !closures ) return null

        let noAvailability = false
        if (closures.length) {
            closures.forEach((closure) => { 
                if (isBefore(closure.start, dtDay) && isBefore(dtDay, closure.end)) noAvailability = true
            })
        }

        if (noAvailability) return noAvailability



    }, [dtDay, closures ])

    const freeSlots = useMemo(() => {
        if (!dtDay || !events || !closures || !absences || !appointmentGap) return null

        const dayIndex = dtDay.weekday - 1

        const maxDayTime = null
    }, [])
    return freeSlots
}