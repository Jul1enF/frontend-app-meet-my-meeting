import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useSelector } from "react-redux";

import GoingBackHeader from "@components/ui/GoingBackHeader";
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"


export default function UserStatusPage () {
    const { _id } = useLocalSearchParams()

    return (
        <View style={appStyle.pageBody}>
            
        </View>
    )
}