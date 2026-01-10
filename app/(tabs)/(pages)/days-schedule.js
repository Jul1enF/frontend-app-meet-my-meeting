import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import useSessionExpired from '@hooks/useSessionExpired';
import useRefreshControl from '@hooks/useRefreshControl';
import useDaysScheduleContext from '@components/pages/days-schedule/main-container/useDaysScheduleContext';

import StickyHeader from '@components/pages/days-schedule/main-container/StickyHeader';
import Schedule from '@components/pages/days-schedule/schedule/Schedule';
import ModalPageWrapper from '@components/layout/ModalPageWrapper';
import EventRedaction from '@components/pages/days-schedule/event-registration/event-update/EventRedaction';


export default function DaysSchedule() {

    const [warning, setWarning] = useState({})
    const [scheduleInformations, setScheduleInformations] = useState({})


    // LOAD SCHEDULE INFORMATIONS FUNCTION

    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const getScheduleInformations = useCallback(async (clearEtag) => {
        const data = await request({ path: "events/schedule-informations", jwtToken, setSessionExpired, clearEtag, setWarning })

        if (data?.result) {
            setScheduleInformations(data.informations)
            setSelectedEmployee(prev =>
                prev ?? data.informations.employees.find(e => e._id === _id)
            )
        }
    }, [jwtToken, _id ])


    // Memoised props for the all the components
    const { daysScheduleContext, scheduleContext, redactionContext } = useDaysScheduleContext(scheduleInformations, setScheduleInformations, getScheduleInformations)

    // Memoised props for this component
    const { eventStart, setEventStart, setOldEvent, selectedDate, setSelectedDate, employees, selectedEmployee, setSelectedEmployee, _id, jwtToken } = daysScheduleContext


    // useEffect for firstRender to fetch datas with a clearEtag (and ref for useFocusEffect)
    const firstRenderRef = useRef(false)
    useEffect(() => {
        getScheduleInformations(true)
        setTimeout(()=> firstRenderRef.current = true, 1000)
    }, [])
    // useFocusEffect to fetch schedule informations every time the screen is seen
    useFocusEffect(useCallback(() => {
        if (firstRenderRef.current) getScheduleInformations()
    }, [getScheduleInformations]))


    // refreshControl for the ScrollView
    const refreshControl = useRefreshControl(getScheduleInformations)

    // Custom sticky header settings
    const [stickyComponent, setStickyComponent] = useState(false)
    const [pageTitleHeight, setPageTitleHeight] = useState(0)
    const [firstWeekDay, setFirstWeekDay] = useState(null)


    return (
        <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>

            {/* Modal to set or modify an appointment */}
            <ModalPageWrapper visible={eventStart} setVisible={setEventStart} closeFunction={() => setOldEvent(null)} backHeaderText="Agenda">
                <EventRedaction redactionContext={redactionContext} />
            </ModalPageWrapper>


            {/* Sticky Header after the pageTitle bottom is reached */}
            <StickyHeader stickyComponent={stickyComponent} selectedDate={selectedDate} setSelectedDate={setSelectedDate} employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} _id={_id} firstWeekDay={firstWeekDay} setFirstWeekDay={setFirstWeekDay} isSticky={true} />


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
                <StickyHeader stickyComponent={stickyComponent} selectedDate={selectedDate} setSelectedDate={setSelectedDate} employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} _id={_id} firstWeekDay={firstWeekDay} setFirstWeekDay={setFirstWeekDay} isSticky={false} />


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