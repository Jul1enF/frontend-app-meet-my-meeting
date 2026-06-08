import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
    isConnected : false,
    first_name: "",
    last_name: "",
    email: "",
    role : "",
    _id : "",
    events : [],
}

const initialState = {
    value: defaultUser,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value = {...action.payload, events : []}
        },
        logout: (state, action) => {
            state.value = defaultUser
        },
        changeUserInfos: (state, action) => {
            state.value.first_name = action.payload.first_name
            state.value.last_name = action.payload.last_name
            state.value.email = action.payload.email
        },
        loadEvents: (state, action) => {
            state.value.events = action.payload
        },
        addEvent: (state, action)=>{
            state.value.events = [...state.value.events, action.payload].sort((a,b)=> 
                new Date(a.start) - new Date(b.start)
        )},
        updateEvent: (state, action)=>{
            state.value.events = [...state.value.events].map(e=>{
                if (e._id.toString() === action.payload._id.toString()) return action.payload
                else return e
            }).sort((a,b)=> 
                new Date(a.start) - new Date(b.start)
        )},
        deleteEvent: (state, action) =>{
            state.value.events = [...state.value.events].filter(e => e._id.toString() !== action.payload.toString())
        }
    }
})

export const { login, logout, changeUserInfos, loadEvents, addEvent, updateEvent, deleteEvent } = userSlice.actions
export default userSlice.reducer