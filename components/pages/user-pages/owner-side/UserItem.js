import { View, StyleSheet, Text } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { roleTranslation } from "constants/translations";

import LabelValue from "@components/text/LabelValue";


export default function UserItem(props) {

    const informationsArray = [
        { label: "Nom :", details: props.last_name },
        { label: "Prénom :", details: props.first_name },
        { label: "Email :", details: props.email },
        { label: "Satut :", details: roleTranslation[props.role] },
    ]

    return (
        <View style={styles.mainContainer} >

            <View style={styles.row}>
                {
                    informationsArray.map((e, i) =>
                        <LabelValue key={i} {...e} labelStyle={styles.label} detailsStyle={styles.details} index={i} lastIndex={informationsArray.length - 1} extraSpace={phoneDevice ? false : true} />
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
        paddingHorizontal: appStyle.regularHorizontalPadding,
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
        ...appStyle.regularText,
        fontWeight: phoneDevice ? "800" : "700",
        lineHeight: "auto"
    },
    details: {
        ...appStyle.regularText,
        fontWeight: "500",
        lineHeight: phoneDevice ? RPW(8) : 48,
    }
})