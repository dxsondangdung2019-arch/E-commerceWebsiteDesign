import type { DB } from "./types";
import { generateDB } from "./generator";
import { LS_KEYS } from "../constants";
import { readJSON, writeJSON } from "../utils/storage";

export const EMPTY_DB: DB = {
  seededAt: 0,
  categories: [],
  brands: [],
  products: [],
  reviews: [],
  users: [],
  orders: [],
  vouchers: [],
  wishlist: [],
  cartByUserId: {},
  banners: [],
  flashSales: [],
};

export function ensureDBSeeded(): DB {
  const existing = readJSON<DB | null>(LS_KEYS.DB, null);
  if (existing && existing.seededAt) return existing;

  const db = generateDB(Date.now());
  writeJSON(LS_KEYS.DB, db);
  return db;
}

export function getDB(): DB {
  return ensureDBSeeded();
}

export function saveDB(next: DB): void {
  writeJSON(LS_KEYS.DB, next);
}
