import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal"
import { useSafeAreaFrame } from "react-native-safe-area-context";

import moment from 'moment/min/moment-with-locales'

import { RPH, RPW, phoneDevice } from "modules/dimensions"
import { appStyle } from "styles/appStyle";

export default function TimePicker({date, changeDate}) {
    moment.locale('fr')

    const [showPicker, setShowPicker] = useState(false)

    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()

    const pickerRef = useRef(null)

    const closePicker = () => {
        setShowPicker(false)
        const {hours, minutes} = pickerRef.current.latestDuration
        let newDate = new Date(date)
        newDate.setMinutes(minutes.current)
        newDate.setHours(hours.current)

        updateSelectedDate(newDate)
    }

    return (
        <View>
            <TouchableOpacity style={styles.dateTimeContainer} activeOpacity={0.6} onPress={() => setShowPicker(true)}>
                <Text style={styles.dateTimeText} >{moment(date).format("HH : mm")}</Text>
            </TouchableOpacity>

            <Modal
                isVisible={showPicker}
                style={styles.modal}
                statusBarTranslucent={true}
                backdropColor="black"
                backdropOpacity={0.9}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                deviceWidth={screenWidth}
                deviceHeight={screenHeight}
                onBackButtonPress={() => closePicker()}
                onBackdropPress={() => closePicker()}
            >
                <View style={styles.pickerContainer} onLayout={() => setTimeout(() => {
                    pickerRef.current.setValue({ hours: Number(moment(date).format("HH")), minutes: Number(moment(date).format("mm")), seconds: 0 }, { animated: false })
                }, 10)}>
                    <TimerPicker
                        ref={pickerRef}
                        aggressivelyGetLatestDuration={true}
                        hideSeconds={true}
                        hourLimit={{ max: 23, min: 0 }}
                        hourLabel={"H"}
                        minuteLabel={""}
                        padHoursWithZero={true}
                        padMinutesWithZero={true}
                        LinearGradient={LinearGradient}

                        pickerContainerProps={{
                            width: phoneDevice ? RPW(60) : 400,
                            height: phoneDevice ? RPW(50) : 300,
                            justifyContent: "space-around",
                            alignItems: "center",
                            borderRadius: appStyle.regularItemBorderRadius,
                            marginLeft: phoneDevice ? RPW(4) : 30,
                            margin: 0,
                            marginRight: 0,
                        }}
                        styles={{
                            backgroundColor: appStyle.darkGrey,
                            text: {
                                fontSize: phoneDevice ? RPW(5.5) : 35,
                                letterSpacing: phoneDevice ? 1 : 1.5,
                                fontFamily: 'Inter-600',
                                color: appStyle.brightGrey,
                            },
                            pickerLabelContainer: {
                                right: phoneDevice ? -RPW(6) : -65,
                            },
                            pickerItemContainer: {
                                height: phoneDevice ? RPW(10) : 75,
                            },
                        }}
                    />

                    <TouchableOpacity style={styles.selectionButton} onPress={()=>closePicker()} activeOpacity={0.6} >
                        <Text style={styles.selectionButtonText}>
                            Sélectionner
                        </Text>
                    </TouchableOpacity>
                </View>

            </Modal>


        </View>
    )

}
const styles = StyleSheet.create({
    dateTimeContainer: {
        height: appStyle.largeItemHeight,
        width: appStyle.largeItemWidth * 0.47,
        borderRadius: appStyle.regularItemBorderRadius,
        backgroundColor: appStyle.darkGrey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: appStyle.largeItem.marginTop,
    },
    dateTimeText: {
        ...appStyle.regularText,
        textAlign: "center",
        width: "100%",
    },
    modal: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    pickerContainer: {
        ...appStyle.card,
        alignItems: "center",
        paddingTop: phoneDevice ? RPW(8) : 80,
        paddingBottom: phoneDevice ? RPW(8) : 80,
    },
    selectionButton: {
        ...appStyle.regularItem,
        ...appStyle.button,
        ...appStyle.lightGreyBorder,
        flexDirection: "row",
        marginTop: phoneDevice ? RPW(8) : 80,
        width: phoneDevice ? RPW(60) : 400,
        height : phoneDevice ? RPW(12) : 70
    },
    selectionButtonText: {
        fontSize: phoneDevice ? RPW(4.8) : 28,
        letterSpacing: phoneDevice ? 1 : 1.5,
        fontFamily: 'Inter-600',
        color: appStyle.brightGrey,
    }
})