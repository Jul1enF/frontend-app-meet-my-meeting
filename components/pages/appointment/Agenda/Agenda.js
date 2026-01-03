import { Text, View, StyleSheet } from 'react-native';
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
            {employeesAutocompleteList.length > 1 && <Autocomplete data={employeesAutocompleteList} setSelectedItem={updateSelectedEmployees} placeholderText="Choisir votre spécialiste" emptyText="Aucun résultat" inputStyle={{ fontWeight: "600", paddingLeft: 0, color: appStyle.strongBlack, fontSize: appStyle.largeText.fontSize }} inputContainerStyle={{ borderColor: appStyle.strongBlack }} placeholderColor={appStyle.mediumGrey} iconColor={appStyle.strongBlack} />}

            <View style={{ width: "100%", flexDirection: "row", justifyContent: "center"}} >

                <FontAwesome5 name="chevron-left" style={[styles.chevron, styles.chevronLeft]} color={startColumnIndex === 0 ? appStyle.lightGrey2 : appStyle.strongBlack} onPress={() => changeStartColumnIndex()} />

                {dayColumns}

                <FontAwesome5 name="chevron-right" style={[styles.chevron, styles.chevronRight]} color={maxDaysReached ? appStyle.mediumGrey : appStyle.strongBlack} onPress={() => changeStartColumnIndex(true)} />

            </View>

        </>
    )
})

const styles = StyleSheet.create({
    chevron: {
        fontSize: appStyle.inputIconSize,
        position: "absolute",
        top: phoneDevice ? RPW(7.5) : 55,
    },
    chevronLeft: {
        left: phoneDevice ? RPW(3) : 22,
    },
    chevronRight: {
        right: phoneDevice ? RPW(3) : 22,
    }
})