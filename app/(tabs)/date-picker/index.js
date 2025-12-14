import { StyleSheet, Text, View, StatusBar } from 'react-native';

import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import DatePicker from '@components/ui/DatePicker/DatePicker';

export default function DatePickerPage() {
   // FOR HIDING SPLASH SCREEN WHEN PAGE IS LOADED 
    useEffect(() => {
      setTimeout(()=>  SplashScreen.hideAsync(), 500)
    }, []);


  return (
      <View style={styles.body}>
        <StatusBar translucent={true} backgroundColor="transparent" barStyle="light" />
        <Text style={styles.pageTitle}>Date Picker</Text>

        <DatePicker />

      </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...appStyle.pageBody,
    alignItems: 'center',
  },
  pageTitle: {
    ...appStyle.pageTitle,
  },
});
