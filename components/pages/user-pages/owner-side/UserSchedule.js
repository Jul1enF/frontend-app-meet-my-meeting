import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"

import DayScheduleForm from "../../../user-schedule/DayScheduleForm";
import SmallSwitch from "../../../ui/SmallSwitch";
import DatePicker from "@components/ui/DatePicker/DatePicker";
import { DateTime } from "luxon";
import { upperCaseInitial } from "@utils/timeFunctions";

export default function UserSchedule({ scheduleArray, contractEnd, setContractEnd, setNewSchedule }) {

    const updateDay = (dayIndex, partialDay) => {
    setNewSchedule(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        ...partialDay,
      },
    }));
  }

    const workingHours = scheduleArray.map((e, i) => <DayScheduleForm key={i} onChange={(partialDay) => updateDay(i, partialDay)} day={e} dayTitle={upperCaseInitial(DateTime.utc().set({ weekday: i + 1 }).toFormat("cccc"))} />)

    const [changeContractEnd, setChangeContractEnd] = useState(contractEnd ? true : false)

    const datePickerDtDate = !contractEnd ? DateTime.now({zone : "Europe/Paris"}) : 
    DateTime.isDateTime(contractEnd) ? contractEnd : DateTime.fromISO(contractEnd, {zone : "Europe/Paris"})


    return (
        <View style={{ width: "100%", marginTop: appStyle.largeMarginTop }}>
            <Text style={[appStyle.pageSubtitle, { color: appStyle.fontColorDarkBg }]}>
                Horaires de travail :
            </Text>

            {workingHours}


            <View style={styles.contractContainer} >

                <SmallSwitch active={changeContractEnd} width={phoneDevice ? RPW(9) : 56} height={phoneDevice ? RPW(4.5) : 28} style={{ position: "absolute", right: appStyle.regularHorizontalPadding * 1.5, top: appStyle.mediumMarginTop}}
                    leftFunction={() => {
                        setChangeContractEnd(prev => !prev)
                        contractEnd && changeContractEnd && setContractEnd(null)
                    }} />

                <View style={[styles.underline, { marginTop : appStyle.mediumMarginTop }]}>
                    <Text style={[appStyle.largeText, { color: appStyle.fontColorDarkBg, fontWeight: "700" }]}>
                        Fin de contrat :
                    </Text>
                </View>

                {changeContractEnd &&
                    <View style={{marginTop : appStyle.mediumMarginTop}} >
                        <DatePicker
                            chosenDate={datePickerDtDate}
                            endInputText=" ( inclus ) "
                            setChosenDate={(itemDate) => {
                                const parisItemDate = itemDate.setZone("Europe/Paris", { keepLocalTime: true }).endOf('day');
                                setContractEnd(parisItemDate)
                            }}
                        />
                    </View>
                }

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    contractContainer: {
        ...appStyle.lightGreyBorder,
        borderRadius: appStyle.regularItemBorderRadius,
        minWidth: "100%",
        paddingHorizontal: appStyle.regularHorizontalPadding,
        marginTop: appStyle.regularMarginTop * (phoneDevice ? 2 : 1.3),
        paddingBottom: appStyle.largeMarginTop,
        alignItems: "center",
    },
    underline: {
        borderBottomColor: appStyle.darkWhite,
        borderBottomWidth: phoneDevice ? 2 : 3,
    },
})