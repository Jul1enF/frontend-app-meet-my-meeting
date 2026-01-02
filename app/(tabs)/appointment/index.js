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

  const employeesAutocompleteList = useMemo(()=> {
    if (!appointmentInfos.employees) return null
    else return appointmentInfos.employees.reduce((acc, e)=>{
        acc.push({
          title : e.first_name,
          id : e._id,
          employee : e,
        })
        return acc
      }, [{title : "Sans préférence", id : "all", employees : appointmentInfos.employees}])

  },[appointmentInfos.employees])

  const{ events, closures, absences, appointmentGapMs, maxFuturDays, sortFreeEmployees, rolesPriorities} = appointmentInfos


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

  // Props in useMemo to pass along children of the agenda
  const agendaContext = useMemo(()=> ({ 
    selectedEmployees, 
    setSelectedEmployees, 
    selectedAppointmentSlot, 
    setSelectedAppointmentSlot, 
    events, 
    closures, 
    absences, 
    appointmentGapMs, 
    maxFuturDays, 
    sortFreeEmployees,
    rolesPriorities,
    employeesAutocompleteList,
    appointmentDuration}),
  [selectedEmployees, selectedAppointmentSlot, appointmentDuration, appointmentInfos, employeesAutocompleteList])
  

  
  return (
    <ScrollView style={{ flex : 1}} contentContainerStyle={{ backgroundColor : appStyle.pageBody.backgroundColor, minWidth : "100%", minHeight : "100%"}} bounces={false} overScrollMode="never">

      <AppointmentTypesList appointmentTypes={appointmentInfos.appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} warning={warning} />

      {selectedAppointmentType && <AgendaContainer agendaContext={agendaContext} /> }

    </ScrollView>
  );
}

