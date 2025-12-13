import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Modal from "react-native-modal"
import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { redirectToStores } from "@utils/redirectToStores"


export default function ForcedUpdateModal({ appObsolete, screenWidth, screenHeight, freeHeight, modalOffsetTop }) {

    return (
        <Modal
            isVisible={appObsolete}
            style={styles.modal}
            deviceWidth={screenWidth}
            deviceHeight={screenHeight}
            statusBarTranslucent={true}
            backdropColor="transparent"
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
        >
            <View style={[styles.mainContainer, {
                height: freeHeight,
                top: modalOffsetTop + 0.5
            }]}>
                <Text style={{ ...appStyle.pageSubtitle, textAlign: "center" }}>
                    Version de l'application obsolète
                </Text>
                <Text style={{ ...appStyle.regularText, marginTop: phoneDevice ? RPW(5) : 20, textAlign: "center", lineHeight: phoneDevice ? RPW(6) : 40 }}>
                    Mettez à jour votre application pour continuer à utiliser Sport Amat !
                </Text>
                <TouchableOpacity style={{ width: "auto", alignSelf: "center", borderBottomWidth: 2, borderBottomColor: appStyle.strongBlack }} onPress={() => redirectToStores()}>
                    <Text style={[styles.obsoleteText, { fontWeight: "600" }]}>
                        Mettre à jour
                    </Text>
                </TouchableOpacity>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
    },
    mainContainer: {
        width: "100%",
        backgroundColor: appStyle.darkWhite,
        paddingTop: appStyle.pagePaddingTop,
        paddingHorizontal : 15,
    },
    obsoleteText: {
        ...appStyle.regularText,
        marginTop: phoneDevice ? RPW(5) : 20,
        textAlign: "center",
        lineHeight: phoneDevice ? RPW(6) : 40,
        width: "auto"
    }
})