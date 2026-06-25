# TODO - Chuyển đổi E-commerceWebsiteDesign sang React + TypeScript (Mock Shopee)

## Giai đoạn 1: Kiến trúc & nền tảng (đã chốt hướng reuse UI hiện có)

- [ ] Tạo cấu trúc thư mục mới: src/components, pages, layouts, routes, hooks, contexts, store, services, mock-data, types, utils, constants, assets
- [ ] Chuẩn hoá entry: main.tsx/app/App.tsx để load providers (store/theme/toaster)
- [ ] Tái cấu trúc routing theo folder mới, giữ shadcn/ui & Lucide
- [ ] Tách ProductCard/Layout/Header/Footer sang các components phù hợp

## Giai đoạn 2: Mock API + LocalStorage DB + Data relationships

- [ ] Xây LocalStorage “DB” seed: 100 products, 20 categories, 30 brands, 50 users, 200 orders, 500 reviews, banners, flash sale, vouchers, wishlist, cart
- [ ] Tạo generator mock-data đảm bảo quan hệ:
  - [ ] Product ↔ Category
  - [ ] Product ↔ Brand
  - [ ] Product ↔ Review
  - [ ] User ↔ Order
  - [ ] User ↔ Cart
  - [ ] User ↔ Wishlist
- [ ] Xây services/mockApi.ts (Promise + setTimeout) cho user/auth/products/cart/orders/admin/vouchers

## Giai đoạn 3: State management & Business logic

- [ ] Setup Redux Toolkit (store/) cho: auth, cart, wishlist, orders, ui (dark mode), caching entities
- [ ] Implement guards (private routes) theo role ADMIN/USER với JWT giả lập trong LocalStorage

## Giai đoạn 4: UI pages - luồng mua hàng đến admin

- [ ] Home: banner carousel, flash sale, featured categories/products/new/best seller, suggestions
- [ ] Category/Product list: grid/list, search, filters (category/brand/price/rating/stock), sort
- [ ] Product detail: gallery, variants, kho, reviews, add to cart, buy now
- [ ] Cart: CRUD items, quantity, apply voucher, total calculation
- [ ] Checkout: form địa chỉ + payment method + confirm tạo order
- [ ] Account: profile, order list + detail, change password, wishlist
- [ ] Auth: login/register validation (React Hook Form + Zod), JWT giả lập + phân quyền

## Giai đoạn 5: Admin

- [ ] Admin dashboard: chart doanh thu, tổng đơn/sp/product/customer
- [ ] Product CRUD + stock management
- [ ] Category CRUD
- [ ] Brand CRUD
- [ ] User CRUD + lock/unlock
- [ ] Order management: xem + update trạng thái
- [ ] Voucher CRUD

## Giai đoạn 6: Production readiness

- [ ] Skeleton loading, Empty State, Error State cho mọi màn list
- [ ] Toast notification, Modal confirm
- [ ] React.lazy/Suspense cho pages admin
- [ ] memo cho card/list/filter
- [ ] Kiểm tra strict TS + ESLint không lỗi
- [ ] npm install & npm run dev chạy ngay
