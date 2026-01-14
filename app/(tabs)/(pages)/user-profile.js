import { View, Platform, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { useSelector } from "react-redux";

import UserInformations from "@components/pages/user-pages/client-side/UserInformations";


export default function UserProfile() {

    const user = useSelector((state) => state.user.value)

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}
            contentContainerStyle={[
                appStyle.pageBody,
                { flex : "auto" }
            ]}
            bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            overScrollMode="never"
            bounces={false}
        >

                <Text style={appStyle.pageTitle}>
                    Mes informations
                </Text>

                <View style={appStyle.largeCard}>

                    <UserInformations user={user} />

                </View>

        </KeyboardAwareScrollView>
    )
}