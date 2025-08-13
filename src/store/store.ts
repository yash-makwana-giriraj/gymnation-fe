import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "./slices/headerSlice";
import freeTrialFormReducer from "./slices/freeTrialFormSlice";

export const store = configureStore({
  reducer: {
    header: headerReducer,
    freeTrialForm: freeTrialFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
