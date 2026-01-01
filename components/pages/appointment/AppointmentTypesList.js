import { Text, View, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AppointmentTypes from "./AppointmentTypes"

export default function AppointmentTypesList({ appointmentTypes, selectedAppointmentType, setSelectedAppointmentType, warning }) {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categoriesListVisible, setCategoriesListVisible] = useState(true)

    // Sort of the categories
    const categories = useMemo(() => {
        if (!appointmentTypes) return null
        else if (!appointmentTypes[0]?.category) {
            setSelectedCategory("Tous les rendez-vous")
            return [{ types: appointmentTypes, title: "Tous les rendez-vous", id: "allTypes" }]
        } else {
            const categoriesObject = appointmentTypes.reduce((acc, type) => {
                const key = type.category
                if (key && !acc[key]) acc[key] = { title: key, id: type._id, types: [type] }
                else {
                    acc[key].types.push(type)
                }
                return acc
            }, {})
            const categoriesArray = Object.values(categoriesObject)
            categoriesArray.sort((a, b) => a.types.length - b.types.length)
            return categoriesArray
        }
    }, [appointmentTypes])

    // Map of the categories
    const cats = !categories ? null : categories.map((e, i) => {
        const selected = e.title === selectedCategory
        return <AppointmentTypes key={e.id} {...e} selected={selected} setSelectedCategory={setSelectedCategory} index={i} setSelectedAppointmentType={setSelectedAppointmentType} setCategoriesListVisible={setCategoriesListVisible} />
    })

    return (
        <View style={{ width: "100%", alignItems: "center", paddingTop : appStyle.mediumMarginTop, paddingBottom : selectedAppointmentType ? 0 : appStyle.mediumMarginTop }} >

            <View style={{
                borderBottomColor: appStyle.strongBlack,
                borderBottomWidth: phoneDevice ? 3 : 5,
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
                    style={styles.chevronIcon}
                    onPress={() => {
                        setSelectedCategory(null)
                        setCategoriesListVisible(!categoriesListVisible)
                    }}
                />
            </View>


            {categoriesListVisible && cats}


            {selectedAppointmentType &&
                <View style={styles.selectedAppointmentContainer}>

                    {selectedAppointmentType.category &&
                        <Text style={styles.selectedAppointmentTitle}>
                            {selectedAppointmentType.category} :
                        </Text>
                    }

                    <Text style={styles.selectedAppointmentText}>{selectedAppointmentType.title}</Text>

                </View>}

        </View>
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
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
    },
    selectedAppointmentTitle : {
        ...(phoneDevice ? appStyle.pageSubtitle : appStyle.largeText),
        fontWeight : phoneDevice ? "900" : "700",
        marginRight : phoneDevice ? RPW(2) : 10,
    },
    selectedAppointmentText: {
        ...appStyle.largeText,
        textAlign: "center",
        fontWeight: "500",
        color: appStyle.strongBlack,
    }
})