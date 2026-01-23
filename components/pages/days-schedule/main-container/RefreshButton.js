import { StyleSheet, TouchableOpacity } from 'react-native';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function RefreshButton({ refreshData }) {

    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.refreshIconContainer} onPress={refreshData}>
            <MaterialCommunityIcons name="refresh" size={phoneDevice ? RPW(7) : 42} color="black" />
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    refreshIconContainer: {
        height: appStyle.largeItemHeight,
        aspectRatio: 1,
        backgroundColor: "rgb(192, 192, 192)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: appStyle.regularItemBorderRadius,
    },
})