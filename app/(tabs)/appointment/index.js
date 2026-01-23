import { View, Platform } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSelector, useDispatch } from 'react-redux';
import { loadInformations, createEvent } from '@reducers/planning';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';
import useRefreshControl from '@hooks/useRefreshControl';
import AppointmentTypesList from '@components/pages/appointment/AppointmentTypesList';
import AgendaContainer from '@components/pages/appointment/AgendaContainer';
import AppointmentValidation from '@components/pages/appointment/AppointmentValidation';

export default function AppointmentPage() {
  const dispatch = useDispatch()
  const appointmentsInformations = useSelector((state)=> state.planning.value.appointments)
  const { employees } = appointmentsInformations

  const [warning, setWarning] = useState({})
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState(null)
  const [selectedAppointmentSlot, setSelectedAppointmentSlot] = useState(null)


  const employeesAutocompleteList = useMemo(() => {
    if (!employees) return null
    else return employees.reduce((acc, e) => {
      acc.push({
        title: `${e.first_name ? (e.first_name + " ") : ""}${e.last_name ?? ""}`,
        id: e._id,
        employee: e,
      })
      return acc
    }, [{ title: "Sans préférence", id: "all", employees, }])

  }, [employees])


  const appointmentDuration = useMemo(() => selectedAppointmentType?.default_duration, [selectedAppointmentType])


  // LOAD APPOINTMENTS INFORMATIONS FUNCTION AND USEEFFECT
  const getAppointmentInformations = async (storedData) => {

    const data = await request({ path: "/appointments/appointment-informations", setWarning, storedData })
 
    if (data?.result) {
      dispatch(loadInformations({target : "appointments", informations : data.informations}))
      setSelectedEmployees(prev => prev ?? data.informations.employees)
    }else if (!selectedEmployees){
      setSelectedEmployees(employees)
    }
  }

  useEffect(() => {
    // The appointments informations could have already been fetched and loaded in user-appointments, menaning we have the employees list and no need to fetch
    if (employees) setSelectedEmployees(prev => prev ?? employees)
    else getAppointmentInformations(appointmentsInformations)
  }, [])

  // Props in useMemo to pass along children of the agenda
  const agendaContext = useMemo(() => {
    const { events, closures, absences, workingOverrides, constants } = appointmentsInformations
    const { slotGapMs, maxFuturDays, sortFreeEmployees, rolesPriorities } = constants ?? {}

    return { selectedEmployees, setSelectedEmployees, setSelectedAppointmentSlot, events, closures, absences, workingOverrides, slotGapMs, maxFuturDays, sortFreeEmployees, rolesPriorities, employeesAutocompleteList, appointmentDuration }
  },
    [selectedEmployees, appointmentDuration, appointmentsInformations, employeesAutocompleteList])



  // refreshControl for the ScrollView
  const refreshControl = useRefreshControl(()=> getAppointmentInformations(appointmentsInformations))


  // Function for Appointment Validation to reset the selected criteriums and add an event or download fresh datas
  const resetAndRenewEvents = (event) => {
    setSelectedAppointmentSlot(null)

    // The registration has been successfull, a new event has been retrieved
    if (event) {
      setSelectedEmployees(employees)
      setSelectedAppointmentType(null)

      dispatch(createEvent({ target : "appointments", category : "events", event}))
    }
    else {
      getAppointmentInformations()
    }

  }

  return (
    <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>
      <KeyboardAwareScrollView
        style={{ width: "100%", height: "100%" }}
        bottomOffset={Platform.OS === 'ios' ? 40 : 20}
        contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems: "center" }}
        overScrollMode="never"
        refreshControl={refreshControl}
      >

        <AppointmentTypesList appointmentTypes={appointmentsInformations.appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} setSelectedAppointmentSlot={setSelectedAppointmentSlot} warning={warning} />

        {selectedAppointmentType && <AgendaContainer agendaContext={agendaContext} selectedAppointmentSlot={selectedAppointmentSlot} />}

        {selectedAppointmentType && selectedAppointmentSlot &&
          <AppointmentValidation selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} selectedAppointmentSlot={selectedAppointmentSlot} resetAndRenewEvents={resetAndRenewEvents} />
        }

      </KeyboardAwareScrollView>
    </View>
  )
}


