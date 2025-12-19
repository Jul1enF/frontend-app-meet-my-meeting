import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal"
import { useSafeAreaFrame } from "react-native-safe-area-context";

import moment from 'moment/min/moment-with-locales'

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle";

export default function TimePicker({time, changeTime}) {

    const hours = time.slice(0,2)
    const minutes = time.slice(3)

    const [showPicker, setShowPicker] = useState(false)

    const { height: screenHeight, width: screenWidth } = useSafeAreaFrame()

    const pickerRef = useRef(null)

    const closePicker = () => {
        setShowPicker(false)
        const {hours, minutes} = pickerRef.current.latestDuration
        const hoursFormatted = hours.current > 9 ? hours.current : "0" + hours.current.toString()
        const minutesFormatted = minutes.current > 9 ? minutes.current : "0" + minutes.current.toString()
        changeTime(`${hoursFormatted}:${minutesFormatted}`)
    }

    return (
        <View>
            <TouchableOpacity style={styles.timeContainer} activeOpacity={0.6} onPress={() => setShowPicker(true)}>
                <Text style={styles.timeText} >{time}</Text>
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
                useNativeDriverForBackdrop={true}
            >
                <View style={styles.pickerContainer} onLayout={() => setTimeout(() => {
                    pickerRef.current.setValue({ hours, minutes}, { animated: false })
                }, 10)}>
                    <TimerPicker
                        ref={pickerRef}
                        aggressivelyGetLatestDuration={true}
                        hideSeconds={true}
                        hourLimit={{ max: 23, min: 0 }}
                        hourLabel={"  :"}
                        minuteLabel={""}
                        padHoursWithZero={true}
                        padMinutesWithZero={true}
                        LinearGradient={LinearGradient}

                        // Style for the container of all the numbers
                        pickerContainerProps={{
                            height: phoneDevice ? RPW(45) : 225,
                            // borderColor : "red",
                            // borderWidth : 5,
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
                                fontWeight : "500",
                                color: appStyle.brightGrey,
                            },
                            pickerLabelContainer: {
                                // display : "none"
                            },

                            // Settings to have the separator right in the middle :
                            pickerLabel : {
                                fontWeight : "800",
                                letterSpacing : phoneDevice ? RPW(1.2) : 12,
                                fontSize : phoneDevice ? RPW(7) : 45,
                                paddingTop : phoneDevice ? RPW(0.8) : 7,
                            },
                            // Style for container of the numbers column
                            pickerItemContainer: {
                                height: phoneDevice ? RPW(12) : 75,
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
     timeContainer: {
        marginLeft: phoneDevice ? RPW(2) : 15,
        backgroundColor: appStyle.strongGrey,
        padding: phoneDevice ? RPW(2) : 15,
        borderRadius: appStyle.regularItemBorderRadius,
    },
    timeText: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
    },
    modal: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    pickerContainer: {
        ...appStyle.card,
        width : phoneDevice ? RPW(72) : 460,
        alignItems: "center",
        paddingTop : phoneDevice ? RPW(3) : 40
    },
    selectionButton: {
        borderRadius : appStyle.regularItemBorderRadius,
        ...appStyle.button,
        ...appStyle.lightGreyBorder,
        flexDirection: "row",
        marginTop: phoneDevice ? RPW(3) : 55,
        width: phoneDevice ? RPW(50) : 330,
        height : phoneDevice ? RPW(11) : 70
    },
    selectionButtonText: {
        letterSpacing: phoneDevice ? 1 : 1.5,
        ...appStyle.regularText,
        color : appStyle.fontColorDarkBg,
        fontWeight : "500"
    }
})