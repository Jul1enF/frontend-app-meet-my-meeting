import { View, Text, StyleSheet } from "react-native";
import useLayoutSpaces from "@hooks/useLayoutSpaces";
import Modal from "react-native-modal"
import Button from "@components/ui/Button";

import { RPH, RPW, phoneDevice } from '@utils/dimensions.js'
import { appStyle } from '@styles/appStyle.js';

export default function ConfirmationModal({ visible, closeModal, confirmationText, confirmationBtnText, confirmationFunc, warning, cancelBtnText }) {

    const { screenHeight, screenWidth } = useLayoutSpaces()

    return (
        <Modal
            isVisible={visible}
            backdropColor="black"
            backdropOpacity={0.8}
            deviceWidth={screenWidth}
            deviceHeight={screenHeight}
            statusBarTranslucent={true}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            supportedOrientations={['portrait', 'landscape']}
            onBackButtonPress={() => closeModal()}
            onBackdropPress={() => closeModal()}
            style={{ alignItems: "center", justifyContent: "center", margin: 0 }}
            useNativeDriverForBackdrop={false}
        >
            <View style={styles.modalBody}>
                <Text style={styles.confirmationText}>
                    {confirmationText}
                </Text>
                <View style={styles.line} />

                <Button func={closeModal} text={cancelBtnText} marginTop={0} />
                <Button func={confirmationFunc} text={confirmationBtnText} />

                <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop : 0 }]}>
                    {warning?.text}
                </Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBody: {
        ...appStyle.card,
    },
    confirmationText: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
        textAlign: "center",
    },
    line: {
        width: "40%",
        ...appStyle.horizontalLine,
        marginVertical: phoneDevice ? RPW(7) : 50,
    },
})