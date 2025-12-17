import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="home" title="Home" />
            <Stack.Screen name="login" title="Connexion" />
        </Stack>
    )
}