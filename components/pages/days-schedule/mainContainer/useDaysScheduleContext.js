import { useState, useMemo } from "react";
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



  // Function after event registration attempt to reset the selected criteriums and add an event or download fresh datas
  const resetAndRenewEvents = (event) => {

    // The registration has been successfull, a new event has been retrieved
    if (event) {
      setEventStart(null)
      if (event.category === "absence") {
        console.log("HERE !!")
        const newAbsences = [...scheduleInformations.absences, event].sort((a, b) => new Date(b.start) - new Date(a.start))

        setScheduleInformations(prev => ({
          ...prev,
          absences: newAbsences,
        }))

      } else if (event.category === "closure") {
        const newClosures = [...scheduleInformations.closures, event].sort((a, b) => new Date(b.start) - new Date(a.start))

        setScheduleInformations(prev => ({
          ...prev,
          closures: newClosures,
        }))

      }
      else {
        const newEvents = [...scheduleInformations.events, event].sort((a, b) => new Date(b.start) - new Date(a.start))

        setScheduleInformations(prev => ({
          ...prev,
          events: newEvents,
        }))
      }
    }
    else {
      getScheduleInformations()
    }

  }




  // PROPS FOR THE DAYS SCHEDULE CONTAINER
  const daysScheduleContext = useMemo(() => {
    return { eventStart, setEventStart, setOldEvent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, _id, jwtToken }
  }, [eventStart, selectedDate, employees, selectedEmployee, _id])



  // PROPS FOR THE SCHEDULE
  const scheduleContext = useMemo(() => {
    return { events, closures, absences, appointmentGapMs, defaultSchedule, selectedEmployee, selectedDate, setEventStart, setOldEvent }
  },
    [scheduleInformations, selectedEmployee, selectedDate])



  // PROPS FOR EVENT REDACTION
  const redactionContext = useMemo(() => {

    return { selectedEmployee, eventStart, setEventStart, oldEvent, appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedDate, jwtToken, resetAndRenewEvents }
  },
    [selectedEmployee, eventStart, oldEvent, appointmentTypes, scheduleInformations, selectedDate, jwtToken])


  return { daysScheduleContext, scheduleContext, redactionContext }
}