import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useSelector } from "react-redux";
import { usersSelectors } from "@reducers/users"

import GoingBackHeader from "@components/ui/GoingBackHeader";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"


export default function UserStatusPage() {
    const { _id } = useLocalSearchParams()
    const user = useSelector(state => usersSelectors.selectById(state, _id))


    return (
        <>
            <GoingBackHeader previousPageName="Liste des utilisateurs" back={true} />
            <View style={appStyle.pageBody}>
                <Text style={appStyle.pageTitle}>
                    {user.email}
                </Text>
            </View>
        </>
    )
}