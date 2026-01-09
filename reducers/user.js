import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
    first_name: "",
    last_name: "",
    email: "",
    jwtToken: "",
    role : "",
    events: [],
    _id : "",
}

const initialState = {
    value: defaultUser,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value = action.payload
        },
        logout: (state, action) => {
            state.value = defaultUser
        },
        addEvent: (state, action) => {
            state.value.events.push(action.payload)
        },
        // removeBookmark: (state, action) => {
        //     state.value.bookmarks = state.value.bookmarks.filter(e => e !== action.payload)
        // },
        changeUserInfos: (state, action) => {
            state.value.first_name = action.payload.firstName
            state.value.last_name = action.payload.lastName
            state.value.email = action.payload.email
        },
    }
})

export const { login, logout, addEvent, changeUserInfos } = userSlice.actions
export default userSlice.reducer