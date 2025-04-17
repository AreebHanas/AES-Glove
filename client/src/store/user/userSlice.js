import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        name: null,
        email: null,
        id: null
}

export const user = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUser: (state,action)=>{
            state.email = action.payload?.email;
            state.name = action.payload?.name
            state.id = action.payload.id;
        }
    }
})
export const {setUser} = user.actions;
export default user.reducer