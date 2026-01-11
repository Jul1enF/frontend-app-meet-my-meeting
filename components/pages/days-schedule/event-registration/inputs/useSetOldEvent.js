import { useEffect, useRef } from "react";

export default function useSetOldEvent({ oldEvent, appointmentsList, usersList, setUnregisteredClient }) {

    const typesAutocompleteRef = useRef(null)
    const usersAutocompleteRef = useRef(null)
    const oldEventSettedRef = useRef(false)
    useEffect(() => {
        if (oldEvent && !oldEventSettedRef.current && typesAutocompleteRef.current && usersAutocompleteRef) {
            // Check that the appointment type still exists in our list (it might have been supressed since the event was posted and so not been downloaded from db)
            const oldAppType = oldEvent.appointment_type
            const appTypeFound = appointmentsList.find(e => e.id === oldAppType._id.toString())

            const suppressedType = {
                title: `SUPPRIMÉ : ${oldAppType.category ?? ""} ${oldAppType.title} - ${oldAppType.default_duration}min • ${oldAppType.price}€`,
                id: "suppressedAppointmentType",
            }

            typesAutocompleteRef.current.setItem(appTypeFound ?? suppressedType)

            // Check that the user still exists in db and so in our list
            if (oldEvent.client) {
                const userFound = usersList.find(e => e.id === oldEvent.client._id.toString())

                const suppressedUser = {
                    title: `SUPPRIMÉ : ${oldEvent.client.last_name} - ${oldEvent.client.first_name} • ${oldEvent.client.email}`,
                    id: "suppressedUser",
                }

                usersAutocompleteRef.current.setItem(userFound ?? suppressedUser)
            } else {
                setUnregisteredClient(oldEvent.unregistered_client)
            }

            oldEventSettedRef.current = true
        }
    }, [oldEvent])

    return { typesAutocompleteRef, usersAutocompleteRef }

}