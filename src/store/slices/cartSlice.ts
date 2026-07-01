import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ID } from "../../types";
import type { Product } from "../../mock-data/types";
import { LS_KEYS as KEYS } from "../../constants";
import { readJSON, writeJSON } from "../../utils/storage";

export type CartItem = {
  id: string;
  productId: ID;
  quantity: number;
  selected: boolean;
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
      writeJSON(KEYS.DB, {
        items: action.payload,
        voucherCode: state.voucherCode,
      });
    },
    setVoucherCode: (state, action: PayloadAction<string | null>) => {
      state.voucherCode = action.payload;
      writeJSON(KEYS.DB, { items: state.items, voucherCode: action.payload });
    },
    clearCart: (state) => {
      state.items = [];
      state.voucherCode = null;
      writeJSON(KEYS.DB, { items: [], voucherCode: null });
    },
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(
        (item) => item.productId === product.id,
      );
      if (existing) {
        existing.quantity = Math.min(
          product.stock,
          existing.quantity + quantity,
        );
        existing.selected = true;
      } else {
        state.items.push({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          quantity: Math.min(product.stock, quantity),
          selected: true,
          product,
          lineTotal: product.price * Math.min(product.stock, quantity),
        });
      }
      writeJSON(KEYS.DB, {
        items: state.items,
        voucherCode: state.voucherCode,
      });
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: ID; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((entry) => entry.productId === productId);
      if (!item) return;
      item.quantity = Math.max(1, Math.min(item.product.stock, quantity));
      item.lineTotal = item.product.price * item.quantity;
      writeJSON(KEYS.DB, {
        items: state.items,
        voucherCode: state.voucherCode,
      });
    },
    removeFromCart: (state, action: PayloadAction<ID>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
      writeJSON(KEYS.DB, {
        items: state.items,
        voucherCode: state.voucherCode,
      });
    },
    toggleCartSelection: (state, action: PayloadAction<ID>) => {
      const item = state.items.find(
        (entry) => entry.productId === action.payload,
      );
      if (item) {
        item.selected = !item.selected;
      }
    },
    toggleSelectAll: (state) => {
      const shouldSelectAll = state.items.some((item) => !item.selected);
      state.items = state.items.map((item) => ({
        ...item,
        selected: shouldSelectAll,
      }));
    },
  },
});

export const {
  setCart,
  setVoucherCode,
  clearCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  toggleCartSelection,
  toggleSelectAll,
} = cartSlice.actions;
export default cartSlice.reducer;
