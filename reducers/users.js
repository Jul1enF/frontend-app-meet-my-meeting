import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        loadUsers: (state, action) => {
            state.value = action.payload
        },
    }
})

export const { loadUsers } = usersSlice.actions
export default usersSlice.reducer