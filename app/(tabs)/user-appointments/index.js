import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux';

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import request from '@utils/request';
import { toParisDt, isBefore } from '@utils/timeFunctions';
import { DateTime } from 'luxon';
import useSessionExpired from '@hooks/useSessionExpired';
import useRefreshControl from '@hooks/useRefreshControl';
import usePlanningContext from '@hooks/appointments-schedule/usePlanningContext';

import AppointmentItem from '@components/pages/user-appointments/AppointmentItem';
import ModalPageWrapper from '@components/layout/ModalPageWrapper';
import EventRedaction from '@components/pages/event-redaction-pages/event-update/EventRedaction';


export default function UserAppointments() {


    const [appointmentsInformations, setAppointmentInformations] = useState({})
    const [userAppointments, setUserAppointments] = useState(null)
    const [fetchWarning, setFetchWarning] = useState({})

    const _id = useSelector((state) => state.user.value._id)
    const jwtToken = useSelector((state) => state.user.value.jwtToken)


    // Function to search for user appointments
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const getAppointmentsInformations = useCallback(async (clearEtag = false) => {
        if (!jwtToken) return

        const data = await request({ path: "/appointments/user-appointment-informations", jwtToken, setSessionExpired, setWarning: setFetchWarning, clearEtag })

        if (data?.result) {
            setAppointmentInformations(data.informations)

            setUserAppointments(data.informations.events.filter(e =>
                e.category === "appointment" && e.client?.toString() === _id.toString()
                && !isBefore(toParisDt(e.start), DateTime.now({ zone: "Europe/Paris" }))
            ))
        }
    }, [jwtToken, _id])


    // Memoised props for this component and the redaction one
    const { rootContext, redactionContext } = usePlanningContext(appointmentsInformations, setAppointmentInformations, getAppointmentsInformations)

    // Memoised props of this component
    const { eventStart, setEventStart, setOldEvent, setSelectedDate, employees, setSelectedEmployee, oldEvent } = rootContext


    // useEffect to fetch the user's appointment
    useEffect(() => {
        getAppointmentsInformations(true)
    }, [getAppointmentsInformations, jwtToken])


    // refreshControl for the Flatlist
    const refreshControl = useRefreshControl(getAppointmentsInformations)

    // Function trigerred when an appointment item is pressed
    const appointmentPress = (item) => {
        // If the employee is no longer part of the team, it's dealed in EmployeeSelection
        setSelectedEmployee( employees.find(e => e._id.toString() === item.employee.toString())
        ?? { _id: item.employee.toString() })

        setOldEvent(item)
        const start = toParisDt(item.start)
        setEventStart(start)
        setSelectedDate(start)
    }


    // Header for the flatlist
    const faltlistHeader = () => {
        return (
            <>
                <Text style={appStyle.pageTitle}>
                    Mes RDV :
                </Text>

                <Text style={[appStyle.warning, fetchWarning?.success && appStyle.success, !fetchWarning?.text && { height: 0, marginTop: 0 }]}>
                    {fetchWarning?.text}
                </Text>

                {(userAppointments && !userAppointments.length && jwtToken) &&
                    <Text style={{ ...appStyle.pageSubtitle, marginTop: appStyle.largeMarginTop }}>
                        Aucun rendez vous à venir !
                    </Text>
                }

                {!jwtToken &&
                    < Text style={{ ...appStyle.pageSubtitle, marginTop: appStyle.largeMarginTop, lineHeight: phoneDevice ? RPW(7.5) : 45 }}>
                        Connectez vous pour enregistrer et voir vos RDV !
                    </Text>
                }

            </>
        )
    }

    const flatlistRef = useRef(null)

    return (
        <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>

            {/* Modal to set or modify an appointment */}
            <ModalPageWrapper visible={eventStart && jwtToken && oldEvent} setVisible={setEventStart} closeFunction={() => setOldEvent(null)} backHeaderText="Liste des RDV" noScrollView={true}>
                <EventRedaction redactionContext={redactionContext} clientRedaction={true} />
            </ModalPageWrapper>



            <FlatList
                data={(jwtToken && userAppointments) ? userAppointments : []}
                refreshControl={refreshControl}
                ref={flatlistRef}
                onScrollToIndexFailed={(event) => {
                    flatlistRef.current.scrollToIndex({ animated: false, index: event.index })
                }}
                ListHeaderComponent={faltlistHeader}
                ListHeaderComponentStyle={{ marginVertical: appStyle.largeMarginTop, paddingHorizontal: appStyle.regularLateralPadding }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) =>
                    <TouchableOpacity onPress={() => appointmentPress(item)}>
                        <AppointmentItem {...item} employees={employees} />
                    </TouchableOpacity>}
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: appStyle.pagePaddingBottom }}
            />

        </View >
    )
}