import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { loadInformations } from '@reducers/planning';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';
import request from '@utils/request';

import useSessionExpired from '@hooks/useSessionExpired';
import useRefreshControl from '@hooks/useRefreshControl';
import usePlanningContext from '@hooks/appointments-schedule/usePlanningContext';

import StickyHeader from '@components/pages/days-schedule/main-container/StickyHeader';
import Schedule from '@components/pages/days-schedule/schedule/Schedule';
import ModalPageWrapper from '@components/layout/ModalPageWrapper';
import EventRedaction from '@components/pages/event-redaction-pages/event-update/EventRedaction';


export default function DaysSchedule() {
    const dispatch = useDispatch()
    const [warning, setWarning] = useState({})

    const scheduleInformations = useSelector((state) => state.planning.value.schedule)
    const employees = useSelector((state) => state.planning.value.schedule.employees)
    const _id = useSelector((state) => state.user.value._id)
    const jwtToken = useSelector((state) => state.user.value.jwtToken)


    // LOAD SCHEDULE INFORMATIONS FUNCTION

    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)
    const lastFetchRef = useRef(null)

    const getScheduleInformations = useCallback(async () => {
        if (!jwtToken) return

        const scheduleInformationsLoaded = !employees ? true : false
        const now = new Date()

        // Avoid double fetch when employees (which is in dependances) changes with fresh datas
        if (lastFetchRef.current && now - lastFetchRef.current < 5000) return

        const data = await request({ path: "/events/schedule-informations", jwtToken, setSessionExpired, setWarning, clearEtag: scheduleInformationsLoaded })

        if (data?.result) {
            dispatch(loadInformations({ target: "schedule", informations: data.informations }))
            setSelectedEmployee(prev =>
                prev ?? data.informations.employees?.find(e => e._id === _id)
            )
        } else {
            setSelectedEmployee(prev => prev ?? employees?.find(e => e._id === _id))
        }

        lastFetchRef.current = now
    }, [jwtToken, _id, employees])

    // useFocusEffect to fetch the datas every time the screen appears
    useFocusEffect(useCallback(() => {
        getScheduleInformations()
    }, [getScheduleInformations]))



    // Memoised props for the all the components
    const { rootContext, scheduleContext, redactionContext } = usePlanningContext(scheduleInformations, getScheduleInformations)

    // Memoised props for this component
    const { eventStart, setEventStart, setOldEvent, selectedDate, setSelectedDate, selectedEmployee, setSelectedEmployee } = rootContext



    // refreshControl for the ScrollView
    const refreshControl = useRefreshControl(getScheduleInformations)

    // Custom sticky header settings
    const [stickyComponent, setStickyComponent] = useState(false)
    const [pageTitleHeight, setPageTitleHeight] = useState(0)
    const [firstWeekDay, setFirstWeekDay] = useState(null)


    return (
        <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>

            {/* Modal to set or modify an event */}
            <ModalPageWrapper visible={eventStart} setVisible={setEventStart} closeFunction={() => setOldEvent(null)} backHeaderText="Agenda" noScrollView={true}>
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