import { ScrollView, RefreshControl, Text, View } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import { DateTime } from 'luxon';

import useSessionExpired from '@hooks/useSessionExpired';

import WeekDatePicker from '@components/pages/days-schedule/week-date-picker/WeekDatePicker';
import EmployeeSelection from '@components/pages/days-schedule/schedule/EmployeeSelection';
import ScheduleContainer from '@components/pages/days-schedule/schedule/ScheduleContainer';


export default function DaysSchedule() {

    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const email = useSelector((state) => state.user.value.email)

    const [warning, setWarning] = useState({})
    const [scheduleInformations, setScheduleInformations] = useState({})
    const [selectedDate, setSelectedDate] = useState(DateTime.now({ zone: "Europe/Paris" }).startOf('day'))
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const { employees, appointmentTypes, users, events, closures, absences, appointmentGapMs } = scheduleInformations

    const scheduleContext = useMemo(()=>{
        return { appointmentTypes, users, events, closures, absences, appointmentGapMs, selectedEmployee, selectedDate }
    },[scheduleInformations, selectedEmployee, selectedDate])

    // LOAD SCHEDULE INFORMATIONS FUNCTION AND USEEFFECT
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const getScheduleInformations = async (clearEtag) => {
        const data = await request({ path: "pros/schedule-informations", jwtToken, setSessionExpired, clearEtag, setWarning })

        if (data?.result) {
            setScheduleInformations(data.informations)
            !selectedEmployee && setSelectedEmployee(data.informations.employees.filter(e => e.email === email))
        }
    }

    useEffect(() => {
        getScheduleInformations(true)
    }, [])



    // Refresh component for the scrollview
    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={[appStyle.strongBlack]} progressBackgroundColor={appStyle.pageBody.backgroundColor} tintColor={appStyle.strongBlack} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 800)
        getScheduleInformations()
    }} />

    return (
        <ScrollView bounces={false} overScrollMode="never" style={{ flex: 1 }}
            contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems: "center", paddingVertical: appStyle.mediumMarginTop }}
            refreshControl={refreshComponent}
            stickyHeaderIndices={[2]}
        >

            <Text style={appStyle.pageTitle}>
                Agenda
            </Text>

            <Text style={[{ marginBottom: appStyle.mediumMarginTop }, appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                {warning?.text}
            </Text>

            <View style={{width : "100%"}}>
                <WeekDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} email={email} />
            </View>

            <ScheduleContainer scheduleContext={scheduleContext} />


        </ScrollView>
    )
}