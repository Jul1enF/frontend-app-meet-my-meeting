import { View, Text, StyleSheet, Platform } from "react-native"
import { useState, useRef, useEffect } from "react"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import AppointmentsTypesInputs from "./AppointmentTypeInputs"
import Button from "@components/ui/Button"
import ConfirmationModal from "@components/ui/ConfirmationModal"
import request from "@utils/request"
import { sortByCategory } from "./AppointmentTypesUtils"

export default function AppointmentTypeRedaction({ selectedType, setSelectedType, jwtToken, setTypes, setSessionExpired, categories, setTypeModalVisible }) {

    const [category, setCategory] = useState(null)
    const [title, setTitle] = useState("")
    const [defaultDuration, setDefaultDuration] = useState("")
    const [price, setPrice] = useState("")
    const [warning, setWarning] = useState("")
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [fetchWarning, setFetchWarning] = useState({})

    // useEffect to set the input fields if an already exisant appointment type is selected for modifications
    useEffect(() => {
        if (selectedType) {
            setCategory(selectedType.category ?? null)
            setTitle(selectedType.title)
            setDefaultDuration((selectedType.default_duration).toString())
            setPrice((selectedType.price).toString())
        }
    },[])
   
    const validateType = () => {
        if (!title || !price || !defaultDuration) {
            setWarning("Erreur : Titre, Durée et Prix obligatoires")
            setTimeout(() => setWarning(""), 4000)
        }
        else {
            setConfirmationModalVisible(true)
        }
    }


    // CREATE OR MODIFY AN APPOINTMENT IN DATA BASE

    const appointmentTypesModificationRef = useRef(true)

    const appointmentTypesModification = async () => {
        const appointmentTypeToSave = {
            category: category?.title ?? null,
            title,
            default_duration: defaultDuration,
            price,
        }

        const newAppointmentType = selectedType ? false : true

        const _id = !newAppointmentType ? selectedType._id : null

        const body = { appointmentTypeToSave, newAppointmentType, _id }

        const data = await request({ path: "/pros/appointment-types-modification", method: "PUT", body, jwtToken, setSessionExpired, functionRef: appointmentTypesModificationRef, setWarning: setFetchWarning, setModalVisible: setConfirmationModalVisible })

        if (data?.result) {
            const { appointmentTypeSaved } = data
            if (newAppointmentType) setTypes(prev => sortByCategory([...prev, appointmentTypeSaved]))
            else {
                setTypes(prev => prev.map(e => {
                    if (e._id === selectedType._id) return appointmentTypeSaved
                    else return e
                }))
            }
            const delay = data.delay ?? 500
            setTimeout(()=> setTypeModalVisible(false), delay)
        }
    }



    // FUNCTION TO DELETE AN APPOINTMENT TYPE (BY PUTING TO IT AN EXPIRATION DATE)
    const deleteAppointmentTypeRef = useRef(true)
    const deleteAppointmentType = async () =>{

        const data = await request({ path: "/pros/delete-appointment-type", method: "PUT", jwtToken, setSessionExpired, functionRef: deleteAppointmentTypeRef, setWarning: setFetchWarning, setModalVisible: setDeleteModalVisible, body : { _id : selectedType._id}})

        if (data?.result){
            setTypes(prev => prev.filter(e=> e._id !== selectedType._id))
            setSelectedType(null)
            const delay = data.delay ?? 500
            setTimeout(()=> setTypeModalVisible(false), delay)
        }
    }

    return (
        <KeyboardAwareScrollView
                style={{ width: "100%", height: "100%" }}
                contentContainerStyle={{ backgroundColor: appStyle.pageBody.backgroundColor, minWidth: "100%", minHeight: "100%", alignItems: "center" }}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
                bottomOffset={Platform.OS === 'ios' ? 40 : 20}
            >
            <Text style={[appStyle.pageTitle, { paddingHorizontal: appStyle.cardLateralPadding * 0.9, lineHeight: phoneDevice ? RPW(8) : 60 }]} >
                {!selectedType ? "Création d'un nouveau modèle" : "Modifier un modèle"}
            </Text>

            <View style={[appStyle.card, { width: appStyle.largeItemWidth, paddingBottom: phoneDevice ? RPW(12) : 80 }]}>

                <AppointmentsTypesInputs categories={categories} setCategory={setCategory} title={title} setTitle={setTitle} defaultDuration={defaultDuration} setDefaultDuration={setDefaultDuration} price={price} setPrice={setPrice} setWarning={setWarning} selectedType={selectedType} />

                <Text style={[appStyle.warning, !warning && { height: 0, marginTop: 0 }]}>
                    {warning}
                </Text>

                <Button func={() => validateType()} text={`Enregistrer ${!selectedType ? "le modèle" : "les modifications"}`} fontStyle={{ color: appStyle.fontColorDarkBg }} style={{height: appStyle.regularItemHeight * (phoneDevice ? 1.2 : 1.25), marginTop : appStyle.largeMarginTop}} />
                
                {selectedType && <Button func={() => setDeleteModalVisible(true)} text={"Supprimer le modèle"} style={{height: appStyle.regularItemHeight * (phoneDevice ? 1.2 : 1.25), marginTop : appStyle.mediumMarginTop}} fontStyle={{ color: appStyle.fontColorDarkBg }} />}

            </View>

            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={`Êtes vous sûr(e) de vouloir enregistrer ${!selectedType ? "ce modèle" : "ces modifications"} ?`} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={appointmentTypesModification} />


            < ConfirmationModal visible={deleteModalVisible} closeModal={() => setDeleteModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir supprimer ce modèle ?"} confirmationBtnText={"Oui, supprimer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={deleteAppointmentType} />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({

})