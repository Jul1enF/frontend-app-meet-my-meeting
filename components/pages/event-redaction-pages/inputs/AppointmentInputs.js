import { TextInput, Text, View } from "react-native";
import { useEffect, useState, useMemo } from "react";

import EmployeeSelection from "@components/selection/EmployeeSelection";
import ProsAppointmentInputs from "./ProsAppointmentInputs";
import Autocomplete from "@components/ui/autocomplete/Autocomplete";
import DatePicker from "@components/ui/DatePicker/DatePicker";
import useAutocompleteLists from "../event-update/useAutocompleteLists";

import { phoneDevice, RPH, RPW } from '@utils/dimensions'
import { appStyle } from '@styles/appStyle';

import { DateTime } from "luxon";
import { isBefore, getDayDuration } from "@utils/timeFunctions";

export default function AppointmentInputs({ eventRedactionContext, setClient, unregisteredClient, setUnregisteredClient, selectedAppointmentType, setSelectedAppointmentType, availableSlots, clientRedaction, client }) {

    // Props coming from the root
    const { eventStart, setEventStart, appointmentTypes, users, oldEvent, employees, selectedEmployee, setSelectedEmployee, selectedDate, setSelectedDate, maxFuturDays } = eventRedactionContext

    // Creation with a hook of the autocomplete lists
    const { appointmentsList, usersList, availableSlotsList } = useAutocompleteLists({ appointmentTypes, users, availableSlots, eventStart })

    const [slotWarning, setSlotWarning] = useState("")

    // Set an error if the appointment start time selected doesn't fit with the appointment selected duration in a schedule slot
    useEffect(() => {
        if (!selectedAppointmentType || !availableSlotsList || !eventStart) return
        if (!availableSlotsList.some(e =>
            e.start.toMillis() === eventStart.toMillis()
        )) {
            const isEventStartInPast = isBefore(eventStart, DateTime.now({ zone: "Europe/Paris" }))

            const slotWarningText = !availableSlotsList.length ? "aucun créneau disponible ce jour pour ces critères !" :
                `${isEventStartInPast ? "l'heure de début du rendez vous est déjà passée " : "le rdv ne rentre pas dans le créneau "}! Merci de choisir un autre horaire ci dessous :`

            setSlotWarning("Erreur : " + slotWarningText)
            setTimeout(() => setSlotWarning(""), 5000)
        }
    }, [selectedAppointmentType, availableSlotsList])




    // Determination of the max date to select in the datepicker 
    const maxDateInDatePicker = useMemo(()=> {
    
    // If an employee has a contract end date, calculation of the remaining days
    const daysBeforeEmployeeQuit = selectedEmployee?.contract_end ? getDayDuration(DateTime.now({zone: "Europe/Paris"}).endOf("day"), selectedEmployee.contract_end) : null

    // For a client it is either the max days allowed to take an appointment or the remaining days of employee
    if (clientRedaction && maxFuturDays) return DateTime.now({ zone: "Europe/Paris" }).endOf('day').plus({ days: daysBeforeEmployeeQuit ? Math.min(maxFuturDays, daysBeforeEmployeeQuit) : maxFuturDays })
    
    // For pros there is only a day limit if the employee has contract end date
    else return daysBeforeEmployeeQuit ? DateTime.now({ zone: "Europe/Paris" }).endOf('day').plus({ days: daysBeforeEmployeeQuit }) : null

    },[selectedEmployee, clientRedaction, maxFuturDays])

    return (
        <>
            <Autocomplete
                data={appointmentsList}
                placeholderText={"Choix du RDV"}
                setSelectedItem={setSelectedAppointmentType}
                sectionToSelectKey={"appointment"}
                selectedItem={selectedAppointmentType}
                inputStyle={{ ...appStyle.input.baseLargeCard, color : appStyle.fontColorDarkBg }}
                multiline={true}
                editable={false}
            />
            

            {oldEvent &&
                <>
                    <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop }}>
                        Avec :
                    </Text>


                    <EmployeeSelection employees={employees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} _id={selectedEmployee?._id} isInRedactionComponent={true} />

                    <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, marginTop: appStyle.mediumMarginTop }}>
                        Le  :
                    </Text>

                    <DatePicker chosenDate={selectedDate} setChosenDate={(date) => {
                        setSelectedDate(date)
                        setEventStart(prev => prev.set({ year: date.year, month: date.month, day: date.day }))
                    }}
                        buttonFontStyle={{ fontWeight: "700" }} buttonStyle={{ ...appStyle.largeCardItem, height: appStyle.mediumItemHeight }}
                        maxDate={maxDateInDatePicker} />
                </>
            }

            <Text style={[appStyle.warning, !slotWarning && { height: 0, marginTop: 0 }]}>
                {slotWarning}
            </Text>


            <Autocomplete
                data={availableSlotsList ?? []}
                placeholderText={eventStart ? eventStart.toFormat("HH : mm") : "Horaire"}
                showClear={false}
                editable={false}
                setSelectedItem={setEventStart}
                selectedItem={eventStart}
                sectionToSelectKey={"start"}
                emptyResultText={!selectedAppointmentType ? "Merci de sélectionner un RDV" : "Aucun créneau disponible"}
                inputStyle={{ ...appStyle.input.baseLargeCard, color : appStyle.fontColorDarkBg }}
                dropdownTextStyle={{fontWeight : "700"}}
            />


            {!clientRedaction &&
                <ProsAppointmentInputs usersList={usersList} setClient={setClient} unregisteredClient={unregisteredClient} setUnregisteredClient={setUnregisteredClient} client={client} />
            }


            {(!oldEvent && selectedEmployee) &&
                <Text style={{ ...appStyle.regularText, marginTop: appStyle.mediumMarginTop, color: appStyle.fontColorDarkBg, fontWeight: "500" }}>
                    <Text style={{ ...appStyle.labelText, color: appStyle.fontColorDarkBg, fontWeight: "700", textAlign: "center" }}>
                        Avec :
                    </Text>
                    {`  ${selectedEmployee.first_name ? (selectedEmployee.first_name + " ") : ""}${selectedEmployee.last_name ?? ""}`}
                </Text>
            }

        </>
    )
}