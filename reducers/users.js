import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter({
    selectId: (user) => user._id,
});

const initialState = usersAdapter.getInitialState({
    loading: false,
    error: null
});

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        loadUsers(state, action) {
            usersAdapter.setAll(state, action.payload)
        },
        updateUser(state, action) {
            usersAdapter.updateOne(state, {
                id: action.payload._id,
                changes: action.payload
            });
        }
    }
})

export const { loadUsers } = usersSlice.actions

export const usersSelectors = usersAdapter.getSelectors(
    (state) => state.users
);

export default usersSlice.reducer