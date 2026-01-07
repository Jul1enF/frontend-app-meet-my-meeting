import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useEffect, useState, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import { DateTime } from 'luxon';

import useSessionExpired from '@hooks/useSessionExpired';
import useRefreshControl from '@hooks/useRefreshControl';
import useDaysScheduleContext from '@components/pages/days-schedule/useDaysScheduleContext';

import WeekDatePicker from '@components/pages/days-schedule/week-date-picker/WeekDatePicker';
import EmployeeSelection from '@components/pages/days-schedule/schedule/EmployeeSelection';
import Schedule from '@components/pages/days-schedule/schedule/Schedule';
import ModalPageWrapper from '@components/layout/ModalPageWrapper';
import EventRedaction from '@components/pages/days-schedule/event-registration/EventRedaction';


export default function DaysSchedule() {

    const [warning, setWarning] = useState({})
    const [scheduleInformations, setScheduleInformations] = useState({})

    // Memoised props for the components
    const { daysScheduleContext, scheduleContext, redactionContext } = useDaysScheduleContext(scheduleInformations, setScheduleInformations)

    // Memoised props for this component
    const { appointmentStart, setAppointmentStart, setOldEvent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, email, jwtToken } = daysScheduleContext



    // LOAD SCHEDULE INFORMATIONS FUNCTION AND USEEFFECT

    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const getScheduleInformations = async (clearEtag) => {
        const data = await request({ path: "pros/schedule-informations", jwtToken, setSessionExpired, clearEtag, setWarning })

        if (data?.result) {
            setScheduleInformations(data.informations)
            !selectedEmployee && setSelectedEmployee(data.informations.employees.find(e => e.email === email))
        }
    }

    useEffect(() => {
        getScheduleInformations(true)
    }, [])


    // refreshControl for the ScrollView
    const refreshControl = useRefreshControl(getScheduleInformations)

    // Custom sticky header settings
    const [stickyComponent, setStickyComponent] = useState(false)
    const [pageTitleHeight, setPageTitleHeight] = useState(0)


    return (
        <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>

            {/* Modal to set or modify an appointment */}
            <ModalPageWrapper visible={appointmentStart} setVisible={setAppointmentStart} closeFunction={()=>setOldEvent(null)} backHeaderText="Agenda">
                <EventRedaction redactionContext={redactionContext} />
            </ModalPageWrapper>


            {/* Sticky Header after the pageTitle bottom is reached */}
            <View style={{ width: "100%", position: "absolute", top: 0, zIndex: 1, opacity: stickyComponent ? 1 : 0, pointerEvents: stickyComponent ? "auto" : "none", backgroundColor: appStyle.pageBody.backgroundColor,
            }}>
                <WeekDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} email={email} />
            </View>


            <ScrollView overScrollMode="never" style={{ flex: 1 }}
                contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems: "center", paddingBottom: appStyle.largeMarginTop }}
                refreshControl={refreshControl}
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
                    }} >
                    <Text style={appStyle.pageTitle}>
                        Agenda
                    </Text>

                    <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                        {warning?.text}
                    </Text>
                </View>



                {/* Sticky Header before it reached the top */}
                <View style={{ width: "100%", opacity: stickyComponent ? 0 : 1, pointerEvents: stickyComponent ? "none" : "auto",
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
        paddingVertical: appStyle.largeMarginTop,
        alignItems: "center",
        justifyContent: "center",
    }
})