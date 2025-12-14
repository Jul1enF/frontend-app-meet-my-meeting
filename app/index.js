import { Redirect } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function EntryPoint() {
  return <Redirect href="/date-picker" />;
}