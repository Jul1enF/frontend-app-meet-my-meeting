import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
    first_name: "",
    last_name: "",
    email: "",
    jwtToken: "",
    role : "",
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
        changeUserInfos: (state, action) => {
            state.value.first_name = action.payload.first_name
            state.value.last_name = action.payload.last_name
            state.value.email = action.payload.email
        },
    }
})

export const { login, logout, changeUserInfos } = userSlice.actions
export default userSlice.reducer