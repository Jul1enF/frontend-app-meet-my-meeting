import { ScrollView } from 'react-native';
import { useEffect, useState} from 'react';

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
  const [employeesAutocompleteList, setEmployeesAutocompleteList]=useState([])
  const [selectedAppointmentSlot, setSelectedAppointmentSlot] = useState(null)

  
  const{ appointmentTypes, events, closures, absences, appointmentGapMs, maxFuturDays, sortFreeEmployees} = appointmentInfos

  // LOAD APPOINTMENTS INFORMATIONS FUNCTION AND USEEFFECT
  const getAppointmentInformations = async (clearEtag) => {
    const data = await request({ path: "appointments/appointment-informations", clearEtag, setWarning })
    if (data) {
      setAppointmentInfos(data.informations)
      setSelectedEmployees(data.informations.employees)

      setEmployeesAutocompleteList(data.informations.employees.reduce((acc, e)=>{
        acc.push({
          title : e.first_name,
          id : e._id,
          employee : e,
        })
        return acc
      }, [{title : "Sans préférence", id : "all", employees : data.informations.employees}]))
    }
  }

  useEffect(() => {
    getAppointmentInformations(true)
  }, [])


  // Get the free appointments slots depending on events informations

  const appointmentDuration = selectedAppointmentType?.default_duration

  const agendaUtils = {employeesAutocompleteList, selectedEmployees, setSelectedEmployees, selectedAppointmentSlot, setSelectedAppointmentSlot, events, closures, absences, appointmentGapMs, maxFuturDays, sortFreeEmployees, appointmentDuration}

  
  return (
    <ScrollView style={{ flex : 1}} contentContainerStyle={{ backgroundColor : appStyle.pageBody.backgroundColor, minWidth : "100%", minHeight : "100%"}} bounces={false} overScrollMode="never">

      <AppointmentTypesList appointmentTypes={appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} warning={warning} />

      {selectedAppointmentType && <AgendaContainer agendaUtils={agendaUtils} /> }

    </ScrollView>
  );
}

