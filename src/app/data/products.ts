export interface ProductVariantOption {
  id: string;
  value: string;
  stockDelta: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: ProductVariantOption[];
}

export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
  category: string;
  location: string;
  description: string;
  images: string[];
  stock: number;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export const categories = [
  { id: "electronics", name: "Điện tử", icon: "Laptop" },
  { id: "fashion", name: "Thời trang", icon: "Shirt" },
  { id: "beauty", name: "Làm đẹp", icon: "Sparkles" },
  { id: "home", name: "Nhà cửa", icon: "Home" },
  { id: "sports", name: "Thể thao", icon: "Dumbbell" },
  { id: "books", name: "Sách", icon: "Book" },
  { id: "toys", name: "Đồ chơi", icon: "Gamepad2" },
  { id: "food", name: "Thực phẩm", icon: "UtensilsCrossed" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Tai nghe Bluetooth True Wireless Cao Cấp",
    price: 299000,
    originalPrice: 599000,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    rating: 4.8,
    sold: 15234,
    discount: 50,
    category: "electronics",
    location: "Hà Nội",
    description:
      "Tai nghe bluetooth true wireless với chất lượng âm thanh tuyệt vời, pin 24h, chống nước IPX5",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    ],
    stock: 150,
    variants: [
      {
        id: "color",
        name: "Màu sắc",
        options: [
          { id: "black", value: "Đen", stockDelta: 0 },
          { id: "white", value: "Trắng", stockDelta: 5 },
        ],
      },
      {
        id: "size",
        name: "Bộ nhớ",
        options: [
          { id: "64", value: "64GB", stockDelta: 0 },
          { id: "128", value: "128GB", stockDelta: 10 },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "Minh",
        rating: 5,
        content: "Âm thanh rất ổn, pin dùng lâu và kết nối nhanh.",
        createdAt: "2026-06-20",
      },
      {
        id: "r2",
        user: "Linh",
        rating: 4,
        content: "Thiết kế đẹp, thích hợp cho học tập và nghe nhạc.",
        createdAt: "2026-06-18",
      },
    ],
  },
  {
    id: "2",
    name: "Áo Thun Nam Nữ Form Rộng Unisex Chất Cotton",
    price: 89000,
    originalPrice: 150000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    rating: 4.5,
    sold: 8943,
    discount: 41,
    category: "fashion",
    location: "TP. Hồ Chí Minh",
    description:
      "Áo thun form rộng unisex, chất cotton thoáng mát, nhiều màu sắc",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    ],
    stock: 500,
  },
  {
    id: "3",
    name: "Kem Dưỡng Da Mặt Vitamin C Dưỡng Trắng",
    price: 159000,
    originalPrice: 320000,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    rating: 4.9,
    sold: 21456,
    discount: 50,
    category: "beauty",
    location: "Hà Nội",
    description:
      "Kem dưỡng da với vitamin C tự nhiên, giúp dưỡng trắng và chống lão hóa",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
    ],
    stock: 200,
  },
  {
    id: "4",
    name: "Đèn LED Thông Minh Điều Khiển Bằng App",
    price: 199000,
    originalPrice: 399000,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400",
    rating: 4.6,
    sold: 5621,
    discount: 50,
    category: "home",
    location: "Đà Nẵng",
    description: "Đèn LED thông minh, điều khiển qua app, 16 triệu màu",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
    ],
    stock: 80,
  },
  {
    id: "5",
    name: "Giày Thể Thao Nam Nữ Sneaker Đế Cao Su",
    price: 249000,
    originalPrice: 450000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    rating: 4.7,
    sold: 12890,
    discount: 45,
    category: "sports",
    location: "TP. Hồ Chí Minh",
    description: "Giày sneaker thể thao năng động, đế cao su bền chắc",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    ],
    stock: 300,
  },
  {
    id: "6",
    name: "Đồng Hồ Thông Minh Smartwatch Đo Nhịp Tim",
    price: 599000,
    originalPrice: 1200000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.8,
    sold: 9876,
    discount: 50,
    category: "electronics",
    location: "Hà Nội",
    description:
      "Smartwatch đa năng với tính năng đo nhịp tim, đếm bước chân, thông báo cuộc gọi",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
    ],
    stock: 120,
  },
  {
    id: "7",
    name: "Túi Xách Nữ Da PU Cao Cấp Thời Trang",
    price: 179000,
    originalPrice: 350000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    rating: 4.4,
    sold: 6543,
    discount: 49,
    category: "fashion",
    location: "TP. Hồ Chí Minh",
    description: "Túi xách thời trang da PU cao cấp, thiết kế sang trọng",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    ],
    stock: 90,
  },
  {
    id: "8",
    name: "Son Môi Lì Lâu Trôi Nhiều Màu Sắc",
    price: 69000,
    originalPrice: 120000,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    rating: 4.9,
    sold: 18765,
    discount: 43,
    category: "beauty",
    location: "Hà Nội",
    description: "Son môi lì lâu trôi, nhiều màu sắc thời thượng",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800",
    ],
    stock: 450,
  },
  {
    id: "9",
    name: "Bình Giữ Nhiệt Inox 304 Cao Cấp 500ml",
    price: 129000,
    originalPrice: 250000,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    rating: 4.7,
    sold: 11234,
    discount: 48,
    category: "home",
    location: "Đà Nẵng",
    description: "Bình giữ nhiệt inox 304 cao cấp, giữ nóng lạnh 12h",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    ],
    stock: 250,
  },
  {
    id: "10",
    name: "Balo Laptop Chống Nước Đựng 15.6 inch",
    price: 219000,
    originalPrice: 450000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    rating: 4.6,
    sold: 7890,
    discount: 51,
    category: "electronics",
    location: "TP. Hồ Chí Minh",
    description: "Balo laptop chống nước, nhiều ngăn tiện dụng",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
    ],
    stock: 180,
  },
  {
    id: "11",
    name: "Váy Nữ Dáng Dài Thời Trang Hàn Quốc",
    price: 149000,
    originalPrice: 300000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    rating: 4.5,
    sold: 4567,
    discount: 50,
    category: "fashion",
    location: "Hà Nội",
    description: "Váy dài thời trang phong cách Hàn Quốc",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    ],
    stock: 120,
  },
  {
    id: "12",
    name: "Ốp Lưng iPhone Chống Sốc Trong Suốt",
    price: 39000,
    originalPrice: 80000,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
    rating: 4.3,
    sold: 23456,
    discount: 51,
    category: "electronics",
    location: "TP. Hồ Chí Minh",
    description: "Ốp lưng trong suốt chống sốc cho iPhone",
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
    ],
    stock: 600,
  },
];

export const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
    title: "Sale lớn mùa hè",
    link: "/category/electronics",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200",
    title: "Thời trang mới nhất",
    link: "/category/fashion",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200",
    title: "Giảm giá đến 50%",
    link: "/search",
  },
];
