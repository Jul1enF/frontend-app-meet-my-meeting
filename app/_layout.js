import { Stack } from "expo-router";
import { useEffect } from "react";
import * as ScreenOrientation from 'expo-screen-orientation'
import { phoneDevice } from "../utils/dimensions"
import Header from "components/layout/Header";
import useIsAppObsolete from "hooks/useIsAppObsolete";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from 'reducers/user'


const store = configureStore({
    reducer: { user },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export default function RootLayout() {

    const unlockPortraitModeTablet = async () => {
        !phoneDevice && await ScreenOrientation.unlockAsync()
    }

    useEffect(() => {
        unlockPortraitModeTablet()
    }, [phoneDevice])

    // Check if the version of the app is obsolete to eventually block it
    const appObsolete = useIsAppObsolete()

    return (
        <Provider store={store}>
            <Stack screenOptions={{
                header: (props) => <Header {...props} appObsolete={appObsolete} />,
            }} >
                <Stack.Screen name="index" />
                 <Stack.Screen name="home" options={{
                    title: "Accueil",
                    animation : "none",
                }} />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </Provider>
    )
}