import { Stack } from "expo-router";
import { useEffect } from "react";
import * as ScreenOrientation from 'expo-screen-orientation'
import { phoneDevice } from "../utils/dimensions"
import Header from "@components/layout/Header";
import useIsAppObsolete from "@hooks/useIsAppObsolete";
import useUpdateRPW from "@hooks/useUpdateRPW";

import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { Settings } from "luxon";
import * as Localization from "expo-localization";
const locale = Localization.getLocales()?.[0]?.languageTag ?? Localization.getLocales()?.[0]?.languageCode ?? "fr"
Settings.defaultLocale = locale;

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from '@reducers/user'
import planning from "@reducers/planning";

const store = configureStore({
    reducer: { user, planning },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export const unstable_settings = {
  initialRouteName: "home",
};

export default function RootLayout() {

    const unlockPortraitModeTablet = async () => {
        !phoneDevice && await ScreenOrientation.unlockAsync()
    }

    useEffect(() => {
        unlockPortraitModeTablet()
    }, [phoneDevice])

    // Check if the version of the app is obsolete to eventually block it
    const appObsolete = useIsAppObsolete()

    // Update RPW for phones if they are has been some changes (accessibility zoom)
    const refreshRPW = useUpdateRPW()

    return (
        <Provider store={store}>
            <AutocompleteDropdownContextProvider >
                <KeyboardProvider>
                    <Stack screenOptions={{
                        header: (props) => <Header {...props} appObsolete={appObsolete} />,
                    }} >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                </KeyboardProvider>
            </AutocompleteDropdownContextProvider>
        </Provider>
    )
}