import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function useAutocompleteLists({appointmentTypes, users, availableSlots, eventStart, selectedEmployee = null}) {

    const role = useSelector((state)=>state.user.value.role)
    const _id = useSelector((state)=>state.user.value._id)


    const categoriesList = useMemo(()=>{
        if (!selectedEmployee) return []

        const canAddClosure = ["owner","admin"].includes(role)

        const canAddAbsenceOrBreak = ["owner","admin"].includes(role) || _id.toString() === selectedEmployee._id.toString()

        const list = [
            { title : "RDV", category : "appointment" },
        ]

        canAddAbsenceOrBreak && list.push(
            { title : "Pause", category : "break" },
            { title : "Congé", category : "absence" }
        )

        canAddClosure && list.push({ title : "Fermeture", category : "closure"})

        return list
    },[selectedEmployee])



    const appointmentsList = useMemo(() => {
        if (!appointmentTypes) return []

        const hasCategory = appointmentTypes[0].category ? true : false

        const categoryCount = hasCategory && [...appointmentTypes].reduce((acc, {category})=>{
            acc[category] ? acc[category] += 1 : acc[category] = 1
            return acc
        },{})

        let sortedArray
        if (hasCategory){
            sortedArray = [...appointmentTypes].sort((a, b) => {
                const diff = categoryCount[b.category] - categoryCount[a.category]
                if (diff !== 0) return diff
                else return a.category.localeCompare(b.category)
            })
        }else{
            sortedArray = [...appointmentTypes].sort((a, b) => a.default_duration - b.default_duration)
        }

        const appointmentsArray = sortedArray.map(e => {
            const suppressed = e.expiresAt ? true : false
            const boldTitle = (suppressed ? "SUPPRIMÉ : " : "") + (hasCategory ? `${e.category} :  ` : e.title)

            const lightTitle = `${hasCategory && e.title} - ${e.default_duration}min • ${e.price}€`

            return {
                boldTitle,
                lightTitle,
                title : boldTitle + lightTitle,
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
            const lightTitle = ` • ${e.email}`
            return {
                boldTitle,
                lightTitle,
                title : boldTitle + lightTitle,
                user: e,
            }
        })

        return usersArray
    }, [users])



    const availableSlotsList = useMemo(() => {
        if (!availableSlots) return null
    
        if (!availableSlots.length || !eventStart) return []

        return [...availableSlots].map(e => {

            return {
                title: e.start.toFormat("HH : mm"),
                start: e.start,
            }
        })
    }, [availableSlots, eventStart])

    return {categoriesList, appointmentsList, usersList, availableSlotsList }
}