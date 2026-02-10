import { useState, useMemo, useCallback } from "react";
import { DateTime } from "luxon";
import { useDispatch } from "react-redux";
import { createEvent, updateEvent, deleteEvent } from "@reducers/planning";

export default function usePlanningContext(planningInformations = {}, getPlanningInformations) {
  const dispatch = useDispatch()

  // Informations on the registered events and their context
  const { employees, appointmentTypes, users, events, closures, absences, workingOverrides, constants } = planningInformations

  const { slotGapMs, defaultSchedule, maxFuturDays = null } = constants ?? {}


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
      let category = "events"
      switch (event.category) {
        case "absence" :
          category = "absences"
          break ;
        case "closure" :
          category = "closures"
          break ;
        case "workingOverride" :
          category = "workingOverrides"
      }

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
  }, [eventStart, selectedDate, selectedEmployee, oldEvent, resetAndRenewEvents ])



  // PROPS FOR THE SCHEDULE
  const scheduleContext = useMemo(() => {
    return { events, closures, absences, workingOverrides, slotGapMs, defaultSchedule, selectedEmployee, selectedDate, setEventStart, setOldEvent, resetAndRenewEvents }
  },
    [planningInformations, selectedEmployee, selectedDate, resetAndRenewEvents])



  // PROPS FOR EVENT REDACTION
  const eventRedactionContext = useMemo(() => {

    return { selectedEmployee, setSelectedEmployee, eventStart, setEventStart, oldEvent, setOldEvent, employees, appointmentTypes, users, events, closures, absences, workingOverrides, slotGapMs, maxFuturDays, selectedDate, setSelectedDate, resetAndRenewEvents}
  },
    [selectedEmployee, eventStart, oldEvent, planningInformations, selectedDate, resetAndRenewEvents])


  // PROPS FOR WORKING OVERRIDE REDACTION

  const workingOverrideContext = useMemo(()=>{
    const defaultWorkingSchedule = {...defaultSchedule}
    delete defaultWorkingSchedule.enabled

    return { resetAndRenewEvents, defaultWorkingSchedule, oldEvent }

  },[defaultSchedule, oldEvent, resetAndRenewEvents])


  return { rootContext, scheduleContext, eventRedactionContext, workingOverrideContext }
}