import { View, StyleSheet, Text } from "react-native";

import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'

export default function DayItem({ dayNumber }) {

    return (
        <View style={StyleSheet.mainContainer}>
            <Text style={styles.dayNumber} >
                {dayNumber}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "red",
        minWidth: RPW(12),
        minHeight: RPW(12),
    },
    dayNumber: {
        ...appStyle.regularText,
    }
})