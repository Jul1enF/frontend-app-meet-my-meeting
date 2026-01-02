import { ScrollView, RefreshControl } from 'react-native';
import { useEffect, useState, useMemo } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';
import AppointmentTypesList from '@components/pages/appointment/AppointmentTypesList';
import AgendaContainer from '@components/pages/appointment/AgendaContainer';
import AppointmentValidation from '@components/pages/appointment/AppointmentValidation';

export default function AppointmentPage() {
  const [warning, setWarning] = useState({})
  const [appointmentInfos, setAppointmentInfos] = useState({})
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState(null)
  const [selectedAppointmentSlot, setSelectedAppointmentSlot] = useState(null)


  const employeesAutocompleteList = useMemo(() => {
    if (!appointmentInfos.employees) return null
    else return appointmentInfos.employees.reduce((acc, e) => {
      acc.push({
        title: e.first_name,
        id: e._id,
        employee: e,
      })
      return acc
    }, [{ title: "Sans préférence", id: "all", employees: appointmentInfos.employees }])

  }, [appointmentInfos.employees])

  const { events, closures, absences, appointmentGapMs, maxFuturDays, sortFreeEmployees, rolesPriorities } = appointmentInfos


  const appointmentDuration = useMemo(() => selectedAppointmentType?.default_duration, [selectedAppointmentType])


  // LOAD APPOINTMENTS INFORMATIONS FUNCTION AND USEEFFECT
  const getAppointmentInformations = async (clearEtag) => {
    const data = await request({ path: "appointments/appointment-informations", clearEtag, setWarning })
    if (data) {
      setAppointmentInfos(data.informations)
      setSelectedEmployees(data.informations.employees)
    }
  }

  useEffect(() => {
    getAppointmentInformations(true)
  }, [])

  // Props in useMemo to pass along children of the agenda
  const agendaContext = useMemo(() => ({
    selectedEmployees,
    setSelectedEmployees,
    setSelectedAppointmentSlot,
    events,
    closures,
    absences,
    appointmentGapMs,
    maxFuturDays,
    sortFreeEmployees,
    rolesPriorities,
    employeesAutocompleteList,
    appointmentDuration
  }),
    [selectedEmployees, appointmentDuration, appointmentInfos, employeesAutocompleteList])



  // Refresh component for the scrollview
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={[appStyle.strongBlack]} progressBackgroundColor={appStyle.pageBody.backgroundColor} tintColor={appStyle.strongBlack} onRefresh={() => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
    getAppointmentInformations()
  }} />


    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems : "center" }} bounces={false} overScrollMode="never" refreshControl={refreshComponent}>

        <AppointmentTypesList appointmentTypes={appointmentInfos.appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} setSelectedAppointmentSlot={setSelectedAppointmentSlot} warning={warning} />

        {selectedAppointmentType && <AgendaContainer agendaContext={agendaContext} selectedAppointmentSlot={selectedAppointmentSlot} />}

        {selectedAppointmentType && selectedAppointmentSlot && 
        <AppointmentValidation selectedAppointmentType={selectedAppointmentType} selectedAppointmentSlot={selectedAppointmentSlot} />
      }

      </ScrollView>
    )
  }


