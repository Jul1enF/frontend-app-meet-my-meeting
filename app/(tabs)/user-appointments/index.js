import { View, Text, Platform } from 'react-native';
import { useState, useEffect } from 'react'
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

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
    const [uploading, setUploading] = useState(false)
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
        setUploading(true)
        getAppointmentsInformations(true)
        setUploading(false)
    }, [jwtToken])

    // refreshControl for the ScrollView
    const refreshControl = useRefreshControl(getAppointmentsInformations)

    return (
        <View style={{ flex: 1, backgroundColor: appStyle.pageBody.backgroundColor }}>
            <KeyboardAwareScrollView
                style={{ width: "100%", height: "100%" }}
                bottomOffset={Platform.OS === 'ios' ? 40 : 20}
                contentContainerStyle={{ ...appStyle.pageBody, minWidth: "100%", minHeight: "100%", flex: "auto", paddingHorizontal: appStyle.regularLateralPadding }}
                overScrollMode="never"
                refreshControl={refreshControl}
            >

                <Text style={appStyle.pageTitle}>
                    Mes RDV :
                </Text>

                <Text style={[appStyle.warning, fetchWarning?.success && appStyle.success, !fetchWarning?.text && { height: 0, marginTop: 0 }]}>
                    {fetchWarning?.text}
                </Text>

                {(userAppointments && !userAppointments.length && jwtToken && !uploading) &&
                    <Text style={{ ...appStyle.pageSubtitle, marginTop: appStyle.largeMarginTop }}>
                        Aucun rendez vous à venir !
                    </Text>
                }

                {!jwtToken &&
                    < Text style={{ ...appStyle.pageSubtitle, marginTop: appStyle.largeMarginTop, lineHeight: phoneDevice ? RPW(7.5) : 45 }}>
                        Connectez vous pour enregistrer et voir vos RDV !
                    </Text>
                }

                {userAppointments?.length ?
                    <View style={{ width: "100%", marginTop: appStyle.largeMarginTop, alignItems : "center" }}>
                    {userAppointments.map((e,i) =>
                        <AppointmentItem key={i} appointment={{ ...e }} employees={employees} setOldEvent={setOldEvent} />
                        )}
                    </View>
                    : null
                }

                



            </KeyboardAwareScrollView>
        </View >
    )
}