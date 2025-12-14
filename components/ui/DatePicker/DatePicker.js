import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState } from "react";

import { appStyle } from "@styles/appStyle";
import { RPH, RPW, phoneDevice } from '@utils/dimensions'

import Calendar from "./Calendar";

import Modal from "react-native-modal"
import { useSafeAreaFrame } from "react-native-safe-area-context";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import moment from 'moment/min/moment-with-locales'
moment.locale('fr')

export default function DatePicker() {
    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [chosenDate, setChosenDate] = useState(new Date())

    return (
        <View>
            <TouchableOpacity style={styles.datePickerBtn} activeOpacity={0.6} onPress={() => setCalendarVisible(!calendarVisible)}>
                <Text style={[appStyle.regularText, {fontWeight : "700"}]} >{moment(chosenDate).format("DD / MM / YYYY")}</Text>
                <FontAwesome6 name="calendar-days" size={phoneDevice ? RPW(4.4) : 28} color={appStyle.strongBlack} style={styles.calendarIcon} />
            </TouchableOpacity>


            <Modal
                isVisible={calendarVisible}
                style={styles.modal}
                statusBarTranslucent={true}
                backdropColor="black"
                backdropOpacity={0.9}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                deviceWidth={screenWidth}
                deviceHeight={screenHeight}
                onBackButtonPress={() => setCalendarVisible(!calendarVisible)}
                onBackdropPress={() => setCalendarVisible(!calendarVisible)}
            >
                <Calendar chosenDate={chosenDate} setChosenDate={setChosenDate} />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    datePickerBtn : {
        ...appStyle.button,
        backgroundColor : appStyle.strongRed,
        ...appStyle.regularItem,
    },
    calendarIcon : {
        position : "absolute",
        right : phoneDevice ? RPW(3) : 23,
        paddingBottom : phoneDevice ? RPW(0.3) : 2,
    },
    modal: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    }
})