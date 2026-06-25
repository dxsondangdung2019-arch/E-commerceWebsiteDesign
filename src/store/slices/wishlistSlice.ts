import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ID } from "../../types";
import type { WishlistItem } from "../../mock-data/types";
import { LS_KEYS } from "../../constants";
import { readJSON, writeJSON } from "../../utils/storage";

export type WishlistState = {
  items: WishlistItem[];
  hydrated: boolean;
};

const persisted = readJSON<WishlistItem[] | null>(
  LS_KEYS.DB + "_wishlist",
  null,
);

const initialState: WishlistState = {
  items: persisted ?? [],
  hydrated: true,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
