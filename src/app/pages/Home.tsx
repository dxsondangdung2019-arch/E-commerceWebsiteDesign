import { useMemo, useState } from "react";
import { products, banners } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { Badge } from "../components/ui/badge";
import { SectionState } from "../components/SectionState";
import { Zap, TrendingUp, Tag } from "lucide-react";

export function Home() {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const flashSaleProducts = useMemo(() => products.slice(0, 6), []);
  const trendingProducts = useMemo(() => products.slice(6, 12), []);
  const recommendedProducts = useMemo(() => products.slice(0, 8), []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SectionState
          kind="loading"
          title="Đang tải trang chủ"
          message="Đang lấy sản phẩm đề xuất cho bạn"
          count={6}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SectionState
          kind="error"
          title="Không thể tải trang chủ"
          message={error}
          actionLabel="Thử lại"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Carousel */}
      <div className="mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <Link to={banner.link}>
                  <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                      <div className="text-white p-8">
                        <h2 className="text-4xl font-bold mb-2">
                          {banner.title}
                        </h2>
                        <p className="text-xl">Khuyến mãi hấp dẫn</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Flash Sale Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-t-lg p-4">
          <div className="flex items-center gap-3 text-white">
            <Zap className="w-6 h-6 fill-white" />
            <h2 className="text-2xl font-bold">FLASH SALE</h2>
            <Badge className="bg-white text-orange-600 hover:bg-white">
              Đang diễn ra
            </Badge>
          </div>
        </div>
        <div className="bg-white rounded-b-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        <Link
          to="/category/electronics"
          className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
            <Tag className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm">Giảm giá sốc</p>
        </Link>
        <Link
          to="/category/electronics"
          className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm">Freeship 0đ</p>
        </Link>
        <Link
          to="/category/beauty"
          className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-pink-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-pink-600" />
          </div>
          <p className="text-sm">Hàng hot</p>
        </Link>
        <Link
          to="/category/fashion"
          className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
            <Tag className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm">Thời trang</p>
        </Link>
        <Link
          to="/category/electronics"
          className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm">Điện tử</p>
        </Link>
        <Link
          to="/category/home"
          className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
            <Tag className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm">Nhà cửa</p>
        </Link>
      </div>

      {/* Trending Products */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Gợi ý hôm nay</h2>
        {recommendedProducts.length === 0 ? (
          <SectionState
            kind="empty"
            title="Chưa có gợi ý"
            message="Hãy quay lại sau để xem thêm sản phẩm mới."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
