import { Text, View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useMemo, useState } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AppointmentTypes from './appointment-types';

export default function AppointmentTypesList({ appointmentTypes, selectedAppointmentType, setSelectedAppointmentType, warning }) {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    const [categoriesListVisible, setCategoriesListVisible] = useState(true)

    // Sort of the subcategories
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

    // Map of the subcategories
    const subcats = !subcategories ? null : subcategories.map((e, i) => {
        const selected = e.title === selectedSubcategory
        return <AppointmentTypes key={e.id} {...e} selected={selected} setSelectedSubcategory={setSelectedSubcategory} index={i} setSelectedAppointmentType={setSelectedAppointmentType} setCategoriesListVisible={setCategoriesListVisible} />
    })

    return (
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }} >

            <View style={{
                borderBottomColor: appStyle.strongBlack,
                borderBottomWidth: phoneDevice ? 3 : 5,
                marginTop: appStyle.mediumMarginTop,
            }}>
                <Text style={[appStyle.pageTitle, { paddingBottom: phoneDevice ? RPW(2.5) : 15 }]}>Prendre un rendez vous :</Text>
            </View>

            <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                {warning?.text}
            </Text>

            <View style={[styles.stepContainer, phoneDevice && { width: "100%" }]}>
                <Text style={styles.stepText}>
                    1. Choisir votre rendez-vous
                </Text>

                <FontAwesome5
                    name={categoriesListVisible ? "chevron-up" : "chevron-down"}
                    color={appStyle.fontColorDarkBg}
                    size={phoneDevice ? RPW(4.2) : 23}
                    style={[styles.chevronIcon, selectedAppointmentType === "none" && { display: "none" }]}
                    onPress={() => {
                        setSelectedSubcategory(null)
                        setCategoriesListVisible(!categoriesListVisible)
                    }}
                />
            </View>


            {(selectedAppointmentType === "none" || categoriesListVisible) && subcats}


            {(selectedAppointmentType && selectedAppointmentType !== "none") &&
                <View style={[styles.selectedAppointmentContainer]}>

                    {selectedAppointmentType.sub_category &&
                        <View style={styles.underline} >
                            <Text style={[styles.selectedAppointmentText, { fontWeight: phoneDevice ? "800" : "700", paddingBottom: phoneDevice ? RPW(0.6) : 8, }]}>
                                {selectedAppointmentType.sub_category} :
                            </Text>
                        </View>
                    }

                    <Text style={styles.selectedAppointmentText}>{selectedAppointmentType.title}</Text>

                </View>}

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
    chevronIcon: {
        position: "absolute",
        right: appStyle.regularLateralPadding,
    },
    underline: {
        borderBottomColor: appStyle.strongBlack,
        borderBottomWidth: phoneDevice ? 2.5 : 3
    },
    selectedAppointmentContainer: {
        ...appStyle.largeItem,
        height: "auto",
        paddingVertical: phoneDevice ? RPW(2) : 12,
        borderWidth: phoneDevice ? 2 : 3,
        borderColor: appStyle.strongBlack,
        flexDirection: "row",
        rowGap: phoneDevice ? RPW(1.5) : 10,
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        flexWrap: "wrap",
    },
    selectedAppointmentText: {
        fontSize: appStyle.regularText.fontSize * (phoneDevice ? 1.08 : 1),
        letterSpacing: appStyle.regularText.letterSpacing,
        textAlign: "center",
        fontWeight: "500",
        color: appStyle.strongBlack,
    }
})