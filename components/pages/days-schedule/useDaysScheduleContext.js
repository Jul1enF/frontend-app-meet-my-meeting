import { useState, useMemo } from "react";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";

export default function useDaysScheduleContext(scheduleInformations = {}, setScheduleInformations) {

    // Informations on the current user
    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const email = useSelector((state) => state.user.value.email)


    // Informations on the registered events and their context
    const { employees, appointmentTypes, users, events, closures, absences, appointmentGapMs, defaultSchedule } = scheduleInformations


    // States for the appointment schedule
    const [selectedDate, setSelectedDate] = useState(DateTime.now({ zone: "Europe/Paris" }).startOf('day'))
    const [selectedEmployee, setSelectedEmployee] = useState(null)


    // States for the event redaction page
    const [eventStart, setEventStart] = useState(null)
    const [oldEvent, setOldEvent] = useState(null)




    // PROPS FOR THE DAYS SCHEDULE CONTAINER
    const daysScheduleContext = useMemo(() => {
        return { eventStart, setEventStart, setOldEvent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, email, jwtToken }
    }, [eventStart, selectedDate, employees, selectedEmployee, email])



    // PROPS FOR THE SCHEDULE
    const scheduleContext = useMemo(() => {
        return { events, closures, absences, appointmentGapMs, defaultSchedule, selectedEmployee, selectedDate, setEventStart, setOldEvent }
    },
        [scheduleInformations, selectedEmployee, selectedDate])



    // PROPS FOR EVENT REDACTION
    const redactionContext = useMemo(() => {

        return { setScheduleInformations, selectedEmployee, eventStart, setEventStart, oldEvent, appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedDate, jwtToken }
    },
        [selectedEmployee, eventStart, oldEvent, appointmentTypes, scheduleInformations, selectedDate, jwtToken ])


    return { daysScheduleContext, scheduleContext, redactionContext }
}