import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, memo, useMemo, useEffect } from 'react';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DayItem from './DayItem';

import { getWeekDetails } from './weekDatePickerUtils';


export default memo(function WeekDatePicker({ selectedDate, setSelectedDate, firstWeekDay, setFirstWeekDay }) {

    // const [firstWeekDay, setFirstWeekDay] = useState(null)

    useEffect(() => {
        const daysBeforeMonday = selectedDate.weekday - 1
        const initialFirstWeekDay = selectedDate.minus({ days: daysBeforeMonday })
        setFirstWeekDay(initialFirstWeekDay)
    }, [])

    const updateFirstWeekDay = (increment) => {
        increment ? setFirstWeekDay(prev => prev.plus({ days: 7 })) :
            setFirstWeekDay(prev => prev.minus({ days: 7 }))
    }

    const { daysArray, monthName } = useMemo(() => {
        return getWeekDetails(selectedDate, firstWeekDay)
    }, [selectedDate, firstWeekDay])



    return (
        <View style={styles.mainContainer}>

            <View style={styles.monthHeader}>
                <TouchableOpacity activeOpacity={0.6} style={styles.leftChevronContainer} onPress={() => updateFirstWeekDay(false)}>
                    <FontAwesome5 name="chevron-left" color={appStyle.brightGrey} size={phoneDevice ? RPW(4.2) : 25} />
                </TouchableOpacity>


                <Text style={styles.monthText}>
                    {monthName}
                </Text>

                <TouchableOpacity activeOpacity={0.6} style={styles.rightChevronContainer} onPress={() => updateFirstWeekDay(true)}>
                    <FontAwesome5 name="chevron-right" color={appStyle.brightGrey} size={phoneDevice ? RPW(4.2) : 25} />
                </TouchableOpacity>
            </View>


            <View style={styles.daysNameContainer} >
                {daysArray && daysArray.map((e, i) => <Text style={styles.dayName} key={i}>{e.dayName}</Text>)}
            </View>


            <View style={styles.daysContainer}>

                {
                   daysArray && daysArray.map(e =>
                        <DayItem key={e.date.toISODate()} {...e} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    )
                }

            </View>


        </View>
    )

})

const styles = StyleSheet.create({
    mainContainer: {
        ...appStyle.card,
        marginTop: 0,
        width: "100%",
        borderRadius: 0,
        paddingTop: phoneDevice ? RPW(1) : 10,
        paddingBottom: phoneDevice ? RPW(3) : 12,
        zIndex : 999,
    },
    monthHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: phoneDevice ? RPW(10) : 60,
    },
      leftChevronContainer: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: phoneDevice ? RPW(10) : 60,
        aspectRatio: 1,
    },
    rightChevronContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        width: phoneDevice ? RPW(10) : 60,
        aspectRatio: 1,
    },
    monthText: {
        ...appStyle.pageSubtitle,
        color: appStyle.fontColorDarkBg,
        fontWeight: "700",
    },
    daysNameContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        columnGap: "2.66%",
        height: phoneDevice ? RPW(8) : 50,
        marginTop: phoneDevice ? RPW(0.2) : 0,
    },
    dayName: {
        ...appStyle.regularText,
        color: appStyle.fontColorDarkBg,
        width: "12%",
        textAlign: "center",
    },
    daysContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        columnGap: "2.66%",
        marginTop: phoneDevice ? RPW(0.4) : 0,
    }
})