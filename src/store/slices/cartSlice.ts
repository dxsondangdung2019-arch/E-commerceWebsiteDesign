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

const persistCart = (state: CartState) => {
  writeJSON(KEYS.DB, {
    items: state.items,
    voucherCode: state.voucherCode,
  });
};

const clampQuantity = (stock: number, quantity: number) => {
  const safeStock = Math.max(0, Math.floor(stock));
  if (safeStock === 0) return 0;
  return Math.max(1, Math.min(safeStock, Math.floor(quantity)));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      persistCart(state);
    },
    setVoucherCode: (state, action: PayloadAction<string | null>) => {
      state.voucherCode = action.payload;
      persistCart(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.voucherCode = null;
      persistCart(state);
    },
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) => {
      const { product, quantity = 1 } = action.payload;
      const nextQuantity = clampQuantity(product.stock, quantity);
      if (nextQuantity === 0) return;
      const existing = state.items.find(
        (item) => item.productId === product.id,
      );
      if (existing) {
        existing.quantity = clampQuantity(
          existing.product.stock,
          existing.quantity + nextQuantity,
        );
        existing.lineTotal = existing.product.price * existing.quantity;
        existing.selected = true;
      } else {
        state.items.push({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          quantity: nextQuantity,
          selected: true,
          product,
          lineTotal: product.price * nextQuantity,
        });
      }
      persistCart(state);
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: ID; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((entry) => entry.productId === productId);
      if (!item) return;
      item.quantity = clampQuantity(item.product.stock, quantity);
      item.lineTotal = item.product.price * item.quantity;
      persistCart(state);
    },
    removeFromCart: (state, action: PayloadAction<ID>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
      persistCart(state);
    },
    toggleCartSelection: (state, action: PayloadAction<ID>) => {
      const item = state.items.find(
        (entry) => entry.productId === action.payload,
      );
      if (item) {
        item.selected = !item.selected;
        persistCart(state);
      }
    },
    toggleSelectAll: (state) => {
      const shouldSelectAll = state.items.some((item) => !item.selected);
      state.items = state.items.map((item) => ({
        ...item,
        selected: shouldSelectAll,
      }));
      persistCart(state);
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
