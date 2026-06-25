import type { DB } from "./types";
import type {
  Brand,
  Category,
  Product,
  ProductReview,
  User,
  Voucher,
  WishlistItem,
  CartItem,
  Order,
  OrderItem,
  FlashSale,
  Banner,
  Address,
} from "./types";
import type { ID } from "../types";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

function fakeImage(seed: string, w = 800) {
  // Use picsum with stable seeds; no external auth required.
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}`;
}

function genPasswordHash(email: string) {
  // Not secure; just deterministic.
  let acc = 0;
  for (let i = 0; i < email.length; i++)
    acc = (acc * 31 + email.charCodeAt(i)) % 1000000007;
  return `hash_${acc}`;
}

export function generateDB(seedAt: number): DB {
  const now = Date.now();
  const locations = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Nha Trang",
  ];

  const categories: Category[] = Array.from({ length: 20 }).map((_, idx) => {
    const name = `Danh mục ${idx + 1}`;
    return {
      id: `cat_${idx + 1}`,
      slug: slugify(name),
      name,
      icon: idx % 2 === 0 ? "Laptop" : "Shirt",
    };
  });

  const brands: Brand[] = Array.from({ length: 30 }).map((_, idx) => {
    const name = `Brand ${idx + 1}`;
    return { id: `brand_${idx + 1}`, name, slug: slugify(name) };
  });

  const users: User[] = Array.from({ length: 50 }).map((_, idx) => {
    const role = idx === 0 ? "ADMIN" : "USER";
    const email =
      role === "ADMIN" ? "admin@shopviet.test" : `user${idx}@shopviet.test`;
    return {
      id: `user_${idx + 1}`,
      fullName: idx === 0 ? "Admin ShopViet" : `Khách hàng ${idx + 1}`,
      email,
      passwordHash: genPasswordHash(email),
      role,
      locked: idx % 17 === 0 && role === "USER",
      createdAt: now - randInt(10, 120) * 24 * 3600 * 1000,
    };
  });

  const descriptionWords = [
    "cao cấp",
    "bền bỉ",
    "thiết kế",
    "tiện lợi",
    "chính hãng",
    "tiết kiệm",
    "đa năng",
    "hiệu năng",
    "hỗ trợ",
    "an toàn",
  ];

  const products: Product[] = Array.from({ length: 100 }).map((_, idx) => {
    const id = `p_${idx + 1}`;
    const categoryId = pick(categories).id;
    const brandId = pick(brands).id;

    const originalPrice = randInt(100000, 4000000);
    const discount = randInt(5, 60);
    const price = Math.round((originalPrice * (100 - discount)) / 100);

    const stock = randInt(5, 500);

    const createdAt = now - randInt(0, 60) * 24 * 3600 * 1000;

    const images = Array.from({ length: randInt(1, 4) }).map((__, j) =>
      fakeImage(`${id}_${j + 1}`, 900),
    );

    return {
      id,
      name: `Sản phẩm ${idx + 1} (${pick(["Pro", "Plus", "Max", "Ultra", "Lite"])})`,
      brandId,
      categoryId,
      price,
      originalPrice,
      discount,
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      sold: randInt(0, 50000),
      location: pick(locations),
      description: `Sản phẩm ${idx + 1} ${pick(descriptionWords)} - ${pick(descriptionWords)}. Đầy đủ tính năng cơ bản, tối ưu cho trải nghiệm người dùng.`,
      images,
      stock,
      status: "ACTIVE",
      variations:
        idx % 3 === 0
          ? [
              {
                id: `var_${idx + 1}_1`,
                name: "Phiên bản",
                options: Array.from({ length: randInt(2, 4) }).map(
                  (_, optIdx) => ({
                    id: `v_${idx + 1}_${optIdx + 1}`,
                    value:
                      pick(["A", "B", "C", "Đen", "Trắng", "Xanh", "Đỏ"]) +
                      ` ${optIdx + 1}`,
                    stockDelta: randInt(-2, 2),
                  }),
                ),
              },
            ]
          : undefined,
      createdAt,
    };
  });

  const reviews: ProductReview[] = Array.from({ length: 500 }).map((_, idx) => {
    const product = pick(products);
    const user = pick(users.filter((u) => u.role === "USER"));
    const rating = randInt(1, 5);
    return {
      id: `r_${idx + 1}`,
      productId: product.id,
      userId: user.id,
      rating,
      content: `Review ${idx + 1}: ${rating >= 4 ? "Rất hài lòng" : rating === 3 ? "Ổn" : "Chưa tốt"} - ${pick(["đẹp", "bền", "đúng mô tả", "dùng ổn", "giao nhanh", "tiếc"])}`,
      createdAt: now - randInt(0, 90) * 24 * 3600 * 1000,
    };
  });

  const vouchers: Voucher[] = Array.from({ length: 20 }).map((_, idx) => {
    const type = idx % 2 === 0 ? "PERCENT" : "FIXED";
    const value = type === "PERCENT" ? randInt(5, 25) : randInt(20000, 150000);
    const minSubtotal = randInt(100000, 2000000);
    const createdAt = now - randInt(0, 40) * 24 * 3600 * 1000;
    const expiresAt = createdAt + randInt(10, 80) * 24 * 3600 * 1000;
    const active = randInt(0, 100) > 8;

    return {
      id: `vch_${idx + 1}`,
      code: `VOUCHER${idx + 1}`,
      title: `Voucher ${idx + 1}`,
      type,
      value,
      minSubtotal,
      active,
      createdAt,
      expiresAt,
    };
  });

  const wishlist: WishlistItem[] = Array.from({ length: 800 }).map((_, idx) => {
    const user = pick(users.filter((u) => u.role === "USER"));
    const product = pick(products);
    return {
      id: `wish_${idx + 1}`,
      userId: user.id,
      productId: product.id,
      createdAt: now - randInt(0, 180) * 24 * 3600 * 1000,
    };
  });

  const cartByUserId: Record<ID, CartItem[]> = {};
  users.forEach((u) => {
    if (u.role !== "USER") return;
    const count = randInt(0, 6);
    const items: CartItem[] = Array.from({ length: count }).map((_, idx) => {
      const product = pick(products);
      return {
        id: `ci_${u.id}_${idx + 1}`,
        productId: product.id,
        quantity: randInt(1, Math.min(3, product.stock || 1)),
      };
    });
    cartByUserId[u.id] = items;
  });

  const flashSales: FlashSale[] = Array.from({ length: 2 }).map((_, idx) => {
    const count = 15;
    const productIds = Array.from({ length: count }).map(
      (__, pIdx) => products[(idx * 17 + pIdx * 7) % products.length].id,
    );
    const startsAt = now - randInt(0, 3) * 3600 * 1000;
    const endsAt = startsAt + randInt(5, 15) * 3600 * 1000;
    return { id: `fs_${idx + 1}`, productIds, startsAt, endsAt };
  });

  const banners: Banner[] = [
    {
      id: "b_1",
      title: "Sale lớn mùa hè",
      image: fakeImage("banner_1", 1200),
      link: "/category/" + categories[0].slug,
    },
    {
      id: "b_2",
      title: "Thời trang mới nhất",
      image: fakeImage("banner_2", 1200),
      link: "/category/" + categories[1].slug,
    },
    {
      id: "b_3",
      title: "Giảm giá đến 50%",
      image: fakeImage("banner_3", 1200),
      link: "/search?q=offer",
    },
  ];

  const orders: Order[] = Array.from({ length: 200 }).map((_, idx) => {
    const user = pick(users.filter((u) => u.role === "USER"));
    const itemCount = randInt(1, 5);
    const chosen = Array.from({ length: itemCount }).map(() => pick(products));
    const items: OrderItem[] = chosen.map((p, i) => {
      const quantity = randInt(1, Math.min(4, p.stock || 4));
      return {
        id: `oi_${idx + 1}_${i + 1}`,
        productId: p.id,
        quantity,
        priceAtPurchase: p.price,
      };
    });

    const subtotal = items.reduce(
      (s, it) => s + it.quantity * it.priceAtPurchase,
      0,
    );

    const voucher = randInt(0, 100) > 60 ? pick(vouchers) : undefined;
    const voucherDiscount = voucher
      ? voucher.type === "PERCENT"
        ? Math.round((subtotal * voucher.value) / 100)
        : Math.min(voucher.value, subtotal)
      : 0;

    const shippingFee = 0;
    const total = Math.max(0, subtotal - voucherDiscount) + shippingFee;

    const statusPool: Order["status"][] = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
    ];
    const status = pick(statusPool);

    const address: Address = {
      fullName: user.fullName,
      phone: `09${randInt(10000000, 99999999)}`,
      street: `Đường ${randInt(1, 200)}${pick(["", "B", "C", "D"])}`,
      district: `Quận ${randInt(1, 20)}`,
      city: pick(locations),
    };

    return {
      id: `ord_${idx + 1}`,
      userId: user.id,
      items,
      voucherId: voucher ? voucher.id : undefined,
      voucherDiscount,
      shippingFee,
      paymentMethod: pick(["COD", "CARD", "WALLET"] as const),
      status,
      address,
      total,
      createdAt: now - randInt(0, 120) * 24 * 3600 * 1000,
    };
  });

  const db: DB = {
    seededAt: seedAt,
    categories,
    brands,
    products,
    reviews,
    users,
    orders,
    vouchers,
    wishlist,
    cartByUserId,
    banners,
    flashSales,
  };

  // Quick update rating/sold are already present; reviews exist.
  return db;
}
