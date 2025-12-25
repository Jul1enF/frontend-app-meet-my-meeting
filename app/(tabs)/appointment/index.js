import { Text, View } from 'react-native';
import { useEffect, useState, useMemo } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import AppointmentTypesList from '@components/pages/appointment/appointment-types-list';

export default function AppointmentPage() {
  const [warning, setWarning]=useState({})
  const [appointmentInfos, setAppointmentInfos] = useState({})
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)


  // LOAD APPOINTMENTS INFORMATIONS FUNCTION AND USEEFFECT
  const getAppointmentInformations = async (clearEtag) => {
    const data = await request({ path: "appointments/appointment-informations", clearEtag, setWarning })
    if (data) {
      setAppointmentInfos(data.informations)
    }
  }


  useEffect(() => {
    getAppointmentInformations(true)
  }, [])
  
  return (
    <View style={[appStyle.pageBody, {paddingBottom : 0}]}>
      <View style={{borderBottomColor: appStyle.strongBlack,
        borderBottomWidth: phoneDevice ? 3 : 5}}>
        <Text style={[appStyle.pageTitle, {paddingBottom : phoneDevice ? RPW(2.5) : 15}]}>Prendre un rendez vous :</Text>
      </View>

      <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
        {warning?.text}
      </Text>

      {<AppointmentTypesList appointmentTypes={appointmentInfos?.appointmentTypes} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} />}

    </View>
  );
}

