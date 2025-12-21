import { View, Text, StyleSheet } from "react-native"
import { useState, useRef, useEffect } from "react"

import { RPH, RPW, phoneDevice } from "@utils/dimensions"
import { appStyle } from "@styles/appStyle"
import AppointmentsTypesInputs from "./AppointmentTypeInputs"
import Button from "@components/ui/Button"
import ConfirmationModal from "@components/ui/ConfirmationModal"
import request from "@utils/request"
import { sortBySubcategory } from "./AppointmentTypesUtils"

export default function AppointmentTypeRedaction({ selectedType, setSelectedType, jwtToken, setTypes, setSessionExpired, subcategories, setTypeModalVisible }) {

    const [subCategory, setSubcategory] = useState(null)
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
            setSubcategory(selectedType.sub_category ?? null)
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

    // FUNCTION TO SEND DATA TO THE BACKEND
    const appointmentTypesModificationRef = useRef(true)

    const appointmentTypesModification = async () => {
        const eventTypeToSave = {
            category: 'appointment',
            sub_category: subCategory?.title ?? null,
            title,
            default_duration: defaultDuration,
            price,
        }

        const newEventType = selectedType ? false : true

        const _id = !newEventType ? selectedType._id : null

        const body = { eventTypeToSave, newEventType, _id }

        const data = await request({ path: "pros/appointment-types-modification", method: "PUT", body, jwtToken, setSessionExpired, functionRef: appointmentTypesModificationRef, setWarning: setFetchWarning, setModalVisible: setConfirmationModalVisible })

        if (data) {
            const { appointmentTypeSaved } = data
            if (newEventType) setTypes(prev => sortBySubcategory([...prev, appointmentTypeSaved]))
            else {
                setTypes(prev => prev.map(e => {
                    if (e._id === selectedType._id) return appointmentTypeSaved
                    else return e
                }))
            }
        }
    }

    // FUNCTION TO DELETE AN APPOINTMENT TYPE
    const deleteAppointmentTypeRef = useRef(true)
    const deleteAppointmentType = async () =>{

        const data = await request({ path: "pros/delete-appointment-type", method: "DELETE", jwtToken, setSessionExpired, functionRef: deleteAppointmentTypeRef, setWarning: setFetchWarning, setModalVisible: setDeleteModalVisible, params : selectedType._id})

        if (data){
            setTypes(prev => prev.filter(e=> e._id !== selectedType._id))
            setSelectedType(null)
            setTimeout(()=> setTypeModalVisible(false), 400)
        }
    }

    return (
        <View style={appStyle.pageBody} >
            <Text style={[appStyle.pageTitle, { paddingHorizontal: appStyle.cardLateralPadding * 0.9, lineHeight: phoneDevice ? RPW(8) : 60 }]} >
                {!selectedType ? "Création d'un nouveau modèle" : "Modifier un modèle"}
            </Text>

            <View style={[appStyle.card, { paddingBottom: phoneDevice ? RPW(12) : 80 }]}>

                <AppointmentsTypesInputs subcategories={subcategories} setSubcategory={setSubcategory} title={title} setTitle={setTitle} defaultDuration={defaultDuration} setDefaultDuration={setDefaultDuration} price={price} setPrice={setPrice} setWarning={setWarning} selectedType={selectedType} />

                <Text style={[appStyle.warning, !warning && { height: 0, marginTop: 0 }]}>
                    {warning}
                </Text>

                <Button func={() => validateType()} text={`Enregistrer ${!selectedType ? "le modèle" : "les modifications"}`} marginTop={appStyle.largeMarginTop} fontStyle={{ color: appStyle.fontColorDarkBg }} />
                
                {selectedType && <Button func={() => setDeleteModalVisible(true)} text={"Supprimer le modèle"} marginTop={appStyle.largeMarginTop} fontStyle={{ color: appStyle.fontColorDarkBg }} />}

            </View>

            < ConfirmationModal visible={confirmationModalVisible} closeModal={() => setConfirmationModalVisible(false)} confirmationText={`Êtes vous sûr(e) de vouloir enregistrer ${!selectedType ? "ce modèle" : "ces modifications"} ?`} confirmationBtnText={"Oui, enregistrer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={appointmentTypesModification} />


            < ConfirmationModal visible={deleteModalVisible} closeModal={() => setDeleteModalVisible(false)} confirmationText={"Êtes vous sûr(e) de vouloir supprimer ce modèle ?"} confirmationBtnText={"Oui, supprimer"} cancelBtnText={"Non, annuler"} warning={fetchWarning} confirmationFunc={deleteAppointmentType} />
        </View>
    )
}

const styles = StyleSheet.create({

})