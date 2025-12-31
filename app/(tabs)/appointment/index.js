import { Text, View } from 'react-native';
import { useEffect, useState, useMemo } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';
import { DateTime } from 'luxon';

import AppointmentTypesList from '@components/pages/appointment/appointment-types-list';
import useDayEventsSchedule from '@components/pages/appointment/useDayEventsSchedule';

export default function AppointmentPage() {
  const [warning, setWarning]=useState({})
  const [appointmentInfos, setAppointmentInfos] = useState({})
  const [selectedAppointmentType, setSelectedAppointmentType] = useState("none")
  const [selectedEmployees, setSelectedEmployees] = useState(null)
  
  const{ appointmentTypes, events, closures, absences, appointmentGapMs} = appointmentInfos

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


  // Get the free appointments slots depending on events informations

  const now = DateTime.now().setZone("Europe/Paris").plus({days : 2}) 

  const appointmentDuration = selectedAppointmentType?.default_duration
  
  const {appointmentsSlots , employeesAvailable} = useDayEventsSchedule(now, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration)

  // const freeSlots = useDayEventsSchedule(now, selectedEmployees, events, closures, absences, appointmentGapMs, appointmentDuration)

  // freeSlots && console.log(typeof freeSlots)

  if (appointmentsSlots && appointmentsSlots.length){
    appointmentsSlots.forEach( e => console.log(e.start) )
  }
  
  return (
    <View style={[appStyle.pageBody, {paddingBottom : 0, paddingTop : 0}]}>

      {<AppointmentTypesList appointmentTypes={appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} warning={warning} />}

    </View>
  );
}

