import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="index" title="Home 2" />
            <Stack.Screen name="login" title="Connexion" />
        </Stack>
    )
}