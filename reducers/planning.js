import { createSlice } from "@reduxjs/toolkit";

const ascendingSort = (a,b) => new Date(a.start) - new Date(b.start)

const defaultPlanning = {
    schedule: {},
    appointments: {},
}

const initialState = {
    value: defaultPlanning,
}

export const planningSlice = createSlice({
    name : 'planning',
    initialState,
    reducers : {
        loadInformations : (state, action) => {
            const { target, informations } = action.payload
            state.value[target] = informations
        },
        createEvent : (state, action) => {
            const { target, category, event } = action.payload
            state.value[target][category] = [...state.value[target][category], event].sort(ascendingSort)
        },
        updateEvent : (state, action) => {
            const { target, category, event } = action.payload
            state.value[target][category] = [...state.value[target][category]].map(e=> e._id === event._id ? event : e).sort(ascendingSort)
        },
        deleteEvent : (state, action) => {
            const { target, category, event } = action.payload
            state.value[target][category] = [...state.value[target][category]].filter(e => e._id !== event._id)
        },
        deleteInformations : (state, action) => {
            state.value = defaultPlanning
        }
    }
})

export const { loadInformations, createEvent, updateEvent, deleteEvent, deleteInformations } = planningSlice.actions
export default planningSlice.reducer