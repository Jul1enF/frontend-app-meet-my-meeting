import { TextInput, Text, View } from "react-native";
import { useEffect, useState, useMemo, useRef } from "react";

import EmployeeSelection from "@components/selection/EmployeeSelection";
import ProsAppointmentInputs from "./ProsAppointmentInputs";
import Autocomplete from "@components/ui/Autocomplete"
import DatePicker from "@components/ui/DatePicker/DatePicker";
import useAutocompleteLists from "../event-update/useAutocompleteLists";
import useSetOldEvent from "./useSetOldEvent";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

export default function AppointmentInputs({ redactionContext, setClient, unregisteredClient, setUnregisteredClient, selectedAppointmentType, setSelectedAppointmentType, appointmentsSlots, clientRedaction }) {

    // Props coming from the root
    const { eventStart, setEventStart, appointmentTypes, users, oldEvent, employees, selectedEmployee, setSelectedEmployee, selectedDate, setSelectedDate} = redactionContext

    // Creation with a hook of the autocomplete lists
    const { appointmentsList, usersList, appointmentsSlotsList } = useAutocompleteLists({appointmentTypes, users, appointmentsSlots, eventStart})

    const [slotWarning, setSlotWarning] = useState("")

    // Set an error if the appointment start time selected doesn't fit with the appointment selected duration in a schedule slot
    useEffect(() => {
        if (!selectedAppointmentType || !appointmentsSlotsList) return
        if (!appointmentsSlotsList.some(e =>
            e.start.toMillis() === eventStart.toMillis()
        )) {
            setSlotWarning(`Erreur : ${!appointmentsSlotsList.length ? "aucun créneau disponible ce jour pour ces critères !" : "le rdv ne rentre pas dans le créneau ! Merci de choisir un autre horaire ci dessous :"}`)
            setTimeout(() => setSlotWarning(""), 5000)
        }
    }, [selectedAppointmentType, appointmentsSlotsList])



    // Hook to set the item of autocompletes and the text inputs if an old event has been charged
    const { typesAutocompleteRef, usersAutocompleteRef } = useSetOldEvent({ oldEvent, appointmentsList, usersList, setUnregisteredClient, employees })


    // Clear the appointment type autocomplete if the selected type has been cleared in EventSaving after an attempt to save an event with a suppressed type. For oldEvent cases (modifications) it is handle in useSetOldEvent by displaying "SUPPRIMÉ"
    const appointmentTypeRef = useRef(null)
    useEffect(()=>{
        if (!selectedAppointmentType && appointmentTypeRef.current && typesAutocompleteRef.current && !oldEvent){
            typesAutocompleteRef.current.clear()
        }
    },[selectedAppointmentType])


    // Memoisation of the Autocomplete for the appointments slots
    const slotsAutocomplete = useMemo(() => (
        <Autocomplete
            key={appointmentsSlotsList ? appointmentsSlotsList.length : "key"}
            data={appointmentsSlotsList ?? []}
            placeholderText={eventStart ? eventStart.toFormat("HH : mm") : "Horaire"}
            initialValue={"initialValue"}
            showClear={false}
            editable={false}
            setSelectedItem={(item) => item?.start && setEventStart(item?.start)}
            emptyText={!selectedAppointmentType ? "Merci de sélectionner un RDV" : "Aucun créneau disponible"}
            width="100%"
            suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6) : 40, fontWeight: "700" }}
            listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(3) : 22 }}
        />
    ), [appointmentsSlotsList, eventStart, selectedAppointmentType])




    return (
        <>
            <Autocomplete
                data={appointmentsList}
                placeholderText={"Choix du RDV"}
                setSelectedItem={(item) => {
                    setSelectedAppointmentType(item?.appointment ?? null)
                    appointmentTypeRef.current = item
                }}
                ref={typesAutocompleteRef}
                emptyText="Aucun résultat"
                width="100%"
                inputStyle={{ height: "auto", paddingTop: phoneDevice ? RPW(2.5) : 22, paddingBottom: phoneDevice ? RPW(2.5) : 22, minHeight: appStyle.largeItemHeight }}
                inputContainerStyle={{ height: "auto" }}
                suggestionTextStyle={{ lineHeight: phoneDevice ? RPW(6.5) : 40 }}
                listItemStyle={{ height: "auto", paddingVertical: phoneDevice ? RPW(2.5) : 22 }}
                multiline={true}
                editable={false}
            />

             {oldEvent &&
                <>
                    <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop }}>
                        Avec :
                    </Text>


                    <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} _id={selectedEmployee._id} isInRedactionComponent={true} />

                    <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop }}>
                        Le  :
                    </Text>

                    <DatePicker chosenDate={selectedDate} setChosenDate={(date)=>{
                        setSelectedDate(date)
                        setEventStart(prev => prev.set({ year: date.year, month: date.month, day: date.day }))
                    }}  
                    buttonFontStyle={{ fontWeight : "700"}} buttonStyle={{...appStyle.largeCardItem, height : appStyle.mediumItemHeight}} />
                </>
            }

            <Text style={[appStyle.warning, !slotWarning && { height: 0, marginTop: 0 }]}>
                {slotWarning}
            </Text>


            {slotsAutocomplete}


            {!clientRedaction &&
                <ProsAppointmentInputs usersList={usersList} usersAutocompleteRef={usersAutocompleteRef} setClient={setClient} unregisteredClient={unregisteredClient} setUnregisteredClient={setUnregisteredClient} />
            }

            
            {!oldEvent &&
                <Text style={{ ...appStyle.regularText, marginTop: appStyle.mediumMarginTop, color: appStyle.fontColorDarkBg, fontWeight: "500" }}>
                    <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, fontWeight: "700", textAlign : "center" }}>
                        Avec :
                    </Text>
                    {`  ${selectedEmployee.first_name ? (selectedEmployee.first_name + " ") : ""}${selectedEmployee.last_name ?? ""}`}
                </Text>
            }

        </>
    )
}