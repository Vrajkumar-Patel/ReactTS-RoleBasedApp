import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import UserReducer from "./UserReducer";

export const store = configureStore({
  reducer: {
    user: UserReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
