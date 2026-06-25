import type { ID, OrderStatus, Role } from "../types";

export type Category = {
  id: ID;
  slug: string;
  name: string;
  icon?: string;
};

export type Brand = {
  id: ID;
  name: string;
  slug: string;
};

export type ProductReview = {
  id: ID;
  productId: ID;
  userId: ID;
  rating: number; // 1..5
  content: string;
  createdAt: number;
};

export type Product = {
  id: ID;
  name: string;
  brandId: ID;
  categoryId: ID;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  sold: number;
  location: string;
  description: string;
  images: string[];
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  variations?: {
    id: ID;
    name: string;
    options: { id: ID; value: string; stockDelta: number }[];
  }[];
  createdAt: number;
};

export type User = {
  id: ID;
  fullName: string;
  email: string;
  passwordHash: string; // mocked
  role: Role;
  locked: boolean;
  createdAt: number;
};

export type CartItem = {
  id: ID;
  productId: ID;
  quantity: number;
};

export type Voucher = {
  id: ID;
  code: string;
  title: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSubtotal: number;
  active: boolean;
  createdAt: number;
  expiresAt: number;
};

export type WishlistItem = {
  id: ID;
  userId: ID;
  productId: ID;
  createdAt: number;
};

export type Address = {
  fullName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
};

export type OrderItem = {
  id: ID;
  productId: ID;
  quantity: number;
  priceAtPurchase: number;
};

export type Order = {
  id: ID;
  userId: ID;
  items: OrderItem[];
  voucherId?: ID;
  voucherDiscount: number;
  shippingFee: number;
  paymentMethod: "COD" | "CARD" | "WALLET";
  status: OrderStatus;
  address: Address;
  total: number;
  createdAt: number;
};

export type FlashSale = {
  id: ID;
  productIds: ID[];
  startsAt: number;
  endsAt: number;
};

export type Banner = {
  id: ID;
  title: string;
  image: string;
  link: string;
};

export type DB = {
  seededAt: number;
  categories: Category[];
  brands: Brand[];
  products: Product[];
  reviews: ProductReview[];
  users: User[];
  orders: Order[];
  vouchers: Voucher[];
  wishlist: WishlistItem[];
  cartByUserId: Record<ID, CartItem[]>;
  banners: Banner[];
  flashSales: FlashSale[];
};
