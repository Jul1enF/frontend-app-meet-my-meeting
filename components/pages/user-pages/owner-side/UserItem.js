import { View, StyleSheet, Text } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import { roleTranslation } from "constants/translations";


export default function UserItem(props) {

    return (
        <View style={styles.mainContainer} >

            <View style={styles.fullRow} >

                <View style={styles.row}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Nom :</Text>
                    </View>

                    <Text style={styles.userInfo}>
                        {props.last_name}
                    </Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Prénom :</Text>
                    </View>

                    <Text style={styles.userInfo}>
                        {props.first_name}
                    </Text>
                </View>

            </View>


             <View style={styles.fullRow} >
                       <View style={styles.row}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Email :</Text>
                </View>

                <Text style={styles.userInfo}>
                    {props.email}
                </Text>
            </View>

            <View style={styles.row}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Statut :</Text>
                </View>

                <Text style={styles.userInfo}>
                    {roleTranslation[props.role]}
                </Text>
            </View>
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
        paddingTop : phoneDevice ? RPW(4) : 25,
        marginBottom: phoneDevice ? RPW(4) : 20,
    },
    fullRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap : "wrap",
        width : "100%",
        rowGap : phoneDevice ? RPW(2) : 15,
        marginBottom : phoneDevice ? RPW(2) : 15,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        minWidth : "50%",
        maxWidth : "100%",
    },
    labelContainer: {
        borderBottomColor: appStyle.strongBlack,
        borderBottomWidth: phoneDevice ? 2 : 3,
        marginRight: phoneDevice ? RPW(3) : 15,
    },
    label: {
        ...appStyle.regularText,
        fontWeight: "600"
    },
    userInfo: {
        ...appStyle.regularText,
        maxWidth : "82%",
        paddingRight : phoneDevice ? RPW(1) : 8,
    }
})