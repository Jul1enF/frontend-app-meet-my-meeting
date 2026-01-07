import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, memo, useMemo } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from '@components/ui/Autocomplete';
import DayColumn from './DayColumn';
import { DateTime } from 'luxon';
import useLayoutSpaces from '@hooks/useLayoutSpaces';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default memo(function Agenda({ agendaContext }) {

    const { employeesAutocompleteList, selectedEmployees, setSelectedEmployees, maxFuturDays } = agendaContext

    const [startColumnIndex, setStartColumnIndex] = useState(0)

    const firstDate = useMemo(() => {
        return startColumnIndex === 0 ?
            DateTime.now().setZone("Europe/Paris") :
            DateTime.now().setZone("Europe/Paris").plus({ days: startColumnIndex }).startOf('day')
    }, [startColumnIndex])

    // Calcul of the number of columns to display 
    const { screenWidth } = useLayoutSpaces()
    const columnWidth = phoneDevice ? RPW(29) : 200

    const columnNumber = Math.floor((screenWidth * 0.92) / columnWidth)

    const dayColumns = useMemo(() => {
        const columns = []

        for (let i = 0; i < columnNumber; i++) {
            startColumnIndex + i < maxFuturDays && columns.push(
                <DayColumn
                    dtDay={i === 0 ? firstDate : firstDate.plus({ days: i }).startOf('day')}
                    agendaContext={agendaContext}
                    width={columnWidth}
                    key={i}
                />
            )
        }

        return columns

    }, [columnNumber, maxFuturDays, firstDate, agendaContext, columnWidth])

    const maxDaysReached = startColumnIndex + columnNumber >= maxFuturDays

    // Function for the autocomplete to update the selectedEmployees
    const updateSelectedEmployees = (item) => {
        item?.employee && setSelectedEmployees([item.employee])
        item?.employees && setSelectedEmployees(item.employees)

        if (item === null) selectedEmployees.length === 1 && setSelectedEmployees(employeesAutocompleteList[0].employees)
    }

    // Function to increment or decrement the startColumnIndex
    const changeStartColumnIndex = (increment) => {
        if (increment && !maxDaysReached) setStartColumnIndex(prev => prev + columnNumber)
        else if (!increment && startColumnIndex !== 0) setStartColumnIndex(prev => prev - columnNumber)
    }


    return (
        <>
            {employeesAutocompleteList.length > 1 && <Autocomplete data={employeesAutocompleteList} setSelectedItem={updateSelectedEmployees} placeholderText="Choisir votre spécialiste" emptyText="Aucun résultat" inputStyle={{ fontWeight: "600", color: appStyle.strongBlack, fontSize: appStyle.largeText.fontSize }} inputContainerStyle={{ borderColor: appStyle.strongBlack }} placeholderColor={appStyle.mediumGrey} iconColor={appStyle.strongBlack} />}

            <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }} >

                <TouchableOpacity activeOpacity={0.6} style={styles.leftChevronContainer} onPress={() => {changeStartColumnIndex()}}>

                    <FontAwesome5 name="chevron-left" style={[styles.chevron, styles.chevronLeft]} color={startColumnIndex === 0 ? appStyle.lightGrey2 : appStyle.strongBlack} size={appStyle.inputIconSize} />

                </TouchableOpacity>


                {dayColumns}

                <TouchableOpacity activeOpacity={0.6} style={styles.rightChevronContainer} onPress={() => changeStartColumnIndex(true)}>

                    <FontAwesome5 name="chevron-right" style={[styles.chevron, styles.chevronRight]} color={maxDaysReached ? appStyle.mediumGrey : appStyle.strongBlack} size={appStyle.inputIconSize} />

                </TouchableOpacity>

            </View>

        </>
    )
})

const styles = StyleSheet.create({
    leftChevronContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: phoneDevice ? RPW(4) : 25,
        left: phoneDevice ? RPW(0) : 5,
        width: phoneDevice ? RPW(12) : 85,
        aspectRatio: 1,
        paddingRight: phoneDevice ? RPW(0.5) : 5,
        zIndex: 10,
    },
    rightChevronContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: phoneDevice ? RPW(5) : 20,
        right: phoneDevice ? RPW(0.5) : 5,
        width: phoneDevice ? RPW(12) : 85,
        aspectRatio: 1,
        paddingLeft: phoneDevice ? RPW(0.5) : 5
    },
})