import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    user: {
        // Store all user details except password
    name: null,
    email: null,
    id: null,
    avatar: null,
    userRole: null,
    status: null,
    macAddress: null, // <-- Added macAddress
    description: null // <-- Added description
    },
    currentUser: {
    name: null,
    email: null,
    id: null,
    userRole: null,
    macAddress: null, // <-- Added macAddress
    description: null // <-- Added description
    }
};

const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // Store all user details except password
            Object.keys(action.payload).forEach(key => {
                if (key !== 'password') {
                    state.user[key] = action.payload[key];
                }
            });
        },
        setCurrentUser: (state, action) => {
            state.currentUser.email = action.payload.email;
            state.currentUser.id = action.payload.id;
            state.currentUser.userRole = action.payload.userRole;
            state.currentUser.name = action.payload.name;
            state.currentUser.macAddress = action.payload.macAddress;
            state.currentUser.description = action.payload.description;
        }
    }
});

export const { setUser, setCurrentUser } = user.actions;
export default user.reducer;