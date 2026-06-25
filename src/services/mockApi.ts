import type { DB, Product, Category, Brand, User, Order, Voucher } from "../mock-data/types";
import { ensureSeeded } from "../mock-data/seed";
import { getDB, saveDB } from "../mock-data/db";
import { nowMs } from "../utils/crypto";
import { base64UrlDecode } from "../utils/crypto";
import { base64UrlEncode } from "../utils/crypto";
import type { ID, Role, OrderStatus } from "../types";

// Types for API contracts
export type AuthTokenPayload = { userId: ID; role: Role; exp: number };
export type AuthMeResponse = { user: Omit<User, "passwordHash">; token: string };

export type ApiError = { code: string; message: string };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function withLatency<T>(fn: () => T, opts?: { minMs?: number; maxMs?: number }) {
  const minMs = opts?.minMs ?? 200;
  const maxMs = opts?.maxMs ?? 650;
  const ms = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  return sleep(ms).then(() => fn());
}

function getMeFromToken(token: string): AuthTokenPayload {
  // token format: header.payload.sig (fake)
  const parts = token.split(".");
  if (parts.length < 2) throw { code: "AUTH_INVALID", message: "Token không hợp lệ" } satisfies ApiError;
  const payloadRaw = parts[1];
  const payloadJson = base64UrlDecode(payloadRaw);
  const payload = JSON.parse(payloadJson) as AuthTokenPayload;
  if (!payload?.exp || payload.exp < nowMs()) {
    throw { code: "AUTH_EXPIRED", message: "Token đã hết hạn" } satisfies ApiError;
  }
  return payload;
}

function issueToken(payload: AuthTokenPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

function pickUserPublic(user: User): Omit<User, "passwordHash"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

function getProductById(db: DB, id: ID): Product {
  const p = db.products.find((x) => x.id === id);
  if (!p) throw { code: "NOT_FOUND", message: "Sản phẩm không tồn tại" } satisfies ApiError;
  return p;
}

function normalizeQuery(s: string) {
  return s.trim().toLowerCase();
}

export const mockApi = {
  // ----------------- Auth -----------------
  auth: {
    register: async (input: { fullName: string; email: string; password: string }) => {
      return withLatency(() => {
        const db = getDB();
        const email = input.email.trim().toLowerCase();
        if (!email.includes("@")) {
          throw { code: "VALIDATION", message: "Email không hợp lệ" } satisfies ApiError;
        }
        if (input.password.trim().length < 6) {
          throw { code: "VALIDATION", message: "Mật khẩu tối thiểu 6 ký tự" } satisfies ApiError;
        }
        if (db.users.some((u) => u.email.toLowerCase() === email)) {
          throw { code: "EMAIL_EXISTS", message: "Email đã tồn tại" } satisfies ApiError;
        }

        const newUser: User = {
          id: `user_${Math.random().toString(16).slice(2)}`,
          fullName: input.fullName.trim() || "Khách hàng mới",
          email,
          passwordHash: `hash_${email}`,
          role: "USER",
          locked: false,
          createdAt: nowMs(),
        };

        db.users.push(newUser);
        db.cartByUserId[newUser.id] = [];

        saveDB(db);

        const token = issueToken({ userId: newUser.id, role: newUser.role, exp: nowMs() + 1000 * 60 * 60 * 6 });
        return { user: pickUserPublic(newUser), token };
      });
    },

    login: async (input: { email: string; password: string }) => {
      return withLatency(() => {
        const db = getDB();
        const email = input.email.trim().toLowerCase();
        const user = db.users.find((u) => u.email.toLowerCase() === email);
        if (!user) throw { code: "AUTH_INVALID", message: "Email hoặc mật khẩu không đúng" } satisfies ApiError;
        if (user.locked) throw { code: "AUTH_LOCKED", message: "Tài khoản bị khóa" } satisfies ApiError;

        // mock: passwordHash is deterministic by email
        const expectedHash = `hash_${email}`;
        if (user.passwordHash !== expectedHash && !user.passwordHash.startsWith("hash_")) {
          throw { code: "AUTH_INVALID", message: "Email hoặc mật khẩu không đúng" } satisfies ApiError;
        }

        const token = issueToken({ userId: user.id, role: user.role, exp: nowMs() + 1000 * 60 * 60 * 6 });
        return { user: pickUserPublic(user), token };
      });
    },

    me: async (token: string): Promise<AuthMeResponse> => {
      ensureSeeded();
      return withLatency(() => {
        const payload = getMeFromToken(token);
        const db = getDB();
        const user = db.users.find((u) => u.id === payload.userId);
        if (!user) throw { code: "AUTH_INVALID", message: "Không tìm thấy người dùng" } satisfies ApiError;
        if (user.locked) throw { code: "AUTH_LOCKED", message: "Tài khoản bị khóa" } satisfies ApiError;
        return { user: pickUserPublic(user), token };
      });
    },
  },

  // ----------------- Catalog -----------------
  products: {
    list: async (params?: {
      page?: number;
      pageSize?: number;
      query?: string;
      categoryId?: ID;
      brandId?: ID;
      priceMin?: number;
      priceMax?: number;
      minRating?: number;
      stockStatus?: "IN_STOCK" | "OUT_OF_STOCK";
      sort?: "new" | "sold" | "priceAsc" | "priceDesc";
    }) => {
      return withLatency(() => {
        const db = getDB();
        const page = Math.max(1, params?.page ?? 1);
        const pageSize = Math.max(6, params?.pageSize ?? 20);

        const q = normalizeQuery(params?.query ?? "");
        let filtered = [...db.products];

        if (q) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
          );
        }
        if (params?.categoryId) filtered = filtered.filter((p) => p.categoryId === params.categoryId);
        if (params?.brandId) filtered = filtered.filter((p) => p.brandId === params.brandId);
        if (typeof params?.priceMin === "number") filtered = filtered.filter((p) => p.price >= params.priceMin!);
        if (typeof params?.priceMax === "number") filtered = filtered.filter((p) => p.price <= params.priceMax!);
        if (typeof params?.minRating === "number") filtered = filtered.filter((p) => p.rating >= params.minRating!);
        if (params?.stockStatus === "IN_STOCK") filtered = filtered.filter((p) => p.stock > 0);
        if (params?.stockStatus === "OUT_OF_STOCK") filtered = filtered.filter((p) => p.stock <= 0);

        switch (params?.sort) {
          case "new":
            filtered.sort((a, b) => b.createdAt - a.createdAt);
            break;
          case "sold":
            filtered.sort((a, b) => b.sold - a.sold);
            break;
          case "priceAsc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "priceDesc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          default:
            filtered.sort((a, b) => b.createdAt - a.createdAt);
        }

        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize);
        return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
      });
    },

    getById: async (id: ID) => {
      return withLatency(() => {
        const db = getDB();
        return getProductById(db, id);
      });
    },

    related: async (productId: ID, limit = 8) => {
      return withLatency(() => {
        const db = getDB();
        const p = getProductById(db, productId);
        const related = db.products
          .filter((x) => x.categoryId === p.categoryId && x.id !== p.id)
          .sort((a, b) => b.sold - a.sold);
        return related.slice(0, limit);
      });
    },

    reviewsByProduct: async (productId: ID, page = 1, pageSize = 10) => {
      return withLatency(() => {
        const db = getDB();
        const all = db.reviews
          .filter((r) => r.productId === productId)
          .sort((a, b) => b.createdAt - a.createdAt);
        const total = all.length;
        const start = (page - 1) * pageSize;
        const items = all.slice(start, start + pageSize);
        return { items, total, page, pageSize };
      });
    },
  },

  // ----------------- Cart -----------------
  cart: {
    get: async (token: string) => {
      return withLatency(() => {
        const payload = getMeFromToken(token);
        if (payload.role !== "USER") throw { code: "FORBIDDEN", message: "Chỉ user mới có cart" } satisfies ApiError;
        const db = getDB();
        const items = db.cartByUserId[payload.userId] ?? [];
        const full = items.map((ci) => {
          const p = getProductById(db, ci.productId);
          return {
            id: ci.id,
            productId: ci.productId,
            quantity: ci.quantity,
            product: p,
            lineTotal: p.price * ci.quantity,
          };
        });
        return full;
      });
    },

    setQuantity: async (token: string, productId: ID, quantity: number) => {
      return withLatency(() => {
        const payload = getMeFromToken(token);
        if (payload.role !== "USER") throw { code: "FORBIDDEN", message: "Chỉ user mới có cart" } satisfies ApiError;
        const db = getDB();
        const p = getProductById(db, productId);
        const q = Math.max(0, Math.floor(quantity));

        const list = db.cartByUserId[payload.userId] ?? [];
        const idx = list.findIndex((x) => x.productId === productId);
        if (q === 0) {
          if (idx >= 0) list.splice(idx, 1);
        } else {
          const nextQty = Math.min(p.stock, q);
          if (idx >= 0) {
            list[idx] = { ...list[idx], quantity: nextQty };
          } else {
            list.push({ id: `ci_${payload.userId}_${productId}`, productId, quantity: nextQty });
          }
        }
        db.cartByUserId[payload.userId] = list;
        saveDB(db);
        return { ok: true };
      });
    },

    remove: async (token: string, productId: ID) => {
      return withLatency(() => {
        const payload = getMeFromToken(token);
        if (payload.role !== "USER") throw { code: "FORBIDDEN", message: "Chỉ user mới có cart" } satisfies ApiError;
        const db = getDB();
        const list = db.cartByUserId[payload.userId] ?? [];
        db.cartByUserId[payload.userId] = list.filter((x) => x.productId !== productId);
        saveDB(db);
        return { ok: true };
      });
    },

    applyVoucher: async (token: string, voucherCode: string) => {
      return withLatency(() => {
        // Apply is computed client-side later; store voucher selection into local cart snapshot (DB: just validate)
        const payload = getMeFromToken(token);
        if (payload.role !== "USER") throw { code: "FORBIDDEN", message: "Chỉ user mới có cart" } satisfies ApiError;
        const db = getDB();
        const code = voucherCode.trim().toUpperCase();
        const v = db.vouchers.find((x) => x.code.toUpperCase() === code);
        if (!v || !v.active) throw { code: "VOUCHER_INVALID", message: "Voucher không hợp lệ" } satisfies ApiError;
        if (v.expiresAt < nowMs()) throw { code: "VOUCHER_EXPIRED", message: "Voucher đã hết hạn" } satisfies ApiError;
        return v;
      });
    },
  },

  // ----------------- Orders -----------------
  orders: {
    listByUser: async (token: string, page = 1, pageSize = 10) => {
      return withLatency(() => {
        const payload = getMeFromToken(token);
        if (payload.role !== "USER") throw { code: "FORBIDDEN", message: "Chỉ user" } satisfies ApiError;
        const db = getDB();
        const all = db.orders
          .filter((o) => o.userId === payload.userId)
          .sort((a, b) => b.createdAt - a.createdAt);
        const total = all.length;
        const start = (page - 1) * pageSize;
        const items = all.slice(start, start + pageSize);
        return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
      });
    },

    getByIdForUser: async (token: string, orderId: ID) => {
      return withLatency(() => {
        const payload = getMeFromToken(token);
