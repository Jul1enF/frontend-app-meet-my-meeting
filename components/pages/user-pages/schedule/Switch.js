import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle";

export default function Switch({ leftFunction, rightFunction, active, style, height, width}) {
    const thisHeight = height ?? appStyle.regularItemHeight / 2
    const thisWidth = width ?? appStyle.regularItemWidth / 2

    return (
        <View style={[styles.mainContainer, { height : thisHeight * 1.32, width : thisWidth * 1.32, borderRadius : (thisHeight * 1.32) /2 }, active && {backgroundColor : appStyle.strongGreen}, style && style]}>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => leftFunction()}>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => rightFunction ? rightFunction() : leftFunction()}>
            </TouchableOpacity>

            <View style={[styles.cursor, { width : thisWidth / 2, height : thisHeight }, active && { right : 4}, !active && {left : 4}]} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor : appStyle.strongGrey,
        padding : phoneDevice ? 3 : 4,
        flexDirection: "row",
        alignItems : "center",
    },
    buttonContainer: {
        width: "50%",
        height: "100%",
        zIndex: 2,
    },
    cursor: {
        backgroundColor: appStyle.brightGrey,
        position: "absolute",
        zIndex: 1,
        borderRadius: "50%"
    }
})