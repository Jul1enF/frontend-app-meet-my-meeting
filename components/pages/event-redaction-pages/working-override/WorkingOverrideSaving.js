import { View, Text } from 'react-native';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import request from '@utils/request';
import useSessionExpired from '@hooks/useSessionExpired';
import { dayValidation } from '@components/user-schedule/scheduleUtils';
import { datefromStringHour, toParisDt } from '@utils/timeFunctions';

import Button from '@components/ui/Button';
import ConfirmationModal from '@components/ui/ConfirmationModal';


export default function WorkingOverrideSaving({ oldEvent, workingSchedule, resetAndRenewEvents }) {

    const jwtToken = useSelector((state) => state.user.value.jwtToken)

    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [eventWarning, setEventWarning] = useState("")
    const [fetchWarning, setFetchWarning] = useState({})


    // Function to check that the form is valid and set the fetch settings
    const eventValidation = () => {

        const { dayError, breakError } = dayValidation(workingSchedule, true)
        if (dayError || breakError) {
            setEventWarning(dayError ?? breakError)
            setTimeout(() => setEventWarning(""), 5000)
        }
        else {
            setConfirmationModalVisible(true)
        }
    }


    // States and function to register the event
    const registerRef = useRef(true)
    const [sessionExpired, setSessionExpired] = useState(false)
    useSessionExpired(sessionExpired, setSessionExpired)

    const registerEvent = async () => {
        const previousStart = oldEvent.start ? toParisDt(oldEvent.start) : oldEvent.defaultStart
        const previousEnd = oldEvent.end ? toParisDt(oldEvent.end) : oldEvent.defaultEnd

        const eventToSave = {
            ...oldEvent,
            start : datefromStringHour(workingSchedule.start, previousStart).toUTC().toJSDate(),
            end : datefromStringHour(workingSchedule.end, previousEnd).toUTC().toJSDate(),
            working_schedule : workingSchedule,
            employee : oldEvent.employee,
            category : "workingOverride",
        }

        const data = await request({
            path : "/events/working-override-saving",
            method: "PUT",
            body: { eventToSave },
            jwtToken,
            setSessionExpired,
            functionRef: registerRef,
            setWarning: setFetchWarning,
            setModalVisible: setConfirmationModalVisible,
        })
        if (data?.result) {
            const { eventSaved } = data
            const delay = data.delay ?? 0
            setTimeout(() => {
                resetAndRenewEvents(eventSaved, oldEvent?._id ? "update" : "create", "schedule")
            }, delay)
        }
        else if (data?.delay) {
            setTimeout(() => {
                resetAndRenewEvents()
            }, data.delay)
        }
    }

    return (
        <>
            <Text style={[appStyle.warning, !eventWarning && { height: 0, marginTop: 0 }]}>
                {eventWarning}
            </Text>

            <Button func={eventValidation} text={`${oldEvent?.category === "dayOff" ? "Rajouter" : "Modifier"} ce jour de travail`} style={{ height: appStyle.mediumItemHeight, marginTop: appStyle.largeMarginTop, width : "100%" }} fontStyle={{ ...appStyle.largeText, color: appStyle.fontColorDarkBg, letterSpacing: phoneDevice ? RPW(0.3) : 2 }} />


            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={`Êtes vous sûr(e) de vouloir ${!oldEvent?._id ? "enregistrer" : "modifier"} cette journée de travail ?`} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={registerEvent} />
        </>
    )
}
