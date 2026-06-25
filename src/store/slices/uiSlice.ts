import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LS_KEYS } from "../../constants";
import { readJSON, writeJSON } from "../../utils/storage";

export type UIState = {
  theme: "light" | "dark";
  hydrated: boolean;
};

const persisted = readJSON<{ theme: UIState["theme"] } | null>(
  LS_KEYS.THEME,
  null,
);

const initialState: UIState = {
  theme: persisted?.theme ?? "light",
  hydrated: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState["theme"]>) => {
      state.theme = action.payload;
      writeJSON(LS_KEYS.THEME, { theme: action.payload });
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
