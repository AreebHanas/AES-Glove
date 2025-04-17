import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice.js";

// Persist Config
const persistConfig = {
    key: "root", // The key under which the state will be stored in localStorage
    storage,
  };
  
  // Wrap your userReducer with persistReducer
  const persistedUserReducer = persistReducer(persistConfig, userReducer);
  
  export const store = configureStore({
    reducer: {
      user: persistedUserReducer, // Use the persisted reducer
    },
  });
  
  export const persistor = persistStore(store);