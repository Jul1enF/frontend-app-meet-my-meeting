import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        first_name: "",
        last_name: "",
        email: "",
        push_token: "",
        jwtToken: "",
        bookmarks: [],
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value = action.payload
        },
        logout: (state, action) => {
            state.value = {
                first_name: "",
                last_name: "",
                email: "",
                push_token: "",
                jwtToken: "",
                bookmarks: [],
            }
        },
        changePushToken: (state, action) => {
            state.value.push_token = action.payload
        },
        addBookmark: (state, action) => {
            state.value.bookmarks.push(action.payload)
        },
        removeBookmark: (state, action) => {
            state.value.bookmarks = state.value.bookmarks.filter(e => e !== action.payload)
        },
        changeUserInfos: (state, action) => {
            state.value.first_name = action.payload.firstName
            state.value.last_name = action.payload.lastName
            state.value.email = action.payload.email
        },
    }
})

export const { login, changePushToken, logout, addBookmark, removeBookmark, changeUserInfos } = userSlice.actions
export default userSlice.reducer