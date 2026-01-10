import { useState, useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";

export default function useDaysScheduleContext(scheduleInformations = {}, setScheduleInformations, getScheduleInformations) {

  // Informations on the current user
  const jwtToken = useSelector((state) => state.user.value.jwtToken)
  const _id = useSelector((state) => state.user.value._id)


  // Informations on the registered events and their context
  const { employees, appointmentTypes, users, events, closures, absences, appointmentGapMs, defaultSchedule } = scheduleInformations


  // States for the appointment schedule
  const [selectedDate, setSelectedDate] = useState(DateTime.now({ zone: "Europe/Paris" }).startOf('day'))
  const [selectedEmployee, setSelectedEmployee] = useState(null)


  // States for the event redaction page
  const [eventStart, setEventStart] = useState(null)
  const [oldEvent, setOldEvent] = useState(null)



  // Function after event modification to reset the selected criteriums and modify an event in the state or download fresh datas
  const resetAndRenewEvents = useCallback((event, method) => {

    // An event has been sent, the modification was successfull
    if (event) {
      setEventStart(null)
      setOldEvent(null)

      // Choose the right array to modify in the state depending on the event category
      const category = event.category === "absence" ? "absences" : event.category === "closure" ? "closures" : "events"

      // Functions object to modify the state depending on the method
      const methodFunctions = {
        // Registration event function
        create: (prevEvents) => [...prevEvents, event].sort((a, b) => new Date(b.start) - new Date(a.start)),
        // Update event function
        update: (prevEvents) => prevEvents.map(e => e._id === event._id ? event : e),
        // Delete event function
        delete: (prevEvents) => [...prevEvents].filter(e => e._id !== event._id),
      }

      setScheduleInformations(prev => ({
        ...prev,
        [category]: methodFunctions[method](prev[category])
      }))


    }
    else {
      getScheduleInformations()
    }

  }, [getScheduleInformations])




  // PROPS FOR THE DAYS SCHEDULE CONTAINER
  const daysScheduleContext = useMemo(() => {
    return { eventStart, setEventStart, setOldEvent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, _id, jwtToken }
  }, [eventStart, selectedDate, employees, selectedEmployee, _id])



  // PROPS FOR THE SCHEDULE
  const scheduleContext = useMemo(() => {
    return { events, closures, absences, appointmentGapMs, defaultSchedule, selectedEmployee, selectedDate, setEventStart, setOldEvent, resetAndRenewEvents }
  },
    [scheduleInformations, selectedEmployee, selectedDate])



  // PROPS FOR EVENT REDACTION
  const redactionContext = useMemo(() => {

    return { selectedEmployee, eventStart, setEventStart, oldEvent, appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedDate, jwtToken, resetAndRenewEvents }
  },
    [selectedEmployee, eventStart, oldEvent, appointmentTypes, scheduleInformations, selectedDate, jwtToken])


  return { daysScheduleContext, scheduleContext, redactionContext }
}