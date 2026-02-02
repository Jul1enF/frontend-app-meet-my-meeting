import { View, StyleSheet } from "react-native";
import { useState } from "react";

import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'

import Calendar from "./Calendar";

import Modal from "react-native-modal"
import Button from "../Button";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function DatePicker({ chosenDate, setChosenDate, startInputText = "" , endInputText = "", buttonStyle = {}, buttonFontStyle = {}, maxDate = null }) {
    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()
    const {top} = useSafeAreaInsets()

    const [calendarVisible, setCalendarVisible] = useState(false)
    const updateCalendarVisible = () => setCalendarVisible(!calendarVisible)

    return (
        <>

            <View style={{ justifyContent: "center", alignItems : "center", width : buttonStyle.width ?? "auto"}} >

                <FontAwesome6 name="calendar-days" size={phoneDevice ? RPW(5) : 30} color={appStyle.fontColorDarkBg} style={styles.calendarIcon} onPress={updateCalendarVisible} />

                <Button func={updateCalendarVisible} 
                text={startInputText + chosenDate.toFormat("dd / MM / yyyy") + endInputText }
                style={buttonStyle} fontStyle={buttonFontStyle}
                />

            </View>


            <Modal
                isVisible={calendarVisible}
                style={[styles.modal, { paddingTop: phoneDevice ? RPW(36) + top : 0 }]}
                statusBarTranslucent={true}
                backdropColor="black"
                backdropOpacity={0.8}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                hideModalContentWhileAnimating={true}
                deviceWidth={screenWidth}
                deviceHeight={screenHeight}
                onBackButtonPress={() => setCalendarVisible(false)}
                onBackdropPress={() => setCalendarVisible(false)}
                useNativeDriverForBackdrop={false}
            >
                <Calendar chosenDate={chosenDate} setChosenDate={setChosenDate} setCalendarVisible={setCalendarVisible} maxDate={maxDate} />
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    datePickerBtn: {
        ...appStyle.button,
        backgroundColor: appStyle.strongRed,
        ...appStyle.regularItem,
    },
    calendarIcon: {
        position: "absolute",
        zIndex: 10,
        right: phoneDevice ? RPW(2.5) : 23,
        marginTop: appStyle.regularMarginTop * 0.85,
    },
    modal: {
        alignItems: "center",
        justifyContent: phoneDevice ? "flex-start" : "center",
        flex: 1,
    }
})