import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AppointmentTypes from './appointment-types';

export default function AppointmentTypesList({ appointmentTypes, selectedAppointmentType, setSelectedAppointmentType }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    const [appointmentsListVisible, setAppointmentsListVisible]=useState(true)

    const subcategories = useMemo(() => {
        if (!appointmentTypes) return null
        else if (!appointmentTypes[0]?.sub_category) {
            setSelectedSubcategory("Tous les rendez-vous")
            return [{ types: appointmentTypes, title: "Tous les rendez-vous", id: "allTypes" }]
        } else {
            const subcategoriesObject = appointmentTypes.reduce((acc, type) => {
                const key = type.sub_category
                if (key && !acc[key]) acc[key] = { title: key, id: type._id, types: [type] }
                else {
                    acc[key].types.push(type)
                }
                return acc
            }, {})
            const subcategoriesArray = Object.values(subcategoriesObject)
            subcategoriesArray.sort((a, b) => a.types.length - b.types.length)
            return subcategoriesArray
        }
    }, [appointmentTypes])

    const subcats = !subcategories ? null : subcategories.map((e, i) => {
        const selected = e.title === selectedSubcategory
        return <AppointmentTypes key={e.id} {...e} selected={selected} setSelectedSubcategory={setSelectedSubcategory} index={i} setSelectedAppointmentType={setSelectedAppointmentType} />
    })

    return (
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }} >

            <View style={[styles.stepContainer, phoneDevice && { width: "100%" }]}>
                <Text style={styles.stepText}>
                    1. Choisir votre rendez-vous
                </Text>

                <FontAwesome5
                name={!selectedAppointmentType ? "chevron-up" : "chevron-down"}
                color={appStyle.fontColorDarkBg}
                size={phoneDevice ? RPW(4.2) : 23}
                style={[styles.chevronIcon, !selectedAppointmentType && {display : "none"}]}
                onPress={()=>setSelectedAppointmentType(null)}
            />
            </View>

            {!selectedAppointmentType && subcats}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    stepContainer: {
        ...appStyle.largeItem,
        backgroundColor: appStyle.darkGrey,
        justifyContent: "center",
        marginTop: appStyle.mediumMarginTop,
        borderRadius: 0,
    },
    stepText: {
        ...appStyle.pageSubtitle,
        textAlign: "left",
        width: "100%",
        paddingHorizontal: appStyle.regularLateralPadding,
        color: appStyle.fontColorDarkBg,
    },
      chevronIcon : {
        position :"absolute",
        right : appStyle.regularLateralPadding,
    }
})