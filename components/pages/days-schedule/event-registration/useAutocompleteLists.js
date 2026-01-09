import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function useAutocompleteLists(appointmentTypes, users, appointmentsSlots, eventStart) {

    const role = useSelector((state)=>state.user.value.role)
    const canAddClosures = ["owner","admin"].includes(role)

    const categoriesList = useMemo(()=>[
        { title : "RDV", id : "initialValue", category : "appointment" },
        { title : "Congé", id : "1", category : "absence" },
        { title : "Pause", id : "2", category : "break" },
        canAddClosures && { title : "Fermeture", id : "3", category : "closure"},
    ],[])



    const appointmentsList = useMemo(() => {
        if (!appointmentTypes) return []

        const category = appointmentTypes[0].category ? true : false

        const categoryCount = category && [...appointmentTypes].reduce((acc, {category})=>{
            acc[category] ? acc[category] += 1 : acc[category] = 1
            return acc
        },{})

        const sortedArray = category ?
            [...appointmentTypes].sort((a, b) => categoryCount[b.category] - categoryCount[a.category])
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
        if (!appointmentsSlots) return null
    
        if (!appointmentsSlots.length || !eventStart) return []

        return [...appointmentsSlots].map(e => {

            const id = e.start.toMillis() === eventStart.toMillis() ?
                "initialValue" : e.start.toISO()

            return {
                title: e.start.toFormat("HH : mm"),
                id,
                start: e.start,
            }
        })
    }, [appointmentsSlots, eventStart])

    return {categoriesList, appointmentsList, usersList, appointmentsSlotsList }
}