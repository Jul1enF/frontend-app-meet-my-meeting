import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import Agenda from './Agenda/Agenda';
import StepTitle from './StepTitle';
import SelectedAppointment from './SelectedAppointment';


export default function AgendaContainer({ agendaContext, selectedAppointmentSlot }) {

    const [agendaVisible, setAgendaVisible] = useState(true)

    useEffect(() => {
        if (!agendaVisible && !selectedAppointmentSlot) setAgendaVisible(true)
        else if (selectedAppointmentSlot) setAgendaVisible(false)
    }, [selectedAppointmentSlot])

    return (
        <View style={{ width: "100%", alignItems: "center", paddingBottom: selectedAppointmentSlot ? 0 : appStyle.largeMarginTop  }} >

            <StepTitle title="2. Choisir votre horaire" chevronUp={agendaVisible} 
            chevronFunc={()=> setAgendaVisible(prev => !prev)} marginTop={appStyle.regularMarginTop * 1.5} />

            {agendaVisible && <Agenda agendaContext={agendaContext} />}
            
            {selectedAppointmentSlot && <SelectedAppointment informationsArray={[
                {category : "Date", title : selectedAppointmentSlot.start.toFormat("dd/MM/yy")},
                {category : "Horaire", title : selectedAppointmentSlot.start.toFormat("HH:mm")}, 
                {category : "Avec", title : selectedAppointmentSlot.employee.first_name}
                ]} /> }

        </View>
    )
}