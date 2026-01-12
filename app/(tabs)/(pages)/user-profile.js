import { View, Platform, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { useSelector } from "react-redux";

import UserInformations from "@components/pages/user-pages/client-side/UserInformations";


export default function UserProfile() {

    const user = useSelector((state)=> state.user.value)

    return (
        <KeyboardAwareScrollView
            style={{ width: "100%", height: "100%" }}
            bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems: "center" }}
            overScrollMode="never"
            bounces={false}
        >

            <View style={appStyle.pageBody}>

                <Text style={appStyle.pageTitle}>
                    Mes informations
                </Text>

                <View style={[appStyle.card, { width: appStyle.largeItemWidth, paddingBottom: phoneDevice ? RPW(12) : 80 }]}>

                    <UserInformations user={user} />




                </View>

            </View>

        </KeyboardAwareScrollView>
    )
}