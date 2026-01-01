import { ScrollView } from 'react-native';
import { useEffect, useState, useMemo} from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import AppointmentTypesList from '@components/pages/appointment/AppointmentTypesList';
import AgendaContainer from '@components/pages/appointment/AgendaContainer';

export default function AppointmentPage() {
  const [warning, setWarning]=useState({})
  const [appointmentInfos, setAppointmentInfos] = useState({})
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState(null)
  const [selectedAppointmentSlot, setSelectedAppointmentSlot] = useState(null)

  // CREATE MEMO INFORMATIONS TO PASS TO CHILDREN
  const memoAppointmentInfos = useMemo(()=>{
    const{ events, closures, absences, appointmentGapMs, maxFuturDays, sortFreeEmployees} = appointmentInfos

    const employeesAutocompleteList = appointmentInfos.employees ? appointmentInfos.employees.reduce((acc, e)=>{
        acc.push({
          title : e.first_name,
          id : e._id,
          employee : e,
        })
        return acc
      }, [{title : "Sans préférence", id : "all", employees : appointmentInfos.employees}])
      : null

    return { events, closures, absences, appointmentGapMs, maxFuturDays, sortFreeEmployees, employeesAutocompleteList}

  },[ appointmentInfos.events, appointmentInfos.closures, appointmentInfos.absences, appointmentInfos.appointmentGapMs, appointmentInfos.maxFuturDays, appointmentInfos.sortFreeEmployees, appointmentInfos.employees])

  const appointmentDuration = useMemo(()=> selectedAppointmentType?.default_duration,[selectedAppointmentType])


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

  // Props to pass along children of the agenda
  const agendaUtils = useMemo(()=> ({ 
    selectedEmployees, 
    setSelectedEmployees, 
    selectedAppointmentSlot, 
    setSelectedAppointmentSlot, 
    ...memoAppointmentInfos, 
    appointmentDuration}),
  [selectedEmployees, selectedAppointmentSlot, memoAppointmentInfos, appointmentDuration])

  
  return (
    <ScrollView style={{ flex : 1}} contentContainerStyle={{ backgroundColor : appStyle.pageBody.backgroundColor, minWidth : "100%", minHeight : "100%"}} bounces={false} overScrollMode="never">

      <AppointmentTypesList appointmentTypes={appointmentInfos.appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} warning={warning} />

      {selectedAppointmentType && <AgendaContainer agendaUtils={agendaUtils} /> }

    </ScrollView>
  );
}

