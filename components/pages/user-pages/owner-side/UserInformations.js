import { View, Text, StyleSheet } from "react-native"
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import moment from 'moment/min/moment-with-locales'

export default function UserInformations({ user }) {

    return (
        <>
            <Text style={[appStyle.pageSubtitle, { color: appStyle.fontColorDarkBg, fontSize: appStyle.pageSubtitle.fontSize * 1.05 }]}>
                Informations :
            </Text>

            <View style={styles.row}>

                <View style={styles.col}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Nom :
                        </Text>
                    </View>


                    <Text style={styles.status}>
                        {user?.last_name}
                    </Text>
                </View>

                <View style={styles.col}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Prénom :
                        </Text>
                    </View>

                    <Text style={styles.status}>
                        {user?.first_name}
                    </Text>
                </View>

            </View>


            <View style={styles.row}>

                <View style={styles.col}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Email :
                        </Text>
                    </View>


                    <Text style={styles.status}>
                        {user?.email}
                    </Text>
                </View>

                <View style={styles.col}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Date d'inscription :
                        </Text>
                    </View>

                    <Text style={styles.status}>
                        {moment(user?.createdAt).format("DD / MM / YYYY")}
                    </Text>
                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        width: "100%",
        rowGap: phoneDevice ? RPW(8) : 45,
        marginTop: phoneDevice ? RPW(8) : 45,
    },
    col: {
        alignItems: "flex-start",
        minWidth: "50%",
        maxWidth: "100%",
        rowGap: phoneDevice ? RPW(3.7) : 15,
        paddingRight : phoneDevice ? RPW(1.6) : 8,
    },
    label: {
        ...appStyle.largeText,
        fontWeight: "700",
        color: appStyle.fontColorDarkBg,
        paddingBottom : phoneDevice ? RPW(1) : 6,
    },
    labelContainer: {
        borderBottomColor: appStyle.darkWhite,
        borderBottomWidth: phoneDevice ? 2 : 3,
    },
    status: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
    }
})