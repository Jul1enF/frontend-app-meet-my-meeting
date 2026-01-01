import { Text, View, StyleSheet } from 'react-native';
import { useState } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Agenda from './Agenda/Agenda';


export default function AgendaContainer({ agendaContext }) {

    const [agendaVisible, setAgendaVisible] = useState(true)

    return (
        <View style={{ width: "100%", alignItems: "center", marginTop: appStyle.regularMarginTop * 1.5  }} >

            <View style={[styles.stepContainer, phoneDevice && { width: "100%" }]}>

                <Text style={styles.stepText}>
                    2. Choisir votre horaire
                </Text>

                <FontAwesome5
                    name={agendaVisible ? "chevron-up" : "chevron-down"}
                    color={appStyle.fontColorDarkBg}
                    size={phoneDevice ? RPW(4.2) : 23}
                    style={styles.chevronIcon}
                    onPress={() => {
                        setAgendaVisible(!agendaVisible)
                    }}
                />
            </View>

            {agendaVisible && <Agenda agendaContext={agendaContext} /> }

        </View>
    )
}

const styles = StyleSheet.create({
    stepContainer: {
        ...appStyle.largeItem,
        backgroundColor: appStyle.darkGrey,
        justifyContent: "center",
        borderRadius: 0,
        marginTop : 0,
    },
    stepText: {
        ...appStyle.pageSubtitle,
        textAlign: "left",
        width: "100%",
        paddingHorizontal: appStyle.regularLateralPadding,
        color: appStyle.fontColorDarkBg,
    },
    chevronIcon: {
        position: "absolute",
        right: appStyle.regularLateralPadding,
    },
})