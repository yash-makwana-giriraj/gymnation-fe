import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    headerType: 'dark',
};

const headerSlice = createSlice({
    name: "header",
    initialState,
    reducers: {
        setHeaderType(state, action: PayloadAction<string>) {
            state.headerType = action.payload;
        },
    },
});

export const { setHeaderType } = headerSlice.actions;

export default headerSlice.reducer;
