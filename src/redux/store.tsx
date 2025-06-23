import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./task.slice";

export const store = configureStore({
  reducer: {
    taskState: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
