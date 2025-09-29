import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./api/apiSlice";
import authSlice from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignorar acciones de RTK Query que pueden tener funciones
          "api/executeQuery/fulfilled",
          "api/executeQuery/pending",
          "api/executeQuery/rejected",
          "api/executeMutation/fulfilled",
          "api/executeMutation/pending",
          "api/executeMutation/rejected",
        ],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
