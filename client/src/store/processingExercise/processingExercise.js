import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    processingExerciseId: null,
    sensor: null,
    isTimerComplete: false,
    isStarted: false,
    timerId: null
};

const processingExercise = createSlice({
    name: 'processingExercise',
    initialState,
    reducers: {
        setProcessingExerciseId: (state, action) => {
            state.processingExerciseId = action.payload;
        },
        setSensor: (state, action) => {
            state.sensor = action.payload;
        },
        setIsTimerComplete: (state, action) => {
            state.isTimerComplete = action.payload;
        },
        setIsStarted: (state, action) => {
            state.isStarted = action.payload;
        },
        setTimerId: (state, action) => {
            state.timerId = action.payload;
        }
    }
});

export const { setSensor, setProcessingExerciseId, setIsTimerComplete, setIsStarted, setTimerId } = processingExercise.actions;
export default processingExercise.reducer;