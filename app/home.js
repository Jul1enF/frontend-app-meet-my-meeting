import { router } from 'expo-router'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar } from 'react-native';

// FOR HIDING SPLASH SCREEN WHEN PAGE IS LOADED 
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from '@styles/appStyle';

export default function HomePage() {

  // FOR HIDING SPLASH SCREEN WHEN PAGE IS LOADED 
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);


  return (
    <View style={styles.body}>
      <StatusBar translucent={true} backgroundColor="transparent" barStyle="light" />
      <Text style={styles.pageTitle}>Home 1 !</Text>
      <TouchableOpacity onPress={() => router.navigate('/tab1')} style={[appStyle.button, appStyle.regularItem, appStyle.lightGreyBorder]}>
        <Text style={appStyle.regularText}>Go to Tabs</Text>
      </TouchableOpacity>
      {/* <TextInput style={[appStyle.largeItem, appStyle.input, appStyle.regularText, { backgroundColor: appStyle.blueLink }]} ></TextInput> */}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...appStyle.pageBody,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    ...appStyle.pageTitle,
  },
});
