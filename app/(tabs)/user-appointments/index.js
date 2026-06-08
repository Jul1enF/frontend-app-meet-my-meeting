import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { loadEvents } from '@reducers/user';
import { loadInformations } from '@reducers/planning';

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

    const [fetchWarning, setFetchWarning] = useState({})

    const dispatch = useDispatch()
    const _id = useSelector((state) => state.user.value._id)
    const isConnected = useSelector((state) => state.user.value.isConnected)
    const events = useSelector((state) => state.user.value.events)
    const appointmentsInformations = useSelector((state) => state.planning.value.appointments)
    const { employees } = appointmentsInformations


    // Function to search for user appointments
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const getAppointmentsInformations = useCallback(async (storedData) => {
        if (!isConnected) return
  
        const data = await request({ path: "/appointments/user-appointment-informations", sendToken : true, setSessionExpired, setWarning: setFetchWarning, storedData})

        if (data?.result) {
            dispatch(loadInformations({ target: "appointments", informations: data.informations }))

            const userAppointments = data.informations.events.filter(e =>
                e.category === "appointment" && e.client?.toString() === _id.toString()
                && !isBefore(toParisDt(e.start), DateTime.now({ zone: "Europe/Paris" }))
            )

            dispatch(loadEvents(userAppointments))
        }

    }, [isConnected, _id])


    // useEffect to fetch the user's appointment or select them
    useEffect(() => {
        // The appointments informations can have already been loaded if the user went to the appointment tab before => we don't need to fetch but to select the user's appointments
        const appointmentsInformationsLoaded = appointmentsInformations.events ? true : false

        if (appointmentsInformationsLoaded) {
            const userAppointments = appointmentsInformations.events.filter(e =>
                e.category === "appointment" && e.client?.toString() === _id.toString()
                && !isBefore(toParisDt(e.start), DateTime.now({ zone: "Europe/Paris" }))
            )

            dispatch(loadEvents(userAppointments))
        } 
        // else we need to fetch
        else {
            getAppointmentsInformations(appointmentsInformations)
        }
    }, [getAppointmentsInformations])


    // Memoised props for this component and the redaction one
    const { rootContext, eventRedactionContext } = usePlanningContext(appointmentsInformations, getAppointmentsInformations)

    // Memoised props of this component
    const { eventStart, setEventStart, setOldEvent, setSelectedDate, setSelectedEmployee, oldEvent, resetAndRenewEvents } = rootContext



    // refreshControl for the Flatlist
    const refreshControl = useRefreshControl(()=> getAppointmentsInformations(appointmentsInformations))

    // Function trigerred when an appointment item is pressed
    const appointmentPress = (item) => {
        // If the employee is no longer part of the team, it's dealed in EmployeeSelection
        setSelectedEmployee(employees.find(e => e._id.toString() === item.employee.toString())
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

                {(!events.length && isConnected) ?
                    <Text style={{ ...appStyle.pageSubtitle, marginTop: appStyle.largeMarginTop }}>
                        Aucun rendez vous à venir !
                    </Text>
                    : null
                }

                {!isConnected &&
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
            <ModalPageWrapper visible={eventStart && isConnected && oldEvent} setVisible={setEventStart} closeFunction={() => setOldEvent(null)} backHeaderText="Liste des RDV" noScrollView={true}>
                <EventRedaction eventRedactionContext={eventRedactionContext} clientRedaction={true} />
            </ModalPageWrapper>



            <FlatList
                data={events}
                refreshControl={refreshControl}
                ref={flatlistRef}
                onScrollToIndexFailed={(event) => {
                    flatlistRef.current.scrollToIndex({ animated: false, index: event.index })
                }}
                ListHeaderComponent={faltlistHeader}
                ListHeaderComponentStyle={{ marginVertical: appStyle.largeMarginTop, paddingHorizontal: appStyle.regularHorizontalPadding }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) =>
                    <TouchableOpacity onPress={() => appointmentPress(item)}>
                        <AppointmentItem {...item} employees={employees} resetAndRenewEvents={resetAndRenewEvents} />
                    </TouchableOpacity>}
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: appStyle.pagePaddingBottom }}
            />

        </View >
    )
}