import { View, StyleSheet, Text } from "react-native";
import { memo } from "react";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import useScheduleError from "./useScheduleError";
import SmallSwitch from "../ui/SmallSwitch";
import TimePicker from "./TimePicker";


export default memo(function DayScheduleForm({ onChange, day, showDayToggle = true, dayTitle = "" }) {

    const activeDay = day.enabled !== false
    const activeBreak = day.break.enabled

    const { dayError, breakError } = useScheduleError(day)

    return (
        <View style={styles.mainContainer}>

            {showDayToggle &&
                <>
                    <SmallSwitch active={activeDay} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularItem.paddingHorizontal * 1.5, top: appStyle.mediumMarginTop }} leftFunction={() => onChange({ enabled: !activeDay })} />

                    <View style={[styles.underline, { marginTop: appStyle.mediumMarginTop }]}>
                        <Text style={[appStyle.labelText, { color: appStyle.fontColorDarkBg }]}>
                            {dayTitle} :
                        </Text>
                    </View>
                </>
            }

            <View style={[{ width: "100%", marginTop: appStyle.largeMarginTop }, !activeDay && { display: "none" }]}>

                <View style={styles.fullRow}>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Début :
                        </Text>

                        <TimePicker time={day.start} changeTime={(time) => onChange({ start: time })} />

                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Fin :
                        </Text>

                        <TimePicker time={day.end} changeTime={(time) => onChange({ end: time })} />

                    </View>

                </View>

                <Text style={[appStyle.warning, !dayError && { height: 0, marginTop: 0 }]}>
                    {dayError}
                </Text>

                <View style={{ width: "100%", alignItems: "center", marginTop: appStyle.largeMarginTop }}>
                    <Text style={[appStyle.labelText, { color: appStyle.fontColorDarkBg, fontWeight: "700" }]}>
                        Pause :
                    </Text>

                    <SmallSwitch active={activeBreak} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularItem.paddingHorizontal * 0.5, top: 0 }} leftFunction={() => onChange({ break: {...day.break, enabled: !activeBreak } })} />
                </View>


                <View style={[styles.fullRow, { marginTop: appStyle.largeMarginTop }, !activeBreak && { display: "none" }]}>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Début :
                        </Text>

                        <TimePicker time={day.break.start} changeTime={(time) => onChange({ break: { ...day.break, start: time } })} />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>
                            Fin :
                        </Text>

                        <TimePicker time={day.break.end} changeTime={(time) => onChange({ break: { ...day.break, end: time } })} />
                    </View>

                </View>

                <Text style={[appStyle.warning, !breakError && { height: 0, marginTop: 0 }]}>
                    {breakError}
                </Text>

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
        paddingBottom: appStyle.largeMarginTop,
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
        ...appStyle.labelText,
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