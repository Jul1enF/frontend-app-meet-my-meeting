import { View, Text, FlatList, TouchableOpacity} from 'react-native';
import { useState, useEffect, useRef } from 'react'

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import { useSelector } from 'react-redux';
import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';
import useRefreshControl from '@hooks/useRefreshControl';

import AppointmentItem from '@components/pages/user-appointments/AppointmentItem';


export default function UserAppointments() {

    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const _id = useSelector((state) => state.user.value._id)

    const [appointmentsInformations, setAppoitmentInformations] = useState({})
    const [userAppointments, setUserAppointments] = useState(null)
    const [fetchWarning, setFetchWarning] = useState({})
    const [oldEvent, setOldEvent] = useState(null)

    const { employees } = appointmentsInformations

    // Function to search for user appointments
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const getAppointmentsInformations = async (clearEtag = false) => {
        if (!jwtToken) return

        const data = await request({ path: "/appointments/user-appointment-informations", jwtToken, setSessionExpired, setWarning: setFetchWarning, clearEtag })

        if (data?.result) {
            setAppoitmentInformations(data.informations)
            setUserAppointments(data.informations.events.filter(e =>
                e.category === "appointment" && e.client?.toString() === _id.toString()
            ))
        }
    }

    // useEffect to fetch the user's appointment
    useEffect(() => {
        getAppointmentsInformations(true)
    }, [jwtToken])

    // refreshControl for the Flatlist
    const refreshControl = useRefreshControl(getAppointmentsInformations)


    // Header for the flatlist
    const faltlistHeader = () => {
        return(
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

                <FlatList
                    data={userAppointments ?? []}
                    refreshControl={refreshControl}
                    ref={flatlistRef}
                    onScrollToIndexFailed={(event) => {
                        flatlistRef.current.scrollToIndex({ animated: false, index: event.index })
                    }}
                    ListHeaderComponent={faltlistHeader}
                    ListHeaderComponentStyle={{ marginVertical : appStyle.largeMarginTop, paddingHorizontal : appStyle.regularLateralPadding}}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => 
                    <TouchableOpacity
                        onPress={() => setOldEvent(item)}>
                        <AppointmentItem {...item} employees={employees} />
                    </TouchableOpacity>}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: appStyle.pagePaddingBottom }}
                />

        </View >
    )
}