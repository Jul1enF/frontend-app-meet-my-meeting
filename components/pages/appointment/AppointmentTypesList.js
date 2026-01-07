import { Text, View, StyleSheet } from 'react-native';
import { useMemo, useState, useEffect } from 'react';

import { RPH, RPW, phoneDevice } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import AppointmentTypes from "./AppointmentTypes"
import SelectedAppointment from './SelectedAppointment';
import StepTitle from './StepTitle';

export default function AppointmentTypesList({ appointmentTypes, selectedAppointmentType, setSelectedAppointmentType, setSelectedAppointmentSlot, warning }) {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categoriesListVisible, setCategoriesListVisible] = useState(true)

    // useEffect to reset categoriesList to visible when the selectedAppointmentType has been cleared
    useEffect(()=>{
        if (!selectedAppointmentType && !categoriesListVisible){
            setCategoriesListVisible(true)
            setSelectedCategory(null)
        }
    },[selectedAppointmentType])


    // Sort of the categories if there are some
    const categories = useMemo(() => {
        if (!appointmentTypes) return null

        else if (!appointmentTypes[0]?.category) {
            setSelectedCategory("Tous les rendez-vous")
            return [{ types: appointmentTypes, title: "Tous les rendez-vous", id: "allTypes" }]
        }
        else {
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
        return <AppointmentTypes key={e.id} {...e} selected={selected} setSelectedCategory={setSelectedCategory} index={i} setSelectedAppointmentType={setSelectedAppointmentType} setCategoriesListVisible={setCategoriesListVisible} setSelectedAppointmentSlot={setSelectedAppointmentSlot} selectedAppointmentType={selectedAppointmentType} />
    })

    const category = selectedAppointmentType?.category

    return (
        <View style={{ width: "100%", alignItems: "center", paddingTop: appStyle.largeMarginTop, paddingBottom: selectedAppointmentType ? 0 : appStyle.largeMarginTop }} >

            <View style={{
                borderBottomColor: appStyle.strongBlack,
                borderBottomWidth: phoneDevice ? 3 : 5,
            }}>
                <Text style={[appStyle.pageTitle, { paddingBottom: phoneDevice ? RPW(2.5) : 15 }]}>Prendre un rendez vous :</Text>
            </View>

            <Text style={[appStyle.warning, warning?.success && appStyle.success, !warning?.text && { height: 0, marginTop: 0 }]}>
                {warning?.text}
            </Text>

            <StepTitle title="1. Choisir votre rendez-vous" chevronUp={categoriesListVisible}
                marginTop={appStyle.largeMarginTop}
                chevronFunc={() => {
                    setSelectedCategory(null)
                    setCategoriesListVisible(!categoriesListVisible)
                }} />


            {categoriesListVisible && cats}


            {selectedAppointmentType && <SelectedAppointment informationsArray={[{ category: category ?? "RDV :", title: selectedAppointmentType.title }, { title: `-   ${selectedAppointmentType.default_duration} min` }, { title: `•   ${selectedAppointmentType.price} €` }]} />}

        </View>
    )
}