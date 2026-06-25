import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ID } from "../../types";
import type { Product } from "../../mock-data/types";
import type { LS_KEYS } from "../../constants";
import { LS_KEYS as KEYS } from "../../constants";
import { readJSON, writeJSON } from "../../utils/storage";

export type CartItem = {
  id: string;
  productId: ID;
  quantity: number;
  product: Product;
  lineTotal: number;
};

export type CartState = {
  items: CartItem[];
  voucherCode: string | null;
  hydrated: boolean;
};

const persisted = readJSON<{
  items: CartItem[];
  voucherCode: string | null;
} | null>(KEYS.DB, null);

const initialState: CartState = {
  items: persisted?.items ?? [],
  voucherCode: persisted?.voucherCode ?? null,
  hydrated: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    setVoucherCode: (state, action: PayloadAction<string | null>) => {
      state.voucherCode = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.voucherCode = null;
    },
  },
});

export const { setCart, setVoucherCode, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
