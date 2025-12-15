import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import {RPH, RPW} from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import * as SplashScreen from 'expo-splash-screen';


export default function HomePage() {
  // FOR HIDING SPLASH SCREEN WHEN PAGE IS LOADED 
  useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 500)
  }, []);

  return (
    <View style={styles.container}>
      <Text style={appStyle.pageTitle}>Welcome !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...appStyle.pageBody,
    justifyContent: 'center',
  },
});
