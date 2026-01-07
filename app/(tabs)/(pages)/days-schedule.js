import { ScrollView, RefreshControl, Text, View, StyleSheet } from 'react-native';
import { useEffect, useState, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import { DateTime } from 'luxon';

import useSessionExpired from '@hooks/useSessionExpired';

import WeekDatePicker from '@components/pages/days-schedule/week-date-picker/WeekDatePicker';
import EmployeeSelection from '@components/pages/days-schedule/schedule/EmployeeSelection';
import Schedule from '@components/pages/days-schedule/schedule/Schedule';
import ModalPageWrapper from '@components/layout/ModalPageWrapper';
import EventRedaction from '@components/pages/days-schedule/event-registration/EventRedaction';


export default function DaysSchedule() {

    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const email = useSelector((state) => state.user.value.email)

    const [warning, setWarning] = useState({})
    const [scheduleInformations, setScheduleInformations] = useState({})
    const [selectedDate, setSelectedDate] = useState(DateTime.now({ zone: "Europe/Paris" }).startOf('day'))
    const [selectedEmployee, setSelectedEmployee] = useState(null)


    // States for the modal/appointment redaction page
    const [appointmentsSlots, setAppointmentsSlots] = useState(null)
    const [appointmentStart, setAppointmentStart] = useState(null)
    const [isNewAppointment, setIsNewAppointment] = useState(false)
    const [selectedAppointmentType, setSelectedAppointmentType] = useState(null)


    // Memoisation of the schedule informations
    const { employees, appointmentTypes, users, events, closures, absences, appointmentGapMs, defaultSchedule } = scheduleInformations

    const scheduleContext = useMemo(() => {
        return { events, closures, absences, appointmentGapMs, defaultSchedule, selectedEmployee, selectedDate, selectedAppointmentType, setAppointmentStart, setAppointmentsSlots, setIsNewAppointment }
    }, [scheduleInformations, selectedEmployee, selectedDate, selectedAppointmentType])




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


    // Custom sticky header settings
    const [stickyComponent, setStickyComponent] = useState(false)
    const [pageTitleHeight, setPageTitleHeight] = useState(0)


    return (
        <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>

            {/* Modal to set or modify an appointment */}
            <ModalPageWrapper visible={appointmentStart} setVisible={setAppointmentStart} backHeaderText="Agenda">
                <EventRedaction 
                setScheduleInformations={setScheduleInformations} selectedEmployee={selectedEmployee} appointmentsSlots={appointmentsSlots} appointmentStart={appointmentStart} setAppointmentStart={setAppointmentStart} isNewAppointment={isNewAppointment} appointmentTypes={appointmentTypes} users={users} selectedAppointmentType={selectedAppointmentType} setSelectedAppointmentType={setSelectedAppointmentType} />
            </ModalPageWrapper>



            {/* Sticky Header after the pageTitle bottom is reached */}
            <View style={{
                width: "100%",
                position: "absolute",
                top: 0,
                zIndex: 1,
                opacity: stickyComponent ? 1 : 0,
                pointerEvents: stickyComponent ? "auto" : "none",
                backgroundColor: appStyle.pageBody.backgroundColor,
            }}>

                <WeekDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} email={email} />
            </View>



            <ScrollView overScrollMode="never" style={{ flex: 1 }}
                contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems: "center", paddingBottom: appStyle.mediumMarginTop }}
                refreshControl={refreshComponent}
                onScroll={(e) => {
                    if (pageTitleHeight === 0) return
                    const y = e.nativeEvent.contentOffset.y
                    setStickyComponent(prev => {
                        const shouldStick = y > pageTitleHeight
                        return prev !== shouldStick ? shouldStick : prev
                    })
                }}
            >


                <View style={styles.pageTitleContainer}
                    onLayout={e => {
                        if (pageTitleHeight === 0) {
                            setPageTitleHeight(e.nativeEvent.layout.height)
                        }
                    }}
                >
                    <Text style={appStyle.pageTitle}>
                        Agenda
                    </Text>

                    <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                        {warning?.text}
                    </Text>

                </View>



                {/* Sticky Header before it reached the top */}
                <View style={{
                    width: "100%",
                    opacity: stickyComponent ? 0 : 1,
                    pointerEvents: stickyComponent ? "none" : "auto",
                }}>

                    <WeekDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                    <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} email={email} />
                </View>


                <Schedule scheduleContext={scheduleContext} />


            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    pageTitleContainer: {
        paddingVertical: appStyle.mediumMarginTop,
        alignItems: "center",
        justifyContent: "center",
    }
})