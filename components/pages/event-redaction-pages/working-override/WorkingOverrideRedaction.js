import { Text, View, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';


export default function WorkingOverrideRedaction ({oldEvent}) {

    return (
        <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}
                contentContainerStyle={[
                    appStyle.pageBody,
                    { flex : "auto" }
                ]}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
                bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            >
                <Text style={appStyle.pageTitle}>
                    {`${oldEvent.category === "dayOff" ? "Rajouter" : "Modifier"} une journée de travail :`}
                </Text>

            </KeyboardAwareScrollView>
    )
}