import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, memo, useMemo } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Autocomplete from '@components/ui/autocomplete/Autocomplete';
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


    // Function to increment or decrement the startColumnIndex
    const changeStartColumnIndex = (increment) => {
        if (increment && !maxDaysReached) setStartColumnIndex(prev => prev + columnNumber)
        else if (!increment && startColumnIndex !== 0) setStartColumnIndex(prev => prev - columnNumber)
    }


    return (
        <>
            <Text style={{ ...appStyle.labelText, marginTop: appStyle.regularMarginTop }}>Votre spécialiste :</Text>

            {employeesAutocompleteList.length > 1 &&
                <Autocomplete
                    data={employeesAutocompleteList}
                    setSelectedItem={setSelectedEmployees}
                    selectedItem={selectedEmployees}
                    sectionToSelectKey={"employee"}
                    placeholderText="Choisir votre spécialiste"
                    emptyText="Aucun résultat"
                    editable={false}
                    showClear={false}
                    inputContainerStyle={{ borderColor: appStyle.strongBlack, height: "auto" }}
                    placeholderColor={appStyle.mediumGrey}
                    iconColor={appStyle.strongBlack}
                    inputStyle={{ ...appStyle.input.baseLarge, ...appStyle.largeText, textAlign: "left", marginTop : appStyle.regularMarginTop * 0.9 }}
                />
            }

            <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }} >

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.leftChevronContainer}
                    onPress={() => { changeStartColumnIndex() }}
                    hitSlop={phoneDevice ? RPW(8) : 50}
                >

                    <FontAwesome5 name="chevron-left" style={[styles.chevron, styles.chevronLeft]} color={startColumnIndex === 0 ? appStyle.lightGrey2 : appStyle.strongBlack} size={appStyle.inputIconSize} />

                </TouchableOpacity>


                {dayColumns}

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.rightChevronContainer}
                    onPress={() => changeStartColumnIndex(true)}
                    hitSlop={phoneDevice ? RPW(8) : 50}
                >

                    <FontAwesome5 name="chevron-right" style={[styles.chevron, styles.chevronRight]} color={maxDaysReached ? appStyle.mediumGrey : appStyle.strongBlack} size={appStyle.inputIconSize} />

                </TouchableOpacity>

            </View>

        </>
    )
})

const styles = StyleSheet.create({
    leftChevronContainer: {
        position: "absolute",
        top: phoneDevice ? RPW(7.5) : 45,
        left: phoneDevice ? RPW(2.5) : 20,
        paddingRight: phoneDevice ? RPW(0.5) : 5,
        zIndex: 10,
    },
    rightChevronContainer: {
        position: "absolute",
        top: phoneDevice ? RPW(7.5) : 45,
        right: phoneDevice ? RPW(2.5) : 20,
        paddingLeft: phoneDevice ? RPW(0.5) : 5
    },
})