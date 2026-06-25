import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Order } from "../../mock-data/types";

export type OrdersState = {
  lastLoadedUserOrders: Order[];
  hydrated: boolean;
};

const initialState: OrdersState = {
  lastLoadedUserOrders: [],
  hydrated: true,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.lastLoadedUserOrders = action.payload;
    },
    clearOrders: (state) => {
      state.lastLoadedUserOrders = [];
    },
  },
});

export const { setOrders, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
