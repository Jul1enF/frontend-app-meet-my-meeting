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
    const [appointmentsSlots, setAppointmentsSlots] = useState(null)
    const [appointmentStart, setAppointmentStart] = useState(null)
    const [oldEvent, setOldEvent] = useState(null)
    const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)




    // PROPS FOR THE DAYS SCHEDULE CONTAINER
    const daysScheduleContext = useMemo(() => {
        return { appointmentStart, setAppointmentStart, setOldEvent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, email, jwtToken }
    }, [appointmentStart, selectedDate, employees, selectedEmployee, email])



    // PROPS FOR THE SCHEDULE
    const scheduleContext = useMemo(() => {
        return { events, closures, absences, appointmentGapMs, defaultSchedule, selectedEmployee, selectedDate, selectedAppointmentType, setAppointmentStart, setAppointmentsSlots, setOldEvent }
    },
        [scheduleInformations, selectedEmployee, selectedDate, selectedAppointmentType])



    // PROPS FOR EVENT REDACTION
    const redactionContext = useMemo(() => {

        return { setScheduleInformations, selectedEmployee, appointmentsSlots, appointmentStart, setAppointmentStart, oldEvent, appointmentTypes, users, selectedAppointmentType, setSelectedAppointmentType, jwtToken }
    },
        [selectedEmployee, appointmentsSlots, appointmentStart, oldEvent, appointmentTypes, users, selectedAppointmentType, jwtToken])


    return { daysScheduleContext, scheduleContext, redactionContext }
}