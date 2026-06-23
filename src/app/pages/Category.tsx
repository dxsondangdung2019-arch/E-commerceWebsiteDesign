import { useParams, Link } from "react-router";
import { products, categories } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export function Category() {
  const { slug } = useParams();
  const category = categories.find((c) => c.id === slug);
  const categoryProducts = products.filter((p) => p.category === slug);
  const [sortBy, setSortBy] = useState("popular");

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy danh mục</h2>
        <Link to="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    );
  }

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popular":
        return b.sold - a.sold;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">
            {categoryProducts.length} sản phẩm
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Sắp xếp theo:</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
                className={
                  sortBy === "popular"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }
              >
                Phổ biến
              </Button>
              <Button
                variant={sortBy === "latest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("latest")}
                className={
                  sortBy === "latest"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }
              >
                Mới nhất
              </Button>
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rating")}
                className={
                  sortBy === "rating"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }
              >
                Đánh giá
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600">Không có sản phẩm nào trong danh mục này</p>
          </div>
        )}
      </div>
    </div>
  );
}
