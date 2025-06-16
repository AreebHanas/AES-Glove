import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice.js";
import processingExerciseReducer from "./processingExercise/processingExercise.js";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Persist Config
const persistConfig = {
  key: "root", // The key under which the state will be stored in localStorage
  storage,
};

const persistConfigProcessingExercise = {
  key: "processingExercise",
  storage,
};

// Wrap your userReducer with persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedProcessingExerciseReducer = persistReducer(persistConfigProcessingExercise, processingExerciseReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Use the persisted reducer
    processingExercise: persistedProcessingExerciseReducer // Placeholder for processingExercise reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);