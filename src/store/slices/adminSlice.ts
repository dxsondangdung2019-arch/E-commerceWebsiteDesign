import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminState = {
  hydrated: boolean;
};

const initialState: AdminState = { hydrated: true };

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    noop: (state, _action: PayloadAction<void>) => state,
  },
});

export const { noop } = adminSlice.actions;
export default adminSlice.reducer;
