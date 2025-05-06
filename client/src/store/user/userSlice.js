import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
       user: {
        name: null,
        email: null,
        id: null
    },
    currentUser: {
        name: null,
        email: null,
        id: null
    }
}

const user = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUser: (state,action)=>{
            state.user.email = action.payload?.email;
            state.user.name = action.payload?.name
            state.user.id = action.payload.id;
        },
        setCurrentUser: (state,action)=>{
            state.currentUser.email = action.payload.email;
            state.currentUser.id = action.payload.id;
        }
    }
})

export const {setUser,setCurrentUser} = user.actions;
export default user.reducer;