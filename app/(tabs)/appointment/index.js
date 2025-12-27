import { Text, View } from 'react-native';
import { useEffect, useState, useMemo } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';
import { DateTime } from 'luxon';

import AppointmentTypesList from '@components/pages/appointment/appointment-types-list';
import useFreeAppointmentSlots from '@components/pages/appointment/useFreeAppointmentsSlots';

export default function AppointmentPage() {
  const [warning, setWarning]=useState({})
  const [appointmentInfos, setAppointmentInfos] = useState({})
  const [selectedAppointmentType, setSelectedAppointmentType] = useState("none")
  const [selectedEmployees, setSelectedEmployees] = useState(null)
  
  const{ appointmentTypes, events, closures, absences, appointmentGap} = appointmentInfos

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

  const now = DateTime.now().setZone("Europe/Paris") 
  
  const freeSlots = useFreeAppointmentSlots(now, selectedEmployees, events, closures, absences, appointmentGap)
  
  return (
    <View style={[appStyle.pageBody, {paddingBottom : 0, paddingTop : 0}]}>

      {<AppointmentTypesList appointmentTypes={appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} warning={warning} />}

    </View>
  );
}

