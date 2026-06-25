import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ID, Role } from "../../types";
import type { AuthMeResponse } from "../../services/mockApi";
import { LS_KEYS } from "../../constants";
import { readJSON, writeJSON } from "../../utils/storage";

export type AuthState = {
  token: string | null;
  user: AuthMeResponse["user"] | null;
  role: Role | null;
  hydrated: boolean;
};

const persisted = readJSON<{
  token: string;
  user: AuthMeResponse["user"];
  role: Role;
} | null>(LS_KEYS.AUTH, null);

const initialState: AuthState = {
  token: persisted?.token ?? null,
  user: persisted?.user ?? null,
  role: persisted?.role ?? null,
  hydrated: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromMe: (
      state,
      action: PayloadAction<{
        token: string;
        user: AuthMeResponse["user"];
        role: Role;
      }>,
    ) => {
      const { token, user, role } = action.payload;
      state.token = token;
      state.user = user;
      state.role = role;
      writeJSON(LS_KEYS.AUTH, { token, user, role });
    },
    setTokenOnly: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (!action.payload) {
        state.user = null;
        state.role = null;
        localStorage.removeItem(LS_KEYS.AUTH);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem(LS_KEYS.AUTH);
    },
  },
});

export const { setAuthFromMe, setTokenOnly, logout } = authSlice.actions;
export default authSlice.reducer;
