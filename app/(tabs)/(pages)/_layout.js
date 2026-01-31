import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="login" title="Connexion" />
            <Stack.Screen name="days-schedule" title="Agenda" />
            <Stack.Screen name="user-profile" title="Mes informations" />
        </Stack>
    )
}