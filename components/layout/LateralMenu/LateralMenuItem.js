import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { RPH, RPW, phoneDevice } from "utils/dimensions"
import { appStyle } from "styles/appStyle"
import { router } from "expo-router";



export default function LateralMenuItem({sectionName, link, func, setMenuVisible}) {

const sectionPress = () => {
    typeof func === "function" && func()
    link && router.navigate(link)
    setMenuVisible(false);
}
    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={sectionPress}>
            <Text style={styles.link}>{sectionName}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    linkContainer: {
        height: phoneDevice ? RPW(26) : 150,
        borderTopWidth: 0.5,
        borderTopColor: appStyle.strongBlack,
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        color: appStyle.strongBlack,
        fontSize: phoneDevice ? RPW(6.3) : 40,
        fontWeight: "300"
    },
})