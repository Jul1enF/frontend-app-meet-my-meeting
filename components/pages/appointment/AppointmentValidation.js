import { Text, View, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import { useSelector, useDispatch } from 'react-redux';
import { addEvent } from '@reducers/user';
import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';


import StepTitle from './StepTitle';
import Button from '@components/ui/Button';
import Signin from '@components/pages/login/Signin';
import Signup from '@components/pages/login/Signup';
import GoingBackHeader from '@components/ui/GoingBackHeader';
import ConfirmationModal from '@components/ui/ConfirmationModal';


export default function AppointmentValidation({ selectedAppointmentType: type, selectedAppointmentSlot: slot, resetAndRenewEvents }) {

    const dispatch = useDispatch()

    const jwtToken = useSelector((state) => state.user.value.jwtToken)
    const [userIsConnecting, setUserIsConnecting] = useState(false)
    const [signForm, setSignForm] = useState("signin")
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})


    const buttonText = jwtToken ? "Enregistrer votre RDV" : "Se connecter / S'incrire"
    const buttonFunction = () => jwtToken ? setConfirmationModalVisible(true) : setUserIsConnecting(true)

    // Function to register the appointment
    const registerRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const registerAppointment = async () => {

        const appointmentToSave = {
            start: slot.start.toUTC().toJSDate(),
            end: slot.start.plus({ minutes: type.default_duration }).toUTC().toJSDate(),
            employee: slot.employee._id,
            category: "appointment",
            appointment_type: type._id,
        }

        const data = await request({
            path: "appointments/user-appointment-registration",
            method: "POST",
            body: { appointmentToSave },
            jwtToken,
            setSessionExpired,
            functionRef: registerRef,
            setWarning: setFetchWarning,
            setModalVisible: setConfirmationModalVisible,
        })
        if (data?.result) {
            const { appointmentSaved } = data
            dispatch(addEvent(appointmentSaved))
            setTimeout(()=> resetAndRenewEvents(appointmentSaved), data.delay)
        }
        else if (data.delay){
            setTimeout(()=> resetAndRenewEvents(), data.delay)
        }
    }


    if (!userIsConnecting || jwtToken) {
        return (
            <View style={{ paddingBottom: appStyle.largeMarginTop, width: "100%", alignItems: "center" }} >
                <StepTitle title="3. Valider votre RDV" noChevron={true} marginTop={appStyle.regularMarginTop * 1.5} />

                <Button func={buttonFunction} text={buttonText} marginTop={appStyle.largeMarginTop} style={{ height: appStyle.largeItemHeight }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, letterSpacing: phoneDevice ? RPW(0.3) : 2 }} />


                < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir enregistrer ce rendez-vous ?"} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={registerAppointment} />
            </View>
        )
    }
    else {
        return (
            <View style={{ position: "absolute", top: 0, backgroundColor: appStyle.pageBody.backgroundColor, height: "100%", width: "100%" }} >
                <GoingBackHeader previousPageName="Choix du RDV" leftFunction={() => setUserIsConnecting(false)} />

                {signForm === "signin" ? <Signin setSignForm={setSignForm} func={() => setUserIsConnecting(false)} /> :
                    <Signup setSignForm={setSignForm} func={() => setUserIsConnecting(false)} />}

            </View>
        )
    }
}