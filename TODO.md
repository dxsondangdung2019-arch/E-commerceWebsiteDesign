# TODO.md — E-commerceWebsiteDesign (Mock Shopee UI/UX)

## Phase 0 — Kiểm tra baseline & chuẩn bị

- [x] Đảm bảo dự án build chạy được trước khi chỉnh sửa mạnh.
- [x] Rà soát cấu trúc product/category/type trong mock-data để map đúng variants/reviews.
- [x] Xác định cách lấy data: `src/app/data/products.ts` vs `src/mock-data/*` vs `src/services/mockApi.ts`.

## Phase 1 — Core Shopping Experience

### 1. Home Page UI hoàn chỉnh

- [x] Hoàn thiện layout section theo đúng spec:
  - [x] Banner Carousel
  - [x] Categories Section
  - [x] Flash Sale
  - [x] Featured Products
  - [x] New Arrivals
  - [x] Best Sellers
  - [x] Recommended Products
  - [x] Footer hoàn chỉnh
- [x] Header cố định khi scroll (fine-tune Layout.tsx) + search hoạt động.
- [x] Responsive Mobile/Tablet/Desktop.
- [ ] Loading Skeleton / Empty State / Error State cho các section list.

### 2. Product Detail

- [x] Gallery ảnh + thumbnail navigation (đồng bộ state).
- [x] Image Zoom (modal/overlay) khi click.
- [ ] Product Variants (màu sắc/kích thước...):
  - [ ] chọn variant bắt buộc
  - [ ] inventory status theo variant (mock)
- [x] Quantity selector với validation theo stock.
- [x] Add To Cart (dispatch vào cartSlice) — không dùng state fake.
- [x] Buy Now (tạo route/flow đến Checkout với items đã chọn).
- [ ] Reviews & Ratings (render list + rating trung bình; có skeleton/error).
- [x] Related Products.
- [x] Recently Viewed Products (lưu LocalStorage).

### 3. Cart

- [x] Thay hardcode bằng dữ liệu từ cartSlice (persist LocalStorage).
- [x] Add/Remove item (từ ProductDetail và trong Cart).
- [x] Update quantity (min/max theo stock).
- [x] Select/Deselect item + select all.
- [x] Voucher Apply:
  - [x] Input voucher
  - [x] Validate (mockApi/local logic)
  - [x] Hiển thị toast khi áp dụng thành công/thất bại
- [x] Shipping Fee Mock (tính theo mock logic).
- [x] Cart Summary (tổng, giảm giá, phí ship).
- [x] Nút chuyển đến Checkout hoạt động.
- [ ] Empty State / Error State / Loading.

### 4. Checkout

- [x] Tạo trang `Checkout`:
  - [x] Shipping Address Form (validation)
  - [x] Payment Method selection
  - [x] Order Summary (tự động theo cart state)
  - [x] Voucher support
  - [x] Place Order (tạo order vào mock storage)
  - [x] Order Success page
- [x] Error handling cho mọi bước.
- [ ] Skeleton trong lúc “đặt hàng”.

## Phase 2 — User Features

### 5. Authentication

- [ ] Login page + validation
- [ ] Register page + validation
- [ ] Forgot password (mock)
- [ ] Protected Routes theo role (USER/ADMIN)

### 6. Account Center

- [ ] Profile
- [ ] Change Password
- [ ] Order History + Order Detail
- [ ] Wishlist
- [ ] Address Management

## Phase 3 — Admin System

### 7. Admin Dashboard

- [ ] Biểu đồ thống kê + các KPI (mock)

### 8. Product CRUD

- [ ] Table + search/filter/sort + pagination
- [ ] Add/Edit/Delete (modal/dialog)
- [ ] Stock/variants update (mock)

### 9. Category CRUD

- [ ] CRUD hoàn chỉnh

### 10. Brand CRUD

- [ ] CRUD hoàn chỉnh

### 11. User CRUD

- [ ] CRUD hoàn chỉnh + lock/unlock

### 12. Order Management

- [ ] List đơn + detail + update trạng thái

### 13. Voucher Management

- [ ] CRUD hoàn chỉnh

### 14. Statistics & Charts

- [ ] Biểu đồ doanh thu/tăng trưởng (mockApi)

## Production Checklist (áp dụng cho mọi phase)

- [x] Không TODO/FIXME còn sót trong code production.
- [x] Không placeholder/fake button — mọi nút/form đều hoạt động với mock-data.
- [x] TypeScript strict: không lỗi.
- [ ] ESLint không lỗi.
- [ ] Không component chưa sử dụng (tránh dead code).
- [x] Responsive + Dark Mode hoạt động.
