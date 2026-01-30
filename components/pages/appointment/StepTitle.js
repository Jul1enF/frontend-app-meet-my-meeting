import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function StepTitle({ title, chevronUp, chevronFunc, marginTop, noChevron }) {

    return (
        <View style={[styles.stepContainer, phoneDevice && { width: "100%" }, marginTop !== undefined && { marginTop }]}>

            <Text style={styles.stepText}>
                {title}
            </Text>

            {!noChevron &&
                <TouchableOpacity activeOpacity={0.6} onPress={chevronFunc} style={styles.iconContainer}>
                    <FontAwesome5
                        name={chevronUp ? "chevron-up" : "chevron-down"}
                        color={appStyle.fontColorDarkBg}
                        size={phoneDevice ? RPW(4.2) : 23}
                    />
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    stepContainer: {
        ...appStyle.largeItem,
        backgroundColor: appStyle.darkGrey,
        justifyContent: "center",
        borderRadius: 0,
    },
    stepText: {
        ...appStyle.pageSubtitle,
        fontSize: appStyle.pageSubtitle.fontSize * 0.95,
        textAlign: "left",
        width: "100%",
        paddingHorizontal: appStyle.regularHorizontalPadding,
        color: appStyle.fontColorDarkBg,
    },
    iconContainer : {
         width: phoneDevice ? RPW(14) : 85,
        aspectRatio: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        position: "absolute",
        right: 0,
        paddingRight : appStyle.regularHorizontalPadding,
    },
})