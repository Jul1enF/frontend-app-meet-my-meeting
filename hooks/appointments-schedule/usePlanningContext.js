import { useState, useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { useDispatch } from "react-redux";
import { createEvent, updateEvent, deleteEvent } from "@reducers/planning";

export default function usePlanningContext(planningInformations = {}, getPlanningInformations) {
  const dispatch = useDispatch()

  // Informations on the registered events and their context
  const { employees, appointmentTypes, users, events, closures, absences, constants } = planningInformations

  const { appointmentGapMs, defaultSchedule, maxFuturDays = null } = constants ?? {}


  // States for the appointment schedule
  const [selectedDate, setSelectedDate] = useState(DateTime.now({ zone: "Europe/Paris" }))
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // States for the event redaction page
  const [eventStart, setEventStart] = useState(null)
  const [oldEvent, setOldEvent] = useState(null)



  // Function after event modification to reset the selected criteriums and modify an event in the state or download fresh datas
  const resetAndRenewEvents = useCallback((event, method, target) => {

    // An event has been sent, the modification was successfull
    if (event) {
      setEventStart(null)
      setOldEvent(null)

      // Choose the right array to modify in the state depending on the event category
      const category = event.category === "absence" ? "absences" : event.category === "closure" ? "closures" : "events"

      const payload = {target, category, event}

      // Dispatch functions object to modify the reducer depending on the method
      const methodDispatchers = {
        // Registration event function
        create: () => dispatch(createEvent(payload)),
        // Update event function
        update: () => dispatch(updateEvent(payload)),
        // Delete event function
        delete: () => dispatch(deleteEvent(payload)),
      }

      methodDispatchers[method]?.()

    }
    else {
      getPlanningInformations(planningInformations)
    }

  }, [getPlanningInformations])




  // PROPS FOR THE ROOT CONTAINER
  const rootContext = useMemo(() => {
    return { eventStart, setEventStart, setOldEvent, selectedDate, setSelectedDate, selectedEmployee, setSelectedEmployee, oldEvent, resetAndRenewEvents }
  }, [eventStart, selectedDate, selectedEmployee, oldEvent ])



  // PROPS FOR THE SCHEDULE
  const scheduleContext = useMemo(() => {
    return { events, closures, absences, appointmentGapMs, defaultSchedule, selectedEmployee, selectedDate, setEventStart, setOldEvent, resetAndRenewEvents }
  },
    [planningInformations, selectedEmployee, selectedDate])



  // PROPS FOR EVENT REDACTION
  const redactionContext = useMemo(() => {

    return { selectedEmployee, setSelectedEmployee, eventStart, setEventStart, oldEvent, employees, appointmentTypes, users, events, closures, absences, appointmentGapMs, maxFuturDays, selectedDate, setSelectedDate, resetAndRenewEvents}
  },
    [selectedEmployee, eventStart, oldEvent, planningInformations, selectedDate])


  return { rootContext, scheduleContext, redactionContext }
}