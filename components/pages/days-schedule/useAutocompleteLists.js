import { useMemo } from "react";

export default function useAutocompleteLists(appointmentTypes, users, appointmentsSlots, appointmentStart) {

    const appointmentsList = useMemo(() => {
        if (!appointmentTypes) return []

        const category = appointmentTypes[0].category ? true : false

        const sortedArray = category ?
            [...appointmentTypes].sort((a, b) => a.category.localeCompare(b.category))
            : [...appointmentTypes].sort((a, b) => a.default_duration - b.default_duration)

        const appointmentsArray = sortedArray.map(e => {
            const boldTitle = category ? `${e.category} :  ` : e.title

            const titleToDisplay = `${category && e.title} - ${e.default_duration}min • ${e.price}€`

            return {
                boldTitle,
                titleToDisplay,
                title : boldTitle + titleToDisplay,
                id: e._id.toString(),
                appointment: e,
            }
        })

        return appointmentsArray

    }, [appointmentTypes])


    const usersList = useMemo(() => {
        if (!users) return []

        const sortedArray = [...users].sort((a, b) => a.last_name.localeCompare(b.last_name))

        const usersArray = sortedArray.map(e => {
            const boldTitle = `${e.last_name} - ${e.first_name}`
            const titleToDisplay = ` • ${e.email}`
            return {
                boldTitle,
                titleToDisplay,
                title : boldTitle + titleToDisplay,
                id: e._id,
                user: e,
            }
        })

        return usersArray
    }, [users])


    const appointmentsSlotsList = useMemo(() => {
    
        if (!appointmentsSlots || !appointmentsSlots.length || !appointmentStart) return []

        return [...appointmentsSlots].map(e => {

            const id = e.start.toMillis() === appointmentStart.toMillis() ?
                "initialValue" : e.start.toISO()
                
            return {
                title: e.start.toFormat("HH : mm"),
                id,
                start: e.start,
            }
        })
    }, [appointmentsSlots, appointmentStart])

    return { appointmentsList, usersList, appointmentsSlotsList }
}