import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { memo } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';



export default memo(function AppointmentSlot({ start, employees, setSelectedAppointmentSlot, sortFreeEmployees, rolesPriorities }) {


    const sortAvailableEmployees = (a, b) => {
        let roleDifference

        if (sortFreeEmployees.role) roleDifference = rolesPriorities[a.role] - rolesPriorities[b.role]
        if (roleDifference && roleDifference !== 0) return roleDifference

        let msOfWorkDifference

        if (sortFreeEmployees.msOfWork) msOfWorkDifference = b.msOfWork - a.msOfWork
        if (msOfWorkDifference && msOfWorkDifference !== 0) return msOfWorkDifference

        let eventCountDifference

        if (sortFreeEmployees.eventCount) eventCountDifference = b.eventCount - a.eventCount
        if (eventCountDifference && eventCountDifference !== 0) return eventCountDifference

        return new Date(a.createdAt) - new Date(b.createdAt)
    }

    const slotPressed = () => {
        const employeesToSort = [...employees]

        if (employeesToSort.length > 1 && sortFreeEmployees) {
            employeesToSort.sort((a, b) => sortAvailableEmployees(a, b))
        }

        setSelectedAppointmentSlot({ start, employee: employeesToSort[0] })
    }
    return (
        <TouchableOpacity style={styles.mainContainer} activeOpacity={0.6} onPress={slotPressed} >
            <Text style={styles.hourText}>
                {start.toFormat("HH:mm")}
            </Text>
        </TouchableOpacity>
    )

})

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: appStyle.brightGrey,
        padding: phoneDevice ? RPW(2) : 15,
        borderRadius: appStyle.regularItemBorderRadius,
        marginTop: phoneDevice ? RPW(2) : 15,
    },
    hourText: {
        ...appStyle.regularText,
        textAlign: "center",
    }
})