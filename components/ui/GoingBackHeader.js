import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { RPH, RPW, phoneDevice } from '@utils/dimensions.js'
import { appStyle } from '@styles/appStyle.js';

export default function GoingBackHeader({ back, previousPage, previousPageName, leftFunction }) {
const router = useRouter()

const leftBtnPress = ()=>{
    typeof leftFunction === "function" && leftFunction()
    back && router.back()
    previousPage && router.navigate(previousPage)
}

    return (
        <View style={styles.headerBody}>
            <TouchableOpacity style={styles.buttonContainer} onPress={leftBtnPress}>
                <FontAwesome5 name="chevron-left" color={appStyle.brightGrey} size={phoneDevice ? RPW(4.2) : 25} style={{ marginRight: phoneDevice ? RPW(4) : 30 }} />
                {previousPageName && <Text style={styles.buttonText}>{previousPageName}</Text>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerBody: {
        backgroundColor: appStyle.strongRed,
        height: appStyle.secondHeaderHeight,
        width: "100%",
        minWidth : "100%",
        ...appStyle.secondHeaderBorderBottom,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal : appStyle.secondHeaderHorizPadd,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    buttonText: {
        ...appStyle.secondHeaderText,
        fontWeight : "600",
        letterSpacing : phoneDevice ? RPW(0.2) : 1.5,
        color: appStyle.fontColorDarkBg,
    }
})