import { Text, View, StyleSheet } from 'react-native';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function StepTitle({ title, chevronUp, chevronFunc, marginTop, noChevron }) {

    return (
        <View style={[styles.stepContainer, phoneDevice && { width: "100%" }, marginTop !== undefined && {marginTop}]}>

            <Text style={styles.stepText}>
                {title}
            </Text>

           {!noChevron && <FontAwesome5
                name={chevronUp ? "chevron-up" : "chevron-down"}
                color={appStyle.fontColorDarkBg}
                size={phoneDevice ? RPW(4.2) : 23}
                style={styles.chevronIcon}
                onPress={chevronFunc}
            />}
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
        textAlign: "left",
        width: "100%",
        paddingHorizontal: appStyle.regularLateralPadding,
        color: appStyle.fontColorDarkBg,
    },
    chevronIcon: {
        position: "absolute",
        right: appStyle.regularLateralPadding,
    },
})