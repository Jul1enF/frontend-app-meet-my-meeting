import { View, StyleSheet, Text } from "react-native";
import { memo } from "react";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { upperCaseInitial } from "@utils/timeFunctions";
import Switch from "./Switch";
import TimePicker from "./TimePicker";
import {toggleEnabled, changeStart, changeEnd, toggleBreak, changeBreakStart, changeBreakEnd} from "./scheduleUtils";

import moment from 'moment/min/moment-with-locales'

export default memo(function DaySchedule({ day, index, scheduleActions}) {
    const {toggleEnabled, changeStart, changeEnd, toggleBreak, changeBreakStart, changeBreakEnd} = scheduleActions
    
    const dayName = upperCaseInitial(moment().weekday(index).format("dddd"))
    const activeDay = day.enabled
    const activeBreak = day.break.enabled


    const mediumMarginTop = phoneDevice ? RPW(5.5) : 35
    const largeMarginTop = phoneDevice ? RPW(8) : 50

    return (
        <View style={styles.mainContainer}>

            <Switch active={activeDay} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularItem.paddingHorizontal * 1.5, top: mediumMarginTop }} leftFunction={()=> toggleEnabled(day, index )} />

            <View style={[styles.underline, { marginTop: mediumMarginTop}]}>
                <Text style={[appStyle.largeText, { color: appStyle.fontColorDarkBg, fontWeight : "700"  }]}>
                    {dayName} :
                </Text>
            </View>

            <View style={[{ width: "100%", marginTop: largeMarginTop }, !activeDay && { display: "none" }]}>

                <View style={styles.fullRow}>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Début :
                        </Text>

                        <TimePicker time={day.start} changeTime={(time)=> changeStart(time, index)} />

                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Fin :
                        </Text>

                        <TimePicker time={day.end} changeTime={(time)=> changeEnd(time, index)} />

                    </View>

                </View>

                <View style={{ width: "100%", alignItems: "center", marginTop: largeMarginTop }}>
                    <Text style={[appStyle.largeText, { color: appStyle.fontColorDarkBg, fontWeight: "700" }]}>
                        Pause :
                    </Text>

                    <Switch active={activeBreak} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularItem.paddingHorizontal * 0.5, top: 0 }} leftFunction={()=>toggleBreak(day, index )} />
                </View>


                <View style={[styles.fullRow, {marginTop: largeMarginTop}, !activeBreak && {display : "none"}]}>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Début :
                        </Text>

                        <TimePicker time={day.break.start} changeTime={(time)=> changeBreakStart(time, index )} />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Fin :
                        </Text>

                        <TimePicker time={day.break.end} changeTime={(time)=> changeBreakEnd(time, index )} />
                    </View>

                </View>

            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    mainContainer: {
        ...appStyle.lightGreyBorder,
        borderRadius: appStyle.regularItemBorderRadius,
        minWidth: "100%",
        paddingHorizontal: appStyle.regularItem.paddingHorizontal,
        marginTop: appStyle.regularItem.marginTop * (phoneDevice ? 2 : 1.3),
        alignItems: "center",
        paddingBottom : appStyle.largeMarginTop,
    },
    underline: {
        borderBottomColor: appStyle.darkWhite,
        borderBottomWidth: phoneDevice ? 2 : 3,
    },
    fullRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: appStyle.regularItem.paddingHorizontal * 0.5,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        height: "100%",
    },
    label: {
        ...appStyle.largeText,
        color: appStyle.fontColorDarkBg,
        padding: phoneDevice ? RPW(2) : 15,
    },
    timeContainer: {
        marginLeft: phoneDevice ? RPW(2) : 15,
        backgroundColor: appStyle.strongGrey,
        padding: phoneDevice ? RPW(2) : 15,
        borderRadius: appStyle.regularItemBorderRadius,
    },
    timeText: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
    }
})