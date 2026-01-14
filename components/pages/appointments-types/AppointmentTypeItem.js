import { View, StyleSheet, Text } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import LabelValue from "@components/text/LabelValue";

export default function AppointmentTypeItem(props) {

    const informationsArray = [
        { label: "Catégorie :", details: props.category },
        { label: "Titre :", details: props.title },
        { label: "Durée :", details: `${props.default_duration} min` },
        { label: "Prix :", details: `${props.price} euros` },
    ]

    return (
        <View style={styles.mainContainer} >

            <View style={styles.row} >
                {
                    informationsArray.map((e, i) =>
                        <LabelValue key={i} {...e} labelStyle={styles.label} detailsStyle={styles.details} index={i} lastIndex={informationsArray.length - 1}
                            margin={phoneDevice ? RPW(2) : 12} />
                    )
                }

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: phoneDevice ? 3 : 4,
        borderColor: appStyle.strongRed,
        borderRadius: appStyle.regularItemBorderRadius,
        width: phoneDevice ? RPW(90) : 600,
        paddingHorizontal: appStyle.regularItem.paddingHorizontal,
        paddingBottom: phoneDevice ? RPW(3) : 15,
        paddingTop: phoneDevice ? RPW(4) : 25,
        marginBottom: phoneDevice ? RPW(4) : 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
    },
    label: {
        ...appStyle.labelText,
        fontWeight: phoneDevice ? "900" : "700",
        lineHeight: "auto"
    },
    details: {
        ...appStyle.largeText,
        fontWeight: "500",
        lineHeight: phoneDevice ? RPW(8) : 48,
    }
})