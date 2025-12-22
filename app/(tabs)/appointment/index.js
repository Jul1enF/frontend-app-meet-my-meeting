import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

export default function AppointmentPage() {
  // LOAD APPOINTMENTS INFORMATIONS FUNCTION AND USEEFFECT
      const getAppointmentInformations = async (clearEtag) => {
          const data = await request({ path: "appointments/appointment-informations", clearEtag })
          if (data) {
            //  console.log("DATA :", data)
          }
      }
    
      useEffect(() => {
          getAppointmentInformations(true)
      }, [])

  return (
      <View style={appStyle.pageBody}>
        <Text style={appStyle.pageTitle}>Rendez-vous !</Text>
      </View>
  );
}

const styles = StyleSheet.create({

});
