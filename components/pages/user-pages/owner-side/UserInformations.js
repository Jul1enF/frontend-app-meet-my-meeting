import { View, Text, StyleSheet } from "react-native"
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { DateTime } from "luxon"
import LabelValue from "@components/text/LabelValue"

export default function UserInformations({ user }) {

    const informationsArray = [
        { label: "Nom :", details: user?.last_name },
        { label: "Prénom :", details: user?.first_name },
        { label: "Email :", details: user?.email },
        { label: "Inscription :", details: " le " + DateTime.fromJSDate(new Date(user?.createdAt)).toFormat("dd / MM / yyyy") }
    ]

    return (
        <>
            <Text style={[appStyle.pageSubtitle, { color: appStyle.fontColorDarkBg, fontSize: appStyle.pageSubtitle.fontSize * 1.07 }]}>
                Informations :
            </Text>

            <View style={styles.row}>

                {
                    informationsArray.map((e, i) =>
                        <LabelValue key={i} {...e} labelStyle={styles.label} detailsStyle={styles.details} index={i} lastIndex={informationsArray.length - 1} underlineColor={appStyle.fontColorDarkBg} margin={phoneDevice ? RPW(5) : 35} extraSpace={phoneDevice ? false : true} marginMult={0.25} />
                    )
                }

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginTop : appStyle.largeMarginTop,
    },
    label: {
        ...appStyle.labelText,
        fontWeight: phoneDevice ? "900" : "700",
        lineHeight: "auto",
        color : appStyle.fontColorDarkBg,
    },
    details: {
        ...appStyle.largeText,
        fontWeight: "500",
        lineHeight: phoneDevice ? RPW(8) : 48,
        color : appStyle.fontColorDarkBg,
    }
})