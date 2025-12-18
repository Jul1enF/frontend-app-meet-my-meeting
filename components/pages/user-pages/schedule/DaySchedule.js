import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import { upperCaseInitial } from "@utils/timeFunctions";
import Switch from "./Switch";
import {toggleEnabled, changeStart, changeEnd, toggleBreak, changeBreakStart, changeBreakEnd} from "./scheduleUtils";

import moment from 'moment/min/moment-with-locales'

export default function DaySchedule({ day, index, setNewSchedule }) {

    moment.locale('fr')
    moment.weekdays(true)

    const dayName = upperCaseInitial(moment().weekday(index).format("dddd"))
    const activeDay = day.enabled
    const activeBreak = day.break.enabled


    const mediumMarginTop = phoneDevice ? RPW(5.5) : 35
    const largeMargintTop = phoneDevice ? RPW(6.5) : 42

    return (
        <View style={[styles.mainContainer, {paddingBottom : largeMargintTop}]}>

            <Switch active={activeDay} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularItem.paddingHorizontal * 1.5, top: mediumMarginTop }} leftFunction={()=> toggleEnabled(day, index, setNewSchedule )} />

            <View style={[styles.underline, { marginTop: mediumMarginTop}]}>
                <Text style={[appStyle.largeText, { color: appStyle.fontColorDarkBg, fontWeight : "700"  }]}>
                    {dayName} :
                </Text>
            </View>

            <View style={[{ width: "100%", marginTop: mediumMarginTop }, !activeDay && { display: "none" }]}>

                <View style={styles.fullRow}>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Début :
                        </Text>

                        <TouchableOpacity style={styles.timeContainer} activeOpacity={0.5} >
                            <Text style={styles.timeText} >
                                {day.start}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Fin :
                        </Text>

                        <TouchableOpacity style={styles.timeContainer} activeOpacity={0.5} >
                            <Text style={styles.timeText} >
                                {day.end}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={{ width: "100%", alignItems: "center", marginTop: largeMargintTop }}>
                    <Text style={[appStyle.largeText, { color: appStyle.fontColorDarkBg, fontWeight: "700" }]}>
                        Pause :
                    </Text>

                    <Switch active={activeBreak} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularItem.paddingHorizontal * 0.5, top: 0 }} leftFunction={()=>toggleBreak(day, index, setNewSchedule)} />
                </View>


                <View style={[styles.fullRow, {marginTop: mediumMarginTop}, !activeBreak && {display : "none"}]}>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Début :
                        </Text>

                        <TouchableOpacity style={styles.timeContainer} activeOpacity={0.5} >
                            <Text style={styles.timeText} >
                                {day.break.start}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Fin :
                        </Text>

                        <TouchableOpacity style={styles.timeContainer} activeOpacity={0.5} >
                            <Text style={styles.timeText} >
                                {day.break.end}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        ...appStyle.lightGreyBorder,
        borderRadius: appStyle.regularItemBorderRadius,
        minWidth: "100%",
        paddingHorizontal: appStyle.regularItem.paddingHorizontal,
        marginTop: appStyle.regularItem.marginTop,
        alignItems: "center",
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